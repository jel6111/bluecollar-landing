-- 새 bluecollar-mission6-demo 프로젝트에서만 실행한다.
-- 실제 서비스/미션 5 프로젝트에는 적용하지 않는다.
begin;

create table public.work_records (
  id uuid primary key default gen_random_uuid(),
  site_label varchar(80) not null,
  work_date date not null,
  title varchar(120) not null,
  description text not null default '',
  image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint work_records_site_label_length check (char_length(btrim(site_label)) between 1 and 80),
  constraint work_records_title_length check (char_length(btrim(title)) between 1 and 120),
  constraint work_records_description_length check (char_length(description) <= 2000),
  constraint work_records_work_date_range check (work_date between date '1900-01-01' and date '2100-12-31'),
  constraint work_records_image_path check (
    image_path is null or
    (image_path ~ '^records/[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|png|webp)$'
      and split_part(image_path, '/', 2) = id::text)
  )
);

comment on table public.work_records is '블루칼라 미션 6 과제용 가상 데이터 전용';
create index work_records_created_at_id_idx on public.work_records (created_at desc, id desc);

create function public.work_records_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger work_records_set_updated_at
before update on public.work_records
for each row execute function public.work_records_touch_updated_at();

alter table public.work_records enable row level security;
revoke all on table public.work_records from anon, authenticated;
grant select, insert, update, delete on table public.work_records to service_role;
-- 사용자별 RLS 정책은 미션 7 범위. anon 직접 CRUD 정책은 만들지 않는다.

commit;
