-- ÜBERGABE: Fehlende Voraussetzungen des vorhandenen Adminbereichs ergänzen.
-- Nur diese Datei vollständig im Supabase SQL-Editor als postgres ausführen.
-- Bestehende Inhalte und Bildpfade bleiben erhalten; fehlende Objektnummern werden ergänzt.
-- Eine erneute Ausführung behält vorhandene Nummern und setzt den Nummernzähler nicht zurück.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

-- Während der Einrichtung dürfen keine Immobilien gleichzeitig geändert werden.
lock table public.properties in access exclusive mode;

alter table public.properties add column if not exists reference text;
create sequence if not exists public.properties_reference_seq as bigint;
alter sequence public.properties_reference_seq increment by 1 no cycle cache 1;
alter sequence public.properties_reference_seq owned by public.properties.reference;

do $migration$
declare
  v_last bigint;
  v_called boolean;
  v_base bigint;
  v_missing bigint;
begin
  -- Unerwartete bestehende Werte nicht stillschweigend umnummerieren.
  if exists (
    select 1 from public.properties
    where reference is not null and btrim(reference) <> ''
      and reference !~ '^EI-[0-9]{3,}$'
  ) then
    raise exception 'Unerwartete Objektnummer gefunden. Einrichtung abgebrochen; bitte Bericht zur Pruefung senden.';
  end if;

  select last_value, is_called into v_last, v_called
  from public.properties_reference_seq;
  select greatest(
    coalesce(max(substring(reference from '^EI-([0-9]+)$')::bigint), 0),
    case when v_called then v_last else v_last - 1 end
  ) into v_base
  from public.properties;

  select count(*) into v_missing from public.properties
  where reference is null or btrim(reference) = '';

  with nummern as (
    select id, (v_base + row_number() over (order by created_at, id))::text as nummer
    from public.properties
    where reference is null or btrim(reference) = ''
  )
  update public.properties p
  set reference = 'EI-' || lpad(n.nummer, greatest(3, length(n.nummer)), '0')
  from nummern n where p.id = n.id;

  -- ALTER SEQUENCE RESTART wird bei einem Fehler mit zurückgerollt, anders als setval().
  execute format('alter sequence public.properties_reference_seq restart with %s', v_base + v_missing + 1);
end;
$migration$;

-- Auch ab EI-1000 bleibt die ganze Nummer erhalten (keine Kürzung auf drei Stellen).
create or replace function public.next_property_reference()
returns text
language sql
volatile
security invoker
set search_path = ''
as $function$
  select 'EI-' || pg_catalog.lpad(n::text, greatest(3, pg_catalog.length(n::text)), '0')
  from (select pg_catalog.nextval('public.properties_reference_seq'::regclass) as n) nummer;
$function$;

alter table public.properties
  alter column reference set default public.next_property_reference(),
  alter column reference set not null;

-- Vorhandene Eindeutigkeitsregeln nicht ersetzen; doppelte Nummern führen zum Abbruch.
do $constraint$
begin
  if not exists (
    select 1 from pg_catalog.pg_constraint
    where conrelid = 'public.properties'::regclass and conname = 'properties_reference_key'
  ) then
    if to_regclass('public.properties_reference_key') is null then
      alter table public.properties add constraint properties_reference_key unique (reference);
    elsif exists (
      select 1 from pg_catalog.pg_index i
      join pg_catalog.pg_attribute a on a.attrelid = i.indrelid and a.attname = 'reference'
      where i.indexrelid = 'public.properties_reference_key'::regclass
        and i.indrelid = 'public.properties'::regclass
        and i.indisunique and i.indisvalid and i.indnkeyatts = 1
        and i.indkey[0] = a.attnum and i.indpred is null and i.indexprs is null
    ) then
      -- Unterstützt auch den alleinstehenden eindeutigen Index aus der alten Datei 0001.
      alter table public.properties add constraint properties_reference_key unique using index properties_reference_key;
    else
      raise exception 'Unerwarteter Index properties_reference_key. Einrichtung abgebrochen.';
    end if;
  end if;
  if not exists (
    select 1 from pg_catalog.pg_constraint c
    join pg_catalog.pg_attribute a on a.attrelid = c.conrelid and a.attname = 'reference'
    where c.conrelid = 'public.properties'::regclass and c.conname = 'properties_reference_key'
      and c.contype = 'u' and c.conkey = array[a.attnum]::smallint[] and c.convalidated
  ) then
    raise exception 'Objektnummern sind nicht wie erwartet eindeutig abgesichert. Einrichtung abgebrochen.';
  end if;
end;
$constraint$;

revoke all on sequence public.properties_reference_seq from public, anon;
grant usage on sequence public.properties_reference_seq to authenticated, service_role;
revoke execute on function public.next_property_reference() from public, anon;
grant execute on function public.next_property_reference() to authenticated, service_role;

-- ÜBERGABE ADMIN-01 [OFFEN]: Umsortieren und Speichern sind weiterhin getrennte API-Aufrufe.
-- Diese Funktion stellt die erwartete Schnittstelle bereit; sie umgeht keine RLS-Regeln.
create or replace function public.shift_property_order(p_target integer, p_exclude uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  if auth.uid() is null then
    raise exception using errcode = '42501', message = 'Anmeldung erforderlich.';
  end if;
  if p_target is null or p_target < 0 or p_exclude is null then
    raise exception using errcode = '22023', message = 'Ungueltige Zielposition oder Immobilien-ID.';
  end if;

  -- Gleichzeitige Umsortierungen innerhalb dieses Aufrufs serialisieren.
  lock table public.properties in share row exclusive mode;
  if exists (
    select 1 from public.properties where sort_order = p_target and id <> p_exclude
  ) then
    update public.properties
    set sort_order = sort_order + 1, updated_at = now()
    where sort_order >= p_target and id <> p_exclude;
  end if;
end;
$function$;

revoke execute on function public.shift_property_order(integer, uuid) from public, anon;
grant execute on function public.shift_property_order(integer, uuid) to authenticated;

notify pgrst, 'reload schema';
commit;
