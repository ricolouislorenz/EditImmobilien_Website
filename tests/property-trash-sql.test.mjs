import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { test } from 'node:test';
const require = createRequire(import.meta.url);
const { PGlite } = require(process.env.PROPERTY_SQL_TEST_MODULE || '@electric-sql/pglite');
const migration = await readFile(new URL('../supabase/migrations/0006_property_trash_and_image_cleanup.sql', import.meta.url), 'utf8');
const prerequisite = await readFile(new URL('../supabase/migrations/0003_property_admin_prerequisites.sql', import.meta.url), 'utf8');
const saveMigration = await readFile(new URL('../supabase/migrations/0004_atomic_property_save.sql', import.meta.url), 'utf8');
const verification = await readFile(new URL('../supabase/setup/papierkorb_pruefen.sql', import.meta.url), 'utf8');
const uid = '00000000-0000-4000-8000-000000000001';
const first = '00000000-0000-4000-8000-000000000011';
const second = '00000000-0000-4000-8000-000000000012';
const used = `${first}/used.jpg`; const unused = `${first}/unused.jpg`;
async function fixture(t) {
  const db = new PGlite(); t.after(() => db.close());
  await db.exec(`
    create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create schema storage; create schema private;
    grant usage on schema public,auth,storage to anon,authenticated,service_role;
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.uid',true),'')::uuid $$;
    create function public.admin_session_is_active() returns boolean language sql stable as $$ select coalesce(current_setting('request.active',true),'')='true' $$;
    create table public.properties (
      id uuid primary key default gen_random_uuid(), title text not null, location text not null, price text not null,
      type text not null, status text not null default 'active', bedrooms numeric, bathrooms numeric, area numeric,
      area_label text, images text[] not null default '{}', sort_order integer not null default 0,
      created_at timestamptz not null default now(), updated_at timestamptz not null default now()
    );
    alter table public.properties enable row level security;
    grant all on public.properties to authenticated,service_role; grant select on public.properties to anon;
    create policy read_all on public.properties for select using(true);
    create policy signed_write on public.properties for all to authenticated using(auth.uid() is not null and public.admin_session_is_active()) with check(auth.uid() is not null and public.admin_session_is_active());
    create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text, created_at timestamptz default now()-interval '3 days', updated_at timestamptz default now()-interval '3 days');
    alter table storage.objects enable row level security;
    grant all on storage.objects to authenticated,service_role; grant select on storage.objects to anon;
    create policy storage_read on storage.objects for select using(true);
    create policy storage_write on storage.objects for all to authenticated using(public.admin_session_is_active()) with check(public.admin_session_is_active());
    insert into public.properties(id,title,location,price,type,images) values('${first}','Testhaus','Holm','100 EUR','Haus',array['${used}']);
    insert into storage.objects(bucket_id,name) values('property-images','${used}'),('property-images','${unused}');
  `);
  await db.exec(prerequisite); await db.exec(saveMigration); await db.exec(migration);
  return db;
}
async function admin(db) { await db.exec(`reset role; set role authenticated; set request.uid='${uid}'; set request.active='true';`); }
async function trash(db) {
  const timestamp = (await db.query('select updated_at::text from public.properties where id=$1',[first])).rows[0].updated_at;
  return (await db.query('select public.delete_property($1,$2) as value',[first,timestamp])).rows[0].value;
}
async function claim(db,dry=true) {
  await db.exec('reset role; set role service_role;');
  return (await db.query('select public.claim_property_image_cleanup($1,100) as value',[dry])).rows[0].value;
}

test('Löschen bestätigt ID, archiviert vollständig und erhält die Bilder; Einrichtung wiederholbar',async(t)=>{
  const db=await fixture(t); await db.exec(migration);
  for(const [key,value] of Object.entries((await db.query(verification)).rows[0])) assert.equal(value,key!=='gaeste_duerfen_wiederherstellen',key);
  await admin(db);
  const before=(await db.query('select * from public.properties')).rows[0];
  assert.deepEqual(await trash(db),{id:first});
  assert.equal((await db.query('select * from public.properties')).rows.length,0);
  const archived=(await db.query('select * from public.property_trash')).rows[0];
  assert.equal(archived.snapshot.reference,before.reference); assert.deepEqual(archived.snapshot.images,[used]);
  assert.ok(new Date(archived.expires_at)-new Date(archived.deleted_at)>=30*86400000);
  assert.equal((await db.query('select count(*) from storage.objects')).rows[0].count,2);
  assert.equal((await db.query('delete from storage.objects where name=$1 returning *',[used])).rows.length,0,'Papierkorb schützt Bilder');
});

test('Fehlende Zeile, veralteter Stand und fehlende Rechte ergeben keine Löschbestätigung',async(t)=>{
  const db=await fixture(t); await admin(db);
  await assert.rejects(db.query('select public.delete_property($1,now())',[second]),{code:'40001'});
  await assert.rejects(db.query("select public.delete_property($1,'2000-01-01')",[first]),{code:'40001'});
  await db.exec("set request.active='false';");
  await assert.rejects(trash(db),{code:'42501'});
  assert.equal((await db.query('select count(*) from public.properties')).rows[0].count,1);
});

test('Wiederherstellung behält Nummer, Inhalt und Bilder, ordnet hinten ein und leert Papierkorb',async(t)=>{
  const db=await fixture(t); await admin(db); await trash(db);
  await db.exec(`insert into public.properties(id,title,location,price,type,sort_order) values('${second}','Zweites','Holm','200','Haus',20);`);
  const restored=(await db.query('select public.restore_property($1) as value',[first])).rows[0].value;
  assert.deepEqual(restored,{id:first});
  const row=(await db.query('select * from public.properties where id=$1',[first])).rows[0];
  assert.equal(row.reference,'EI-001'); assert.equal(row.sort_order,21); assert.deepEqual(row.images,[used]);
  assert.equal((await db.query('select count(*) from public.property_trash')).rows[0].count,0);
});

test('Fehlgeschlagene Wiederherstellung behält den gesamten Papierkorbeintrag',async(t)=>{
  const db=await fixture(t); await admin(db); await trash(db);
  await db.exec(`insert into public.properties(id,title,location,price,type) values('${first}','Kollision','Holm','100','Haus');`);
  await assert.rejects(db.query('select public.restore_property($1)',[first]),{code:'23505'});
  assert.equal((await db.query('select count(*) from public.property_trash')).rows[0].count,1);
});

test('Vorschau ändert nichts und schützt verwendete, junge sowie nicht verwaltete Dateien',async(t)=>{
  const db=await fixture(t);
  await db.exec(`insert into storage.objects(bucket_id,name,created_at,updated_at) values
    ('property-images','${first}/jung.jpg',now(),now()),
    ('property-images','logo.jpg',now()-interval '3 days',now()-interval '3 days'),
    ('other','${first}/other.jpg',now()-interval '3 days',now()-interval '3 days');`);
  assert.deepEqual((await claim(db)).paths,[unused]);
  await db.exec('reset role;');
  assert.equal((await db.query('select count(*) from private.property_image_cleanup_claims')).rows[0].count,0);
  assert.equal((await db.query('select count(*) from storage.objects')).rows[0].count,5);
});

test('Abgelaufenen Papierkorb erst im echten Lauf entfernen; Storage-Dateien niemals durch SQL löschen',async(t)=>{
  const db=await fixture(t); await admin(db); await trash(db);
  await db.exec("reset role; update public.property_trash set expires_at=now()-interval '1 day';");
  await admin(db); await assert.rejects(db.query('select public.restore_property($1)',[first]),{code:'22023'});
  const preview=await claim(db); assert.equal(preview.expired_entries,1); assert.deepEqual(preview.paths,[unused,used].sort());
  await db.exec('reset role;'); assert.equal((await db.query('select count(*) from public.property_trash')).rows[0].count,1);
  const real=await claim(db,false); assert.deepEqual(real.paths,[unused,used].sort());
  await db.exec('reset role;'); assert.equal((await db.query('select count(*) from public.property_trash')).rows[0].count,0);
  assert.equal((await db.query('select count(*) from storage.objects')).rows[0].count,2);
});

test('Reservierte Bereinigungsdatei kann nicht nachträglich an ein Angebot angehängt oder überschrieben werden',async(t)=>{
  const db=await fixture(t); assert.deepEqual((await claim(db,false)).paths,[unused]); await admin(db);
  await assert.rejects(db.query('update public.properties set images=array[$1]',[unused]),{code:'23514'});
  assert.equal((await db.query('update storage.objects set updated_at=now() where name=$1 returning *',[unused])).rows.length,0);
  assert.deepEqual((await claim(db,false)).paths,[unused],'Fehlgeschlagene API-Löschung bleibt wiederholbar');
});

test('Öffentliche und kodierte Storage-URLs sowie gemeinsam verwendete Bilder bleiben geschützt',async(t)=>{
  const db=await fixture(t);
  const encoded=used.replace('used','%75sed');
  await db.query('update public.properties set images=array[$1]',[`https://example.supabase.co/storage/v1/object/public/property-images/${encoded}?v=1`]);
  assert.deepEqual((await claim(db)).paths,[unused]);
  await admin(db); assert.equal((await db.query('delete from storage.objects where name=$1 returning *',[used])).rows.length,0);
});

test('Gäste sehen den Papierkorb nicht; Browserkonten dürfen keinen Bereinigungslauf starten',async(t)=>{
  const db=await fixture(t); await admin(db); await trash(db);
  await assert.rejects(db.query('select public.claim_property_image_cleanup()'),{code:'42501'});
  await db.exec('reset role; set role anon;');
  await assert.rejects(db.query('select * from public.property_trash'),{code:'42501'});
  await assert.rejects(db.query('select public.restore_property($1)',[first]),{code:'42501'});
});
