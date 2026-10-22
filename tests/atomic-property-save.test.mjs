import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { test } from "node:test";
const require = createRequire(import.meta.url);
const { PGlite } = require(process.env.PROPERTY_SQL_TEST_MODULE || "@electric-sql/pglite");
const prerequisites = await readFile(new URL("../supabase/migrations/0003_property_admin_prerequisites.sql", import.meta.url), "utf8");
const migration = await readFile(new URL("../supabase/migrations/0004_atomic_property_save.sql", import.meta.url), "utf8");
const verification = await readFile(new URL("../supabase/setup/atomares_speichern_pruefen.sql", import.meta.url), "utf8");
const firstId = "00000000-0000-4000-8000-000000000001";
const secondId = "00000000-0000-4000-8000-000000000002";
const newId = "00000000-0000-4000-8000-000000000003";
const input = (changes = {}) => ({ title: "Neues Haus", location: "25488 Holm", price: "100 EUR", type: "Haus", status: "active",
  bedrooms: null, bathrooms: null, area: null, area_label: null, images: ["property/new.jpg"], sort_order: 1, ...changes });

async function fixture(t) {
  const db = new PGlite();
  t.after(() => db.close());
  await db.exec(`
    create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth;
    grant usage on schema public, auth to anon, authenticated, service_role;
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create table public.properties (
      id uuid primary key default gen_random_uuid(), title text not null, location text not null, price text not null,
      type text not null, status text not null default 'active', bedrooms numeric, bathrooms numeric, area numeric,
      area_label text, images text[] not null default '{}', sort_order integer not null default 0,
      created_at timestamptz not null default now(), updated_at timestamptz not null default now()
    );
    alter table public.properties enable row level security;
    grant all on public.properties to anon, authenticated, service_role;
    create policy read_all on public.properties for select using (true);
    create policy write_signed_in on public.properties for all
      using (auth.uid() is not null) with check (auth.uid() is not null);
    insert into public.properties (id, title, location, price, type, sort_order) values
      ('${firstId}', 'Erstes Haus', 'Holm', '100 EUR', 'Haus', 1),
      ('${secondId}', 'Zweites Haus', 'Holm', '200 EUR', 'Haus', 2);
  `);
  await db.exec(prerequisites);
  await db.exec(migration);
  return db;
}
async function signIn(db) { await db.exec(`set role authenticated; set request.jwt.claim.sub = '${firstId}';`); }
async function snapshot(db) { return (await db.query("select * from public.properties order by id")).rows; }
async function save(db, id, isNew, payload) {
  return (await db.query("select public.save_property($1::uuid,$2::boolean,$3::jsonb) as result", [id, isNew, payload])).rows[0].result;
}

test("Einrichtung und Wiederholung ändern keine bestehenden Immobilien; Kontrollabfrage passt", async (t) => {
  const db = await fixture(t);
  const before = await snapshot(db);
  await db.exec(migration);
  assert.deepEqual(await snapshot(db), before);
  const result = (await db.query(verification)).rows[0];
  for (const [key, value] of Object.entries(result)) assert.equal(value, key !== "gaeste_duerfen_speichern", key);
});

test("Anlegen an belegter Position und Verschieben werden gemeinsam gespeichert", async (t) => {
  const db = await fixture(t); await signIn(db);
  assert.deepEqual(await save(db, newId, true, input()), { id: newId });
  const rows = await snapshot(db);
  assert.deepEqual(rows.map((row) => row.sort_order), [2, 3, 1]);
  assert.equal(rows[2].reference, "EI-003");
  assert.deepEqual(rows[2].images, ["property/new.jpg"]);
});

test("Bearbeiten mit neuer Position verschiebt andere Objekte und behält Nummer/Erstelldatum", async (t) => {
  const db = await fixture(t); const before = await snapshot(db); await signIn(db);
  await save(db, secondId, false, input({ title: "Bearbeitet" }));
  const after = await snapshot(db);
  assert.equal(after[0].sort_order, 2); assert.equal(after[1].sort_order, 1);
  assert.equal(after[1].title, "Bearbeitet");
  assert.equal(after[1].reference, before[1].reference);
  assert.equal(after[1].created_at.toISOString(), before[1].created_at.toISOString());
});

test("Unveränderte Position verschiebt keine Nachbarobjekte", async (t) => {
  const db = await fixture(t); const before = await snapshot(db); await signIn(db);
  await save(db, firstId, false, input({ title: "Nur Text geändert" }));
  const after = await snapshot(db);
  assert.deepEqual(after[1], before[1]); assert.equal(after[0].sort_order, 1);
});

for (const isNew of [true, false]) {
  test(`Fehler erst beim ${isNew ? "Anlegen" : "Ändern"}: bereits verschobene Positionen vollständig zurückrollen`, async (t) => {
    const db = await fixture(t); const before = await snapshot(db); await signIn(db);
    await assert.rejects(save(db, isNew ? newId : secondId, isNew, input({ title: null })), { code: "23502" });
    assert.deepEqual(await snapshot(db), before);
  });
}

test("Bereits vorhandene neue ID und fehlende bearbeitete ID werden ohne Verschieben abgelehnt", async (t) => {
  const db = await fixture(t); const before = await snapshot(db); await signIn(db);
  await assert.rejects(save(db, firstId, true, input()), { code: "23505" });
  await assert.rejects(save(db, newId, false, input()), { code: "22023" });
  assert.deepEqual(await snapshot(db), before);
});

test("Geschützte Felder und ungültige Eingaben können nicht per JSON überschrieben werden", async (t) => {
  const db = await fixture(t); const before = await snapshot(db); await signIn(db);
  for (const payload of [[], null, input({ sort_order: -1 }), input({ reference: "EI-999" }), input({ id: newId }), input({ created_at: "2000-01-01" })]) {
    await assert.rejects(save(db, newId, true, payload), { code: "22023" });
  }
  assert.deepEqual(await snapshot(db), before);
});

test("Gast und Konto ohne gültige Anmeldung dürfen nicht speichern", async (t) => {
  const db = await fixture(t); const before = await snapshot(db);
  await db.exec("set role anon;");
  await assert.rejects(save(db, newId, true, input()), { code: "42501" });
  await db.exec("set role authenticated;");
  await assert.rejects(save(db, newId, true, input()), { code: "42501" });
  assert.deepEqual(await snapshot(db), before);
});

test("RLS verweigert Zielobjekt: Verschieben anderer erlaubter Objekte wird zurückgerollt", async (t) => {
  const db = await fixture(t); const before = await snapshot(db);
  await db.exec(`drop policy write_signed_in on public.properties;
    create policy update_other on public.properties for update using (id <> '${secondId}') with check (true);`);
  await signIn(db);
  await assert.rejects(save(db, secondId, false, input()), { code: "42501" });
  assert.deepEqual(await snapshot(db), before);
});

test("RLS erlaubt nur einen Teil der Verschiebungen: gesamten Vorgang abbrechen", async (t) => {
  const db = await fixture(t); const before = await snapshot(db);
  await db.exec(`drop policy write_signed_in on public.properties;
    create policy update_one on public.properties for update using (id = '${firstId}') with check (true);
    create policy insert_allowed on public.properties for insert with check (true);`);
  await signIn(db);
  await assert.rejects(save(db, newId, true, input()), { code: "42501" });
  assert.deepEqual(await snapshot(db), before);
});
