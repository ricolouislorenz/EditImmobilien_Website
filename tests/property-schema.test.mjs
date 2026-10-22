import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { test } from "node:test";

// PGlite ist eine separate lokale PostgreSQL-Testumgebung, keine Projektabhängigkeit.
// PROPERTY_SQL_TEST_MODULE kann auf das temporär installierte Paketverzeichnis zeigen.
const require = createRequire(import.meta.url);
const { PGlite } = require(process.env.PROPERTY_SQL_TEST_MODULE || "@electric-sql/pglite");
const migration = await readFile(new URL("../supabase/migrations/0003_property_admin_prerequisites.sql", import.meta.url), "utf8");
const verification = await readFile(new URL("../supabase/setup/admin_voraussetzungen_pruefen.sql", import.meta.url), "utf8");
const firstId = "00000000-0000-4000-8000-000000000001";
const secondId = "00000000-0000-4000-8000-000000000002";

async function fixture() {
  const db = new PGlite();
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;
    create schema auth;
    grant usage on schema public, auth to anon, authenticated, service_role;
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create table public.properties (
      id uuid primary key default gen_random_uuid(), title text not null,
      location text not null default 'Hamburg', price text not null default '100 EUR',
      bedrooms numeric, bathrooms numeric, area numeric, area_label text,
      type text not null default 'Haus', status text not null default 'active',
      images text[] not null default '{}', sort_order integer not null default 0,
      created_at timestamptz not null default now(), updated_at timestamptz not null default now()
    );
    alter table public.properties enable row level security;
    grant all on public.properties to anon, authenticated, service_role;
    create policy read_all on public.properties for select using (true);
    create policy write_signed_in on public.properties for all
      using (auth.uid() is not null) with check (auth.uid() is not null);
    insert into public.properties (id, title, sort_order, images, created_at) values
      ('${firstId}', 'Erstes Haus', 1, '{erstes.jpg}', '2025-01-01'),
      ('${secondId}', 'Zweites Haus', 2, '{zweites.jpg}', '2025-02-01');
  `);
  return db;
}

test("Datenbankeinrichtung mit vorhandenem Supabase-Schema und simulierten Rollen", async (t) => {
  const db = await fixture();
  t.after(() => db.close());
  const before = (await db.query("select * from public.properties order by id")).rows;

  await t.test("Bestehende Immobilien bleiben unverändert, nur Objektnummern kommen hinzu", async () => {
    await db.exec(migration);
    const after = (await db.query("select * from public.properties order by id")).rows;
    assert.deepEqual(after.map(({ reference, ...row }) => row), before);
    assert.deepEqual(after.map((row) => row.reference), ["EI-001", "EI-002"]);
  });

  await t.test("Kontrollabfrage bestätigt Struktur und Aufrufrechte", async () => {
    const result = (await db.query(verification)).rows[0];
    for (const field of ["fehlende_nummern", "ungueltige_nummern", "doppelte_nummern"]) assert.equal(Number(result[field]), 0);
    for (const field of ["nummernspalte_mit_automatik", "eindeutigkeit_gesichert", "nummernzaehler_vorhanden", "nummernfunktion_vorhanden", "sortierfunktion_vorhanden", "angemeldete_duerfen_umsortieren", "sortierung_beachtet_bestehende_rechte"]) assert.equal(result[field], true);
    assert.equal(result.gaeste_duerfen_umsortieren, false);
  });

  await t.test("Angemeldetes Konto kann eine Immobilie samt automatischer Nummer anlegen", async () => {
    await db.exec(`set role authenticated; set request.jwt.claim.sub = '${firstId}';`);
    const row = (await db.query("insert into public.properties (title) values ('Neu') returning reference")).rows[0];
    assert.equal(row.reference, "EI-003");
    await db.exec("reset role; reset request.jwt.claim.sub;");
  });

  await t.test("Wiederholtes Ausführen erhält Nummern und bereits verbrauchte Zählerstände", async () => {
    await db.query("select nextval('public.properties_reference_seq')");
    await db.exec(migration);
    const row = (await db.query("insert into public.properties (title) values ('Nach Wiederholung') returning reference")).rows[0];
    assert.equal(row.reference, "EI-005");
  });

  await t.test("EI-1000 wird nicht gekürzt; fehlende Nummern werden oberhalb vorhandener ergänzt", async () => {
    await db.exec("alter table public.properties alter column reference drop not null; insert into public.properties (title, reference) values ('Vorhanden', 'EI-999'), ('Ohne Nummer', null);");
    await db.exec(migration);
    const row = (await db.query("select reference from public.properties where title = 'Ohne Nummer'")).rows[0];
    assert.equal(row.reference, "EI-1000");
    assert.equal((await db.query("insert into public.properties (title) values ('Weitere') returning reference")).rows[0].reference, "EI-1001");
  });

  await t.test("Sortieren verschiebt betroffene Einträge, aber nicht das bearbeitete Objekt", async () => {
    await db.exec(`set role authenticated; set request.jwt.claim.sub = '${firstId}';`);
    await db.query("select public.shift_property_order(1, $1::uuid)", [secondId]);
    const rows = (await db.query("select id, sort_order from public.properties where id = any($1::uuid[]) order by id", [[firstId, secondId]])).rows;
    assert.equal(rows[0].sort_order, 2);
    assert.equal(rows[1].sort_order, 2);
    // Die neue Position des bearbeiteten Objekts speichert erst der anschließende API-Aufruf.
    await assert.rejects(db.query("select public.shift_property_order(-1, $1::uuid)", [secondId]), /Ungueltige/);
    await db.exec("reset role; reset request.jwt.claim.sub;");
  });

  await t.test("Gäste können Funktionen und Nummernzähler nicht verwenden", async () => {
    await db.exec("set role anon;");
    await assert.rejects(db.query("select public.shift_property_order(1, $1::uuid)", [firstId]), /permission denied/);
    await assert.rejects(db.query("select public.next_property_reference()"), /permission denied/);
    await assert.rejects(db.query("select nextval('public.properties_reference_seq')"), /permission denied/);
    await db.exec("reset role;");
  });

  await t.test("Sortierfunktion umgeht eingeschränkte Schreibrechte nicht", async () => {
    await db.exec("drop policy write_signed_in on public.properties; set role authenticated;");
    await db.exec(`set request.jwt.claim.sub = '${firstId}';`);
    const snapshot = (await db.query("select id, sort_order from public.properties order by id")).rows;
    await db.query("select public.shift_property_order(2, $1::uuid)", [secondId]);
    assert.deepEqual((await db.query("select id, sort_order from public.properties order by id")).rows, snapshot);
    await db.exec("reset role; reset request.jwt.claim.sub;");
  });
});

test("Unerwartete bestehende Objektnummer: gesamte Einrichtung wird zurückgerollt", async (t) => {
  const db = await fixture();
  t.after(() => db.close());
  await db.exec("alter table public.properties add column reference text; update public.properties set reference = 'Nicht automatisch ersetzen';");
  await assert.rejects(db.exec(migration), /Unerwartete Objektnummer/);
  await db.exec("rollback;");
  assert.equal((await db.query("select to_regclass('public.properties_reference_seq') as seq")).rows[0].seq, null);
  assert.equal((await db.query("select reference from public.properties limit 1")).rows[0].reference, "Nicht automatisch ersetzen");
});

test("Älterer alleinstehender Unique-Index bleibt als Eindeutigkeitsregel nutzbar", async (t) => {
  const db = await fixture();
  t.after(() => db.close());
  await db.exec(`alter table public.properties add column reference text;
    update public.properties set reference = case when id = '${firstId}' then 'EI-010' else 'EI-020' end;
    create unique index properties_reference_key on public.properties (reference);`);
  await db.exec(migration);
  assert.equal((await db.query(verification)).rows[0].eindeutigkeit_gesichert, true);
  assert.equal((await db.query("insert into public.properties (title) values ('Weiter') returning reference")).rows[0].reference, "EI-021");
});

test("Doppelte vorhandene Nummern: auch ein später Fehler hinterlässt keine Teiländerungen", async (t) => {
  const db = await fixture();
  t.after(() => db.close());
  await db.exec("alter table public.properties add column reference text; update public.properties set reference = 'EI-010';");
  await assert.rejects(db.exec(migration), { code: "23505" });
  await db.exec("rollback;");
  assert.equal((await db.query("select to_regprocedure('public.next_property_reference()') as fn")).rows[0].fn, null);
  assert.equal((await db.query("select to_regclass('public.properties_reference_seq') as seq")).rows[0].seq, null);
  assert.equal((await db.query("select count(*) as n from public.properties where reference = 'EI-010'")).rows[0].n, 2);
});
