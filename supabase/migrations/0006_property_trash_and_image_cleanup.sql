-- ÜBERGABE ADMIN-04 / SPEICHER: Papierkorb und kontrollierte Bildbereinigung.
-- Nach 0005 vollständig als postgres ausführen; keine bestehenden Immobilien werden gelöscht.
begin;
set local lock_timeout = '5s';
do $check$ begin
  if to_regprocedure('public.admin_session_is_active()') is null then
    raise exception 'Bitte zuerst Einrichtung 0005 abschliessen.';
  end if;
end; $check$;

create table if not exists public.property_trash (
  property_id uuid primary key,
  snapshot jsonb not null,
  deleted_at timestamptz not null default now(),
  deleted_by uuid,
  expires_at timestamptz not null default now() + interval '30 days'
);
alter table public.property_trash enable row level security;
revoke all on public.property_trash from public, anon, authenticated;
grant select, delete on public.property_trash to authenticated;
grant all on public.property_trash to service_role;
drop policy if exists active_admin_trash_read on public.property_trash;
create policy active_admin_trash_read on public.property_trash for select to authenticated
  using ((select public.admin_session_is_active()));
drop policy if exists active_admin_trash_restore on public.property_trash;
create policy active_admin_trash_restore on public.property_trash for delete to authenticated
  using ((select public.admin_session_is_active()));

create table if not exists private.property_image_cleanup_claims (
  path text primary key,
  claimed_at timestamptz not null default now()
);
alter table private.property_image_cleanup_claims enable row level security;
revoke all on private.property_image_cleanup_claims from public, anon, authenticated;

-- Einheitlich für gespeicherte Pfade und öffentliche/signierte Storage-URLs.
create or replace function private.property_image_path(p_value text)
returns text language plpgsql immutable set search_path = '' as $function$
declare v_path text := p_value; v_hex text := ''; v_i integer := 1; v_char text;
begin
  if v_path ~* '^https?://' then
    v_path := regexp_replace(v_path, '^https?://[^/]+/storage/v1/(object/(public|sign|authenticated)|render/image/(public|sign))/property-images/', '', 'i');
    if v_path = p_value then return null; end if;
    v_path := regexp_replace(v_path, '[?#].*$', '');
  else return v_path;
  end if;
  while v_i <= length(v_path) loop
    v_char := substr(v_path, v_i, 1);
    if v_char = '%' then
      if substr(v_path, v_i + 1, 2) !~ '^[0-9a-fA-F]{2}$' then
        raise exception using errcode = '22023', message = 'Bildadresse enthaelt ungueltige Kodierung.';
      end if;
      v_hex := v_hex || substr(v_path, v_i + 1, 2); v_i := v_i + 3;
    else
      v_hex := v_hex || encode(convert_to(v_char, 'UTF8'), 'hex'); v_i := v_i + 1;
    end if;
  end loop;
  return convert_from(decode(v_hex, 'hex'), 'UTF8');
end; $function$;

create or replace function private.property_image_is_referenced(p_path text, p_ignore_expired boolean default false)
returns boolean language sql stable security definer set search_path = '' as $function$
  select exists (
    select 1 from public.properties p, unnest(p.images) img
      where private.property_image_path(img) = p_path
    union all
    select 1 from public.property_trash t, jsonb_array_elements_text(t.snapshot->'images') img
      where (not p_ignore_expired or t.expires_at > now()) and private.property_image_path(img) = p_path
  );
$function$;

create or replace function private.archive_deleted_property()
returns trigger language plpgsql security definer set search_path = '' as $function$
begin
  insert into public.property_trash(property_id, snapshot, deleted_by)
    values(old.id, to_jsonb(old), auth.uid());
  return old;
end; $function$;
drop trigger if exists archive_deleted_property on public.properties;
create trigger archive_deleted_property after delete on public.properties
  for each row execute function private.archive_deleted_property();

create or replace function private.reject_cleanup_image_references()
returns trigger language plpgsql security definer set search_path = '' as $function$
begin
  if exists (select 1 from unnest(new.images) img
    join private.property_image_cleanup_claims c on c.path = private.property_image_path(img)) then
    raise exception using errcode = '23514', message = 'Ein Bild wird bereinigt oder wurde entfernt. Bitte die Immobilie neu laden und das Bild erneut hochladen.';
  end if;
  return new;
end; $function$;
drop trigger if exists reject_cleanup_image_references on public.properties;
create trigger reject_cleanup_image_references before insert or update of images on public.properties
  for each row execute function private.reject_cleanup_image_references();

create or replace function public.delete_property(p_id uuid, p_expected_updated_at timestamptz)
returns jsonb language plpgsql security invoker set search_path = '' set lock_timeout = '5s' as $function$
declare v_id uuid;
begin
  if not public.admin_session_is_active() then raise exception using errcode='42501', message='Anmeldung erforderlich.'; end if;
  lock table public.properties in share row exclusive mode;
  delete from public.properties where id=p_id and updated_at=p_expected_updated_at returning id into v_id;
  if not found then raise exception using errcode='40001', message='Loeschung nicht bestaetigt. Bitte neu laden: Der Eintrag wurde geaendert, entfernt oder ist nicht freigegeben.'; end if;
  return jsonb_build_object('id',v_id);
end; $function$;

create or replace function public.restore_property(p_id uuid)
returns jsonb language plpgsql security invoker set search_path = '' set lock_timeout = '5s' as $function$
declare v_snapshot jsonb; v_order integer; v_id uuid;
begin
  if not public.admin_session_is_active() then raise exception using errcode='42501', message='Anmeldung erforderlich.'; end if;
  lock table public.properties in share row exclusive mode;
  lock table public.property_trash in share row exclusive mode;
  select snapshot into v_snapshot from public.property_trash where property_id=p_id and expires_at>now();
  if not found then raise exception using errcode='22023', message='Eintrag nicht wiederherstellbar oder Frist abgelaufen.'; end if;
  select coalesce(max(sort_order)+1,0) into v_order from public.properties;
  v_snapshot := v_snapshot || jsonb_build_object('sort_order',v_order,'updated_at',now());
  insert into public.properties select (jsonb_populate_record(null::public.properties,v_snapshot)).* returning id into v_id;
  delete from public.property_trash where property_id=p_id;
  if not found then raise exception using errcode='42501', message='Wiederherstellung nicht bestaetigt.'; end if;
  return jsonb_build_object('id',v_id);
end; $function$;

-- Schützt auch gemeinsam verwendete Bilder und Bilder im Papierkorb vor Browser-Löschungen.
create or replace function public.property_image_can_delete(p_path text)
returns boolean language sql stable security definer set search_path = '' as $function$
  select not private.property_image_is_referenced(p_path);
$function$;
create or replace function public.property_image_can_write(p_path text)
returns boolean language sql stable security definer set search_path = '' as $function$
  select not exists(select 1 from private.property_image_cleanup_claims where path=p_path);
$function$;
drop policy if exists property_image_reference_delete on storage.objects;
create policy property_image_reference_delete on storage.objects as restrictive for delete to authenticated
  using (bucket_id <> 'property-images' or public.property_image_can_delete(name));
drop policy if exists property_image_cleanup_insert on storage.objects;
create policy property_image_cleanup_insert on storage.objects as restrictive for insert to authenticated
  with check (bucket_id <> 'property-images' or public.property_image_can_write(name));
drop policy if exists property_image_cleanup_update on storage.objects;
create policy property_image_cleanup_update on storage.objects as restrictive for update to authenticated
  using (bucket_id <> 'property-images' or public.property_image_can_write(name))
  with check (bucket_id <> 'property-images' or public.property_image_can_write(name));

-- Nur der Hintergrunddienst darf abgelaufene Einträge entfernen und Kandidaten reservieren.
create or replace function public.claim_property_image_cleanup(p_dry_run boolean default true, p_limit integer default 100)
returns jsonb language plpgsql security definer set search_path = '' set lock_timeout = '5s' as $function$
declare v_paths text[]; v_expired integer;
begin
  if p_dry_run is null or p_limit is null or p_limit<1 or p_limit>100 then
    raise exception using errcode='22023', message='Ungueltiger Bereinigungsauftrag.';
  end if;
  -- Konfligiert mit allen Immobilien-Schreibvorgängen: kein neues Referenzieren zwischen Prüfung und Reservierung.
  lock table public.properties in share row exclusive mode;
  lock table public.property_trash in share row exclusive mode;
  select count(*) into v_expired from public.property_trash where expires_at<=now();
  if not p_dry_run then delete from public.property_trash where expires_at<=now(); end if;
  select coalesce(array_agg(name),'{}'::text[]) into v_paths from (
    select o.name from storage.objects o
    where o.bucket_id='property-images' and o.created_at<now()-interval '48 hours'
      and o.updated_at<now()-interval '48 hours'
      -- Nur Bilddateien in den von der Website verwalteten Immobilien-Ordnern bereinigen.
      and o.name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[a-z0-9._-]+\.(jpe?g|png|webp)$'
      and not private.property_image_is_referenced(o.name,p_dry_run)
    order by o.name limit p_limit
  ) candidates;
  if not p_dry_run then
    insert into private.property_image_cleanup_claims(path) select unnest(v_paths) on conflict do nothing;
  end if;
  return jsonb_build_object('paths',to_jsonb(v_paths),'expired_entries',v_expired,'dry_run',p_dry_run);
end; $function$;

revoke all on function private.property_image_path(text), private.property_image_is_referenced(text,boolean),
  private.archive_deleted_property(), private.reject_cleanup_image_references() from public, anon, authenticated;
revoke all on function public.delete_property(uuid,timestamptz), public.restore_property(uuid),
  public.property_image_can_delete(text), public.property_image_can_write(text) from public, anon, service_role;
grant execute on function public.delete_property(uuid,timestamptz), public.restore_property(uuid),
  public.property_image_can_delete(text), public.property_image_can_write(text) to authenticated;
revoke all on function public.claim_property_image_cleanup(boolean,integer) from public, anon, authenticated;
grant execute on function public.claim_property_image_cleanup(boolean,integer) to service_role;
notify pgrst, 'reload schema';
commit;
