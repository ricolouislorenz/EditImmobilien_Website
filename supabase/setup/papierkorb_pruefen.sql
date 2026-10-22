-- Nur lesende Kontrolle. Alle Werte true, nur gaeste_duerfen_wiederherstellen = false.
with f as (
  select to_regprocedure('public.delete_property(uuid,timestamp with time zone)') as loeschen,
    to_regprocedure('public.restore_property(uuid)') as wiederherstellen,
    to_regprocedure('public.claim_property_image_cleanup(boolean,integer)') as bereinigen
)
select
  to_regclass('public.property_trash') is not null as papierkorb_vorhanden,
  to_regclass('private.property_image_cleanup_claims') is not null as bereinigungsschutz_vorhanden,
  f.loeschen is not null and f.wiederherstellen is not null and f.bereinigen is not null as funktionen_vorhanden,
  coalesce(has_function_privilege('anon',f.wiederherstellen,'EXECUTE'),false) as gaeste_duerfen_wiederherstellen,
  coalesce(has_function_privilege('authenticated',f.loeschen,'EXECUTE'),false)
    and coalesce(has_function_privilege('authenticated',f.wiederherstellen,'EXECUTE'),false) as admins_duerfen_verwalten,
  not coalesce(has_function_privilege('authenticated',f.bereinigen,'EXECUTE'),false) as browser_darf_nicht_bereinigen,
  coalesce(has_function_privilege('service_role',f.bereinigen,'EXECUTE'),false) as hintergrunddienst_darf_bereinigen,
  exists(select 1 from pg_catalog.pg_class where oid=to_regclass('public.property_trash') and relrowsecurity) as papierkorb_zeilenschutz_aktiv,
  not coalesce(has_table_privilege('anon',to_regclass('public.property_trash'),'SELECT'),false) as papierkorb_nicht_oeffentlich,
  (select count(*)=2 from pg_catalog.pg_trigger where tgrelid=to_regclass('public.properties')
    and tgname in ('archive_deleted_property','reject_cleanup_image_references') and tgenabled='O') as sicherung_und_bildschutz_aktiv,
  (select count(*)=3 from pg_catalog.pg_policies where schemaname='storage' and tablename='objects'
    and policyname in ('property_image_reference_delete','property_image_cleanup_insert','property_image_cleanup_update')
    and permissive='RESTRICTIVE') as bildregeln_vorhanden
from f;
