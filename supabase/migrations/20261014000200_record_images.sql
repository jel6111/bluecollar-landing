-- 새 미션 6 과제 DB/Storage에만 적용한다.
begin;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('work-record-images', 'work-record-images', false, 3145728, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- DB와 Storage 사이의 파일 정리 실패를 보관한다. 삭제된 기록도 재시도해야 하므로 FK를 두지 않는다.
create table public.storage_cleanup_tasks (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null,
  image_path text not null unique,
  reason text not null check (reason in ('rollback', 'replaced', 'removed', 'record_deleted')),
  attempts integer not null default 0 check (attempts >= 0),
  created_at timestamptz not null default now(),
  constraint storage_cleanup_owned_path check (
    image_path ~ '^records/[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|png|webp)$'
    and split_part(image_path, '/', 2) = record_id::text
  )
);
alter table public.storage_cleanup_tasks enable row level security;
revoke all on table public.storage_cleanup_tasks from anon, authenticated;
grant select, insert, update, delete on table public.storage_cleanup_tasks to service_role;
comment on table public.storage_cleanup_tasks is '과제 Storage 파일 정리 재시도 전용, 원문 오류나 비밀 값 저장 금지';
commit;
