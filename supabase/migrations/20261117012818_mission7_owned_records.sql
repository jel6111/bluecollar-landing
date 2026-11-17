-- Apply to the empty Mission 7 project only. Mission 6 migrations are historical.
begin;

create table public.work_records (
  user_id uuid not null references auth.users(id),
  id uuid not null default gen_random_uuid(),
  site_label varchar(80) not null check (char_length(btrim(site_label)) between 1 and 80),
  work_date date not null check (work_date between date '1900-01-01' and date '2100-12-31'),
  title varchar(120) not null check (char_length(btrim(title)) between 1 and 120),
  description text not null default '' check (char_length(description) <= 2000),
  image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id),
  check (image_path is null or image_path ~ (
    '^users/' || user_id::text || '/records/' || id::text ||
    '/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$'
  ))
);
create index mission7_records_list_idx on public.work_records (user_id, created_at desc, id desc);

create table public.storage_cleanup_tasks (
  user_id uuid not null references auth.users(id),
  record_id uuid not null,
  image_path text primary key,
  reason text not null check (reason in ('rollback', 'replaced', 'removed', 'record_deleted')),
  created_at timestamptz not null default now(),
  check (image_path ~ (
    '^users/' || user_id::text || '/records/' || record_id::text ||
    '/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$'
  ))
);
create index mission7_cleanup_user_idx on public.storage_cleanup_tasks (user_id, created_at);

alter table public.work_records enable row level security;
alter table public.storage_cleanup_tasks enable row level security;
revoke all on public.work_records, public.storage_cleanup_tasks from public, anon, authenticated;
grant select, delete on public.work_records to authenticated;
grant insert (user_id, id, site_label, work_date, title, description, image_path)
  on public.work_records to authenticated;
grant update (site_label, work_date, title, description, image_path)
  on public.work_records to authenticated;
grant select, delete on public.storage_cleanup_tasks to authenticated;
grant insert (user_id, record_id, image_path, reason) on public.storage_cleanup_tasks to authenticated;

create policy mission7_records_read on public.work_records for select to authenticated
  using ((select auth.uid()) = user_id);
create policy mission7_records_create on public.work_records for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy mission7_records_edit on public.work_records for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy mission7_records_delete on public.work_records for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy mission7_cleanup_read on public.storage_cleanup_tasks for select to authenticated
  using ((select auth.uid()) = user_id);
create policy mission7_cleanup_enqueue on public.storage_cleanup_tasks for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy mission7_cleanup_delete on public.storage_cleanup_tasks for delete to authenticated
  using ((select auth.uid()) = user_id);

create function public.mission7_touch_record()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end;
$$;
create trigger mission7_touch_record before update on public.work_records
  for each row execute function public.mission7_touch_record();

create function public.mission7_queue_old_photo()
returns trigger language plpgsql set search_path = '' as $$
begin
  if old.image_path is null then return null; end if;
  if tg_op = 'DELETE' then
    insert into public.storage_cleanup_tasks(user_id, record_id, image_path, reason)
    values (old.user_id, old.id, old.image_path, 'record_deleted') on conflict do nothing;
  elsif old.image_path is distinct from new.image_path then
    insert into public.storage_cleanup_tasks(user_id, record_id, image_path, reason)
    values (old.user_id, old.id, old.image_path,
      case when new.image_path is null then 'removed' else 'replaced' end)
    on conflict do nothing;
  end if;
  return null;
end;
$$;
create trigger mission7_queue_old_photo after update of image_path or delete on public.work_records
  for each row execute function public.mission7_queue_old_photo();
revoke execute on function public.mission7_touch_record(), public.mission7_queue_old_photo()
  from public, anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('mission7-record-images', 'mission7-record-images', false, 3145728, array['image/jpeg','image/png','image/webp']);

create policy mission7_photos_read on storage.objects for select to authenticated
  using (bucket_id = 'mission7-record-images' and owner_id = (select auth.uid())::text
    and split_part(name, '/', 2) = (select auth.uid())::text);
create policy mission7_photos_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'mission7-record-images' and owner_id = (select auth.uid())::text
    and name ~ ('^users/' || (select auth.uid())::text ||
      '/records/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' ||
      '/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$'));
create policy mission7_photos_delete on storage.objects for delete to authenticated
  using (bucket_id = 'mission7-record-images' and owner_id = (select auth.uid())::text
    and split_part(name, '/', 2) = (select auth.uid())::text
    and not exists (
      select 1 from public.work_records r
      where r.user_id = (select auth.uid())
        and r.id::text = split_part(storage.objects.name, '/', 4)
        and r.image_path = storage.objects.name
    ));

commit;
