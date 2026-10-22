-- ÜBERGABE ADMIN-SITZUNG: 30 Minuten ohne Bedienung; nur die neueste Anmeldung je Konto.
-- Vollständig als postgres ausführen, bevor der neue Websitecode veröffentlicht wird.
begin;
set local lock_timeout = '5s';
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.admin_sessions (
  user_id uuid primary key,
  session_id uuid not null,
  started_at timestamptz not null,
  last_activity_at timestamptz not null default now()
);
alter table private.admin_sessions enable row level security;
revoke all on private.admin_sessions from public, anon, authenticated;

-- Nur die eigene Sitzung prüfen. Keine Sitzungsdaten oder Tokens an den Browser ausgeben.
create or replace function public.admin_session_is_active()
returns boolean language sql stable security definer set search_path = ''
as $function$
  select exists (
    select 1 from private.admin_sessions a
    join auth.sessions s on s.id = a.session_id and s.user_id = a.user_id
    where a.user_id = auth.uid()
      and a.session_id::text = auth.jwt()->>'session_id'
      and a.last_activity_at > now() - interval '30 minutes'
      and (s.not_after is null or s.not_after > now())
      and not exists (
        select 1 from auth.sessions newer where newer.user_id = a.user_id
          and (newer.created_at, newer.id) > (a.started_at, a.session_id)
      )
  );
$function$;

create or replace function public.admin_session_check(p_activity boolean default false)
returns jsonb language plpgsql security definer set search_path = '' set lock_timeout = '5s'
as $function$
declare
  v_uid uuid := auth.uid();
  v_session auth.sessions%rowtype;
  v_previous private.admin_sessions%rowtype;
  v_last timestamptz;
begin
  if v_uid is null then
    raise exception using errcode = '42501', message = 'Anmeldung erforderlich.';
  end if;
  -- Gleichzeitige Prüfungen desselben Kontos serialisieren; andere Konten bleiben unabhängig.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_uid::text, 0));
  select * into v_session from auth.sessions
    where user_id = v_uid and id::text = auth.jwt()->>'session_id';
  if not found then return jsonb_build_object('status', 'ended'); end if;
  if v_session.not_after is not null and v_session.not_after <= now() then
    return jsonb_build_object('status', 'expired');
  end if;
  select * into v_previous from private.admin_sessions where user_id = v_uid;
  -- Auch nach Abmeldung der neueren Sitzung darf die alte nicht wieder gültig werden.
  if (v_previous.started_at, v_previous.session_id) > (v_session.created_at, v_session.id)
     or exists (select 1 from auth.sessions s where s.user_id = v_uid
       and (s.created_at, s.id) > (v_session.created_at, v_session.id)) then
    return jsonb_build_object('status', 'replaced');
  end if;
  if v_previous.session_id = v_session.id then
    if v_previous.last_activity_at <= now() - interval '30 minutes' then
      return jsonb_build_object('status', 'expired');
    end if;
    v_last := case when p_activity is true then now() else v_previous.last_activity_at end;
  else
    v_last := now();
  end if;
  insert into private.admin_sessions(user_id, session_id, started_at, last_activity_at)
    values(v_uid, v_session.id, v_session.created_at, v_last)
    on conflict(user_id) do update set session_id = excluded.session_id,
      started_at = excluded.started_at, last_activity_at = excluded.last_activity_at;
  return jsonb_build_object('status', 'active', 'remaining_seconds',
    greatest(0, extract(epoch from (v_last + interval '30 minutes' - now()))));
end;
$function$;

revoke all on function public.admin_session_is_active() from public, anon, service_role;
revoke all on function public.admin_session_check(boolean) from public, anon, service_role;
grant execute on function public.admin_session_is_active() to authenticated;
grant execute on function public.admin_session_check(boolean) to authenticated;

-- Zusätzliche UND-Bedingungen: bestehende Rechte werden eingeschränkt, niemals erweitert.
drop policy if exists admin_session_insert on public.properties;
create policy admin_session_insert on public.properties as restrictive for insert to authenticated
  with check ((select public.admin_session_is_active()));
drop policy if exists admin_session_update on public.properties;
create policy admin_session_update on public.properties as restrictive for update to authenticated
  using ((select public.admin_session_is_active())) with check ((select public.admin_session_is_active()));
drop policy if exists admin_session_delete on public.properties;
create policy admin_session_delete on public.properties as restrictive for delete to authenticated
  using ((select public.admin_session_is_active()));

-- Öffentliche Bildanzeige und andere Buckets bleiben unverändert.
drop policy if exists admin_session_image_insert on storage.objects;
create policy admin_session_image_insert on storage.objects as restrictive for insert to authenticated
  with check (bucket_id <> 'property-images' or (select public.admin_session_is_active()));
drop policy if exists admin_session_image_update on storage.objects;
create policy admin_session_image_update on storage.objects as restrictive for update to authenticated
  using (bucket_id <> 'property-images' or (select public.admin_session_is_active()))
  with check (bucket_id <> 'property-images' or (select public.admin_session_is_active()));
drop policy if exists admin_session_image_delete on storage.objects;
create policy admin_session_image_delete on storage.objects as restrictive for delete to authenticated
  using (bucket_id <> 'property-images' or (select public.admin_session_is_active()));

notify pgrst, 'reload schema';
commit;
