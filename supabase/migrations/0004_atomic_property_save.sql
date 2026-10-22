-- ÜBERGABE ADMIN-01: Reihenfolge und Immobilie gemeinsam speichern.
-- Nach 0003 ausführen, BEVOR der neue Admincode veröffentlicht wird.
-- Diese Einrichtung verändert keine bestehenden Immobilien oder Zugriffsregeln.
begin;
set local lock_timeout = '5s';

do $check$
begin
  if to_regprocedure('public.next_property_reference()') is null then
    raise exception 'Bitte zuerst die Einrichtung 0003 abschliessen.';
  end if;
end;
$check$;

create or replace function public.save_property(p_id uuid, p_is_new boolean, p_property jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
set lock_timeout = '5s'
as $function$
declare
  v_input public.properties%rowtype;
  v_existing public.properties%rowtype;
  v_saved_id uuid;
  v_required bigint;
  v_changed bigint;
begin
  if auth.uid() is null then
    raise exception using errcode = '42501', message = 'Anmeldung erforderlich.';
  end if;
  if p_id is null or p_is_new is null or p_property is null
     or jsonb_typeof(p_property) <> 'object' then
    raise exception using errcode = '22023', message = 'Ungueltige Immobiliendaten.';
  end if;
  if exists (
    select 1 from jsonb_object_keys(p_property) as fields(key)
    where key not in ('title', 'location', 'price', 'type', 'status', 'bedrooms',
      'bathrooms', 'area', 'area_label', 'images', 'sort_order')
  ) then
    raise exception using errcode = '22023', message = 'Nicht erlaubtes Immobilienfeld.';
  end if;
  select * into v_input from jsonb_populate_record(null::public.properties, p_property);
  if v_input.sort_order is null or v_input.sort_order < 0 then
    raise exception using errcode = '22023', message = 'Ungueltige Sortierposition.';
  end if;

  -- Schützt die Positionsberechnung vor gleichzeitigem Schreiben; öffentliches Lesen bleibt möglich.
  lock table public.properties in share row exclusive mode;
  if p_is_new then
    if exists (select 1 from public.properties where id = p_id) then
      raise exception using errcode = '23505', message = 'Diese Immobilie besteht bereits. Bitte den gespeicherten Stand laden.';
    end if;
  else
    select * into v_existing from public.properties where id = p_id;
    if not found then
      raise exception using errcode = '22023', message = 'Immobilie nicht gefunden oder nicht lesbar.';
    end if;
  end if;

  -- Nur bei neuer/geänderter Position verschieben, anhand des tatsächlichen Datenbankstands.
  if p_is_new or v_input.sort_order is distinct from v_existing.sort_order then
    if exists (select 1 from public.properties where sort_order = v_input.sort_order and id <> p_id) then
      select count(*) into v_required from public.properties
      where sort_order >= v_input.sort_order and id <> p_id;
      update public.properties set sort_order = sort_order + 1, updated_at = now()
      where sort_order >= v_input.sort_order and id <> p_id;
      get diagnostics v_changed = row_count;
      if v_changed <> v_required then
        raise exception using errcode = '42501', message = 'Keine ausreichenden Rechte zum vollstaendigen Umsortieren.';
      end if;
    end if;
  end if;

  if p_is_new then
    insert into public.properties (
      id, title, location, price, type, status, bedrooms, bathrooms, area, area_label, images, sort_order
    ) values (
      p_id, v_input.title, v_input.location, v_input.price, v_input.type, v_input.status,
      v_input.bedrooms, v_input.bathrooms, v_input.area, v_input.area_label, v_input.images, v_input.sort_order
    ) returning id into v_saved_id;
  else
    update public.properties set
      title = v_input.title, location = v_input.location, price = v_input.price,
      type = v_input.type, status = v_input.status, bedrooms = v_input.bedrooms,
      bathrooms = v_input.bathrooms, area = v_input.area, area_label = v_input.area_label,
      images = v_input.images, sort_order = v_input.sort_order, updated_at = now()
    where id = p_id returning id into v_saved_id;
    if not found then
      raise exception using errcode = '42501', message = 'Keine Berechtigung zum Speichern dieser Immobilie.';
    end if;
  end if;

  -- Fehler werden absichtlich nicht abgefangen: PostgreSQL rollt auch vorangegangene Verschiebungen zurück.
  return jsonb_build_object('id', v_saved_id);
end;
$function$;

revoke execute on function public.save_property(uuid, boolean, jsonb) from public, anon, service_role;
grant execute on function public.save_property(uuid, boolean, jsonb) to authenticated;

-- Die bisherige Sortierfunktion bleibt vorübergehend für noch nicht aktualisierte Browser erhalten.
-- Der neue Admincode ruft ausschließlich save_property auf. Bestehende RLS-Regeln bleiben wirksam.
notify pgrst, 'reload schema';
commit;
