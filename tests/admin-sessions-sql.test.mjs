import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { test } from 'node:test';
const require = createRequire(import.meta.url);
const { PGlite } = require(process.env.PROPERTY_SQL_TEST_MODULE || '@electric-sql/pglite');
const migration = await readFile(new URL('../supabase/migrations/0005_admin_sessions.sql', import.meta.url), 'utf8');
const verification = await readFile(new URL('../supabase/setup/admin_sitzungen_pruefen.sql', import.meta.url), 'utf8');
const uid = '00000000-0000-4000-8000-000000000001';
const otherUid = '00000000-0000-4000-8000-000000000002';
const first = '00000000-0000-4000-8000-000000000011';
const second = '00000000-0000-4000-8000-000000000012';
const third = '00000000-0000-4000-8000-000000000013';
async function fixture(t) {
  const db = new PGlite(); t.after(() => db.close());
  await db.exec(`
    create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create schema storage;
    grant usage on schema public, auth, storage to anon, authenticated;
    create function auth.jwt() returns jsonb language sql stable as
      $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
    create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt()->>'sub')::uuid $$;
    create table auth.sessions(id uuid primary key, user_id uuid not null, created_at timestamptz not null, not_after timestamptz);
    create table public.properties(id integer primary key, title text);
    create table storage.objects(id integer primary key, bucket_id text not null, name text);
    alter table public.properties enable row level security;
    alter table storage.objects enable row level security;
    grant select on public.properties, storage.objects to anon, authenticated;
    grant insert, update, delete on public.properties, storage.objects to authenticated;
    create policy public_read on public.properties for select using (true);
    create policy signed_write on public.properties for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
    create policy image_read on storage.objects for select using (true);
    create policy image_write on storage.objects for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
    insert into auth.sessions values ('${first}','${uid}',now() - interval '2 days',null);
    insert into public.properties values (1,'Original');
    insert into storage.objects values (1,'property-images','alt.jpg');
  `);
  await db.exec(migration);
  return db;
}
async function sign(db, id = first, user = uid) {
  await db.exec(`reset role; set role authenticated; set request.jwt.claims = '${JSON.stringify({ sub: user, session_id: id })}';`);
}
async function check(db, activity = false) { return (await db.query('select public.admin_session_check($1) as value', [activity])).rows[0].value; }
async function active(db) { return (await db.query('select public.admin_session_is_active() as value')).rows[0].value; }
async function newer(db) {
  await db.exec(`reset role; insert into auth.sessions values ('${second}','${uid}',now() - interval '1 day',null);`);
}

test('Einrichtung wiederholbar; erst Sitzungsprüfung, dann Immobilien und Bilder ändern', async (t) => {
  const db = await fixture(t); await db.exec(migration);
  const flags = (await db.query(verification)).rows[0];
  for (const [key, value] of Object.entries(flags)) assert.equal(value, key !== 'gaeste_duerfen_pruefen', key);
  await sign(db);
  assert.equal(await active(db), false);
  await assert.rejects(db.exec("insert into public.properties values (2,'Neu')"), { code: '42501' });
  assert.equal((await check(db)).status, 'active'); assert.equal(await active(db), true);
  await db.exec("insert into public.properties values (2,'Neu'); update public.properties set title='Geändert' where id=1; insert into storage.objects values (2,'property-images','neu.jpg'); delete from storage.objects where id=1;");
  assert.equal((await db.query('select count(*) from storage.objects')).rows[0].count, 1);
  await db.exec('reset role; set role anon;');
  assert.equal((await db.query('select count(*) from public.properties')).rows[0].count, 2);
  await assert.rejects(check(db), { code: '42501' });
  await sign(db); await assert.rejects(db.query('select * from private.admin_sessions'), { code: '42501' });
});

test('Neue Anmeldung sperrt ältere Sitzung sofort auch vor Registrierung im Adminbereich', async (t) => {
  const db = await fixture(t); await sign(db); await check(db); await newer(db); await sign(db);
  assert.equal(await active(db), false); assert.equal((await check(db, true)).status, 'replaced');
  await assert.rejects(db.exec("insert into public.properties values (2,'Verboten')"), { code: '42501' });
  await assert.rejects(db.exec("insert into storage.objects values (2,'property-images','verboten.jpg')"), { code: '42501' });
  assert.equal((await db.query("update public.properties set title='Verboten' returning *")).rows.length, 0);
  assert.equal((await db.query('delete from storage.objects returning *')).rows.length, 0);
  await sign(db, second); assert.equal((await check(db)).status, 'active'); assert.equal(await active(db), true);
});

test('Nach Abmelden der neueren Sitzung lebt die ältere nicht wieder auf', async (t) => {
  const db = await fixture(t); await sign(db); await check(db); await newer(db); await sign(db, second); await check(db);
  await db.exec(`reset role; delete from auth.sessions where id='${second}';`); await sign(db);
  assert.equal((await check(db, true)).status, 'replaced'); assert.equal(await active(db), false);
  await sign(db, second); assert.equal((await check(db)).status, 'ended');
});

test('30 Minuten ohne Bedienung sperren Schreibzugriff; verspätete Aktivität reaktiviert nicht', async (t) => {
  const db = await fixture(t); await sign(db); await check(db);
  await db.exec("reset role; update private.admin_sessions set last_activity_at=now()-interval '31 minutes';");
  await sign(db); assert.equal(await active(db), false); assert.equal((await check(db, true)).status, 'expired');
  await assert.rejects(db.exec("insert into public.properties values (2,'Verboten')"), { code: '42501' });
});

test('Reine Prüfungen verlängern nicht; tatsächliche Bedienung verlängert die eigene Sitzung', async (t) => {
  const db = await fixture(t); await sign(db); await check(db);
  await db.exec("reset role; update private.admin_sessions set last_activity_at=now()-interval '10 minutes';");
  await sign(db); const idle = await check(db); assert.ok(idle.remaining_seconds < 1201);
  const touched = await check(db, true); assert.ok(touched.remaining_seconds > 1799);
  await db.exec(`reset role; insert into auth.sessions values ('${third}','${otherUid}',now(),null);`);
  await sign(db, third, otherUid); assert.equal((await check(db)).status, 'active');
  await sign(db); assert.equal(await active(db), true, 'Andere Konten bleiben unabhängig');
});

test('Abgelaufene Auth-Sitzung oder fehlende Sitzungskennung werden abgelehnt', async (t) => {
  const db = await fixture(t);
  await db.exec(`update auth.sessions set not_after=now()-interval '1 minute';`); await sign(db);
  assert.equal((await check(db)).status, 'expired'); assert.equal(await active(db), false);
  await db.exec(`set request.jwt.claims = '{"sub":"${uid}"}';`);
  assert.equal((await check(db)).status, 'ended');
});
