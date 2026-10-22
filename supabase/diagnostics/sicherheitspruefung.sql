-- ÜBERGABE SICHERHEIT-02 / SICHERHEIT-05: Bestandsaufnahme vor Änderungen.
-- Im Supabase SQL-Editor vollständig ausführen. Ergebnis: eine Zelle namens bericht.
-- Ausschließlich lesend: keine Migration, keine Änderungen, kein Zugriff auf Kundendatensätze.
-- Ausgelesen werden Systemkataloge und die Konfiguration des Buckets property-images.
-- Kein Lesen von auth.users, Dateilisten, KV-Inhalten oder Funktionsquelltexten.

with
zielobjekte as (
  select c.oid, n.nspname as schema_name, c.relname as object_name,
         c.relkind, c.relrowsecurity, c.relforcerowsecurity, c.reloptions,
         pg_catalog.pg_get_userbyid(c.relowner) as owner_name
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where (n.nspname = 'public' and c.relkind in ('r', 'p', 'v', 'm', 'f'))
     or (n.nspname = 'storage' and c.relname in ('objects', 'buckets') and c.relkind in ('r', 'p'))
),
webrollen as (
  select oid, rolname, rolsuper, rolbypassrls
  from pg_catalog.pg_roles
  where rolname in ('anon', 'authenticated', 'service_role')
),
abschnitte as (
  select '01_erwartete_objekte' as abschnitt, jsonb_build_object(
    'properties_vorhanden', pg_catalog.to_regclass('public.properties') is not null,
    'bildspeicher_vorhanden', exists (
      select 1 from storage.buckets where id = 'property-images'
    ),
    'hinweis', 'Rechte allein beweisen keinen Zugriff. RLS-Regeln und Adminpruefung muessen gemeinsam bewertet werden.'
  ) as daten

  union all
  select '02_tabellen_und_views', coalesce(jsonb_agg(to_jsonb(t) order by t.schema_name, t.object_name), '[]'::jsonb)
  from (
    select schema_name, object_name, relkind as objektart,
           relrowsecurity as rls_aktiv, relforcerowsecurity as rls_auch_fuer_eigentuemer,
           owner_name as eigentuemer, reloptions as objektoptionen
    from zielobjekte
  ) t

  union all
  select '03_spaltenstruktur', coalesce(jsonb_agg(to_jsonb(t) order by t.schema_name, t.object_name, t.position), '[]'::jsonb)
  from (
    select z.schema_name, z.object_name, a.attnum as position, a.attname as spalte,
           pg_catalog.format_type(a.atttypid, a.atttypmod) as datentyp,
           a.attnotnull as pflichtfeld,
           pg_catalog.pg_get_expr(d.adbin, d.adrelid) as standardwert
    from zielobjekte z
    join pg_catalog.pg_attribute a on a.attrelid = z.oid and a.attnum > 0 and not a.attisdropped
    left join pg_catalog.pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
    where z.schema_name = 'public'
  ) t

  union all
  select '04_rls_regeln', coalesce(jsonb_agg(to_jsonb(t) order by t.schemaname, t.tablename, t.policyname), '[]'::jsonb)
  from (
    select p.schemaname, p.tablename, p.policyname, p.permissive,
           p.roles, p.cmd, p.qual as using_bedingung, p.with_check as check_bedingung
    from pg_catalog.pg_policies p
    join zielobjekte z on z.schema_name = p.schemaname and z.object_name = p.tablename
  ) t

  union all
  select '05_rollen_und_effektive_tabellenrechte', coalesce(jsonb_agg(to_jsonb(t) order by t.schema_name, t.object_name, t.rolle), '[]'::jsonb)
  from (
    select z.schema_name, z.object_name, r.rolname as rolle,
           r.rolsuper as superuser, r.rolbypassrls as umgeht_rls,
           pg_catalog.has_schema_privilege(r.oid, z.schema_name, 'USAGE') as schema_nutzbar,
           pg_catalog.has_table_privilege(r.oid, z.oid, 'SELECT') as lesen,
           pg_catalog.has_table_privilege(r.oid, z.oid, 'INSERT') as anlegen,
           pg_catalog.has_table_privilege(r.oid, z.oid, 'UPDATE') as aendern,
           pg_catalog.has_table_privilege(r.oid, z.oid, 'DELETE') as loeschen,
           pg_catalog.has_table_privilege(r.oid, z.oid, 'TRUNCATE') as komplett_leeren
    from zielobjekte z cross join webrollen r
  ) t

  union all
  select '06_effektive_spaltenrechte', coalesce(jsonb_agg(to_jsonb(t) order by t.schema_name, t.object_name, t.spalte, t.rolle), '[]'::jsonb)
  from (
    select z.schema_name, z.object_name, a.attname as spalte, r.rolname as rolle,
           pg_catalog.has_column_privilege(r.oid, z.oid, a.attnum, 'SELECT') as lesen,
           pg_catalog.has_column_privilege(r.oid, z.oid, a.attnum, 'INSERT') as anlegen,
           pg_catalog.has_column_privilege(r.oid, z.oid, a.attnum, 'UPDATE') as aendern
    from zielobjekte z
    join pg_catalog.pg_attribute a on a.attrelid = z.oid and a.attnum > 0 and not a.attisdropped
    cross join webrollen r
    where z.schema_name = 'public' and r.rolname in ('anon', 'authenticated')
  ) t

  union all
  select '07_bildspeicher_grenzen', coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
  from (
    select id, name, public as oeffentlich,
           file_size_limit as dateigroesse_max_bytes,
           allowed_mime_types as erlaubte_dateitypen
    from storage.buckets
    where id = 'property-images'
  ) t

  union all
  select '08_datenbankbedingungen', coalesce(jsonb_agg(to_jsonb(t) order by t.schema_name, t.object_name, t.regelname), '[]'::jsonb)
  from (
    select z.schema_name, z.object_name, c.conname as regelname, c.contype as regelart,
           pg_catalog.pg_get_constraintdef(c.oid) as definition
    from zielobjekte z
    join pg_catalog.pg_constraint c on c.conrelid = z.oid
    where z.schema_name = 'public'
  ) t

  union all
  select '09_trigger', coalesce(jsonb_agg(to_jsonb(t) order by t.schema_name, t.object_name, t.triggername), '[]'::jsonb)
  from (
    select z.schema_name, z.object_name, tr.tgname as triggername, tr.tgenabled as aktiviert,
           pn.nspname as funktionsschema, p.proname as funktionsname,
           p.prosecdef as ausfuehrung_mit_eigentuemerrechten
    from zielobjekte z
    join pg_catalog.pg_trigger tr on tr.tgrelid = z.oid and not tr.tgisinternal
    join pg_catalog.pg_proc p on p.oid = tr.tgfoid
    join pg_catalog.pg_namespace pn on pn.oid = p.pronamespace
  ) t

  union all
  select '10_oeffentliche_funktionen_und_aufrufrechte', coalesce(jsonb_agg(to_jsonb(t) order by t.signatur, t.rolle), '[]'::jsonb)
  from (
    select n.nspname || '.' || p.proname || '(' || pg_catalog.pg_get_function_identity_arguments(p.oid) || ')' as signatur,
           pg_catalog.pg_get_userbyid(p.proowner) as eigentuemer,
           p.prosecdef as ausfuehrung_mit_eigentuemerrechten,
           (select array_agg(config) from unnest(p.proconfig) as cfg(config)
            where config like 'search_path=%') as suchpfad,
           r.rolname as rolle,
           pg_catalog.has_function_privilege(r.oid, p.oid, 'EXECUTE') as aufruf_erlaubt
    from pg_catalog.pg_proc p
    join pg_catalog.pg_namespace n on n.oid = p.pronamespace
    cross join webrollen r
    where n.nspname = 'public' and p.prokind = 'f'
  ) t
)
select jsonb_pretty(jsonb_object_agg(abschnitt, daten order by abschnitt)) as bericht
from abschnitte;
