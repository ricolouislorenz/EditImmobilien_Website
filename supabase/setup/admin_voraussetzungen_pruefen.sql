-- ÜBERGABE: Nur lesende Kontrolle nach 0003_property_admin_prerequisites.sql.
-- Keine neuen Nummern verbrauchen, keine Immobilien probeweise anlegen oder umsortieren.
with nummern as (
  select to_jsonb(p)->>'reference' as reference from public.properties p
),
statistik as (
  select count(*) as immobilien_gesamt,
         count(*) filter (where reference is null or btrim(reference) = '') as fehlende_nummern,
         count(*) filter (where reference !~ '^EI-[0-9]{3,}$') as ungueltige_nummern,
         count(reference) - count(distinct reference) as doppelte_nummern
  from nummern
),
funktionen as (
  select
    to_regprocedure('public.next_property_reference()') as nummernfunktion,
    to_regprocedure('public.shift_property_order(integer,uuid)') as sortierfunktion
)
select s.*,
  exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'properties' and column_name = 'reference'
      and is_nullable = 'NO' and column_default like '%next_property_reference%'
  ) as nummernspalte_mit_automatik,
  exists (
    select 1 from pg_catalog.pg_constraint
    where conrelid = 'public.properties'::regclass and conname = 'properties_reference_key' and contype = 'u'
  ) as eindeutigkeit_gesichert,
  to_regclass('public.properties_reference_seq') is not null as nummernzaehler_vorhanden,
  f.nummernfunktion is not null as nummernfunktion_vorhanden,
  f.sortierfunktion is not null as sortierfunktion_vorhanden,
  coalesce(has_function_privilege('anon', f.sortierfunktion, 'EXECUTE'), false) as gaeste_duerfen_umsortieren,
  coalesce(has_function_privilege('authenticated', f.sortierfunktion, 'EXECUTE'), false) as angemeldete_duerfen_umsortieren,
  coalesce((select not prosecdef from pg_catalog.pg_proc where oid = f.sortierfunktion), false) as sortierung_beachtet_bestehende_rechte
from statistik s cross join funktionen f;
