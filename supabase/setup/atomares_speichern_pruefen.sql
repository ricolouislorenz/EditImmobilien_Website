-- Nur lesende Kontrolle: keine Immobilie anlegen oder umsortieren.
with f as (
  select to_regprocedure('public.save_property(uuid,boolean,jsonb)') as oid
)
select
  f.oid is not null as speicherfunktion_vorhanden,
  coalesce(not p.prosecdef, false) as beachtet_bestehende_rechte,
  coalesce(p.prorettype = 'jsonb'::regtype, false) as antwortformat_passend,
  coalesce('search_path=""' = any(p.proconfig), false) as suchpfad_festgelegt,
  coalesce('lock_timeout=5s' = any(p.proconfig), false) as sperrwartezeit_begrenzt,
  coalesce(has_function_privilege('anon', f.oid, 'EXECUTE'), false) as gaeste_duerfen_speichern,
  coalesce(has_function_privilege('authenticated', f.oid, 'EXECUTE'), false) as angemeldete_duerfen_speichern
from f left join pg_catalog.pg_proc p on p.oid = f.oid;
