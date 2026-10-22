-- Nur lesend. Erwartet: alle Werte true, außer gaeste_duerfen_pruefen = false.
with funcs as (
  select to_regprocedure('public.admin_session_check(boolean)') as pruefung,
    to_regprocedure('public.admin_session_is_active()') as schutz
)
select
  to_regclass('public.properties') is not null as immobilientabelle_vorhanden,
  to_regclass('private.admin_sessions') is not null as sitzungsspeicher_vorhanden,
  funcs.pruefung is not null and funcs.schutz is not null as sitzungsfunktionen_vorhanden,
  coalesce(has_function_privilege('anon', funcs.pruefung, 'EXECUTE'), false) as gaeste_duerfen_pruefen,
  coalesce(has_function_privilege('authenticated', funcs.pruefung, 'EXECUTE'), false) as angemeldete_duerfen_pruefen,
  exists (select 1 from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    where n.nspname='private' and c.relname='admin_sessions' and c.relrowsecurity) as sitzungsspeicher_mit_zeilenschutz,
  not coalesce(has_schema_privilege('authenticated', to_regnamespace('private'), 'USAGE'), false) as sitzungsspeicher_nicht_direkt_zugaenglich,
  (select count(*)=3 from pg_catalog.pg_policies where schemaname='public' and tablename='properties'
    and policyname in ('admin_session_insert','admin_session_update','admin_session_delete')
    and permissive='RESTRICTIVE' and roles=array['authenticated']::name[]) as immobilien_schreibschutz_vorhanden,
  (select count(*)=3 from pg_catalog.pg_policies where schemaname='storage' and tablename='objects'
    and policyname in ('admin_session_image_insert','admin_session_image_update','admin_session_image_delete')
    and permissive='RESTRICTIVE' and roles=array['authenticated']::name[]) as bilder_schreibschutz_vorhanden
from funcs;
