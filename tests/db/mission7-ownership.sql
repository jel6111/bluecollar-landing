-- Run on a disposable local database or the verified Mission 7 project.
-- Everything in this test, including the two synthetic auth users, rolls back.
begin;

insert into auth.users (id) values
  ('71100000-0000-4000-8000-000000000001'),
  ('71100000-0000-4000-8000-000000000002');

set local role anon;
do $$
begin
  begin
    perform id from public.work_records;
    raise exception 'Anonymous SELECT unexpectedly allowed';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

set local role authenticated;
set local request.jwt.claim.sub = '71100000-0000-4000-8000-000000000001';
insert into storage.objects (bucket_id, name, owner_id)
values ('mission7-record-images',
  'users/71100000-0000-4000-8000-000000000001/records/71100000-0000-4000-8000-000000000003/71100000-0000-4000-8000-000000000004.jpg',
  auth.uid()::text);

insert into public.work_records (user_id, id, site_label, work_date, title, image_path)
values (auth.uid(), '71100000-0000-4000-8000-000000000003', '가상 현장 A', date '2026-11-17', 'A 기록',
  'users/71100000-0000-4000-8000-000000000001/records/71100000-0000-4000-8000-000000000003/71100000-0000-4000-8000-000000000004.jpg');

do $$
begin
  if (select count(*) from storage.objects where bucket_id = 'mission7-record-images') <> 1 then
    raise exception 'A cannot see its own photo';
  end if;
  delete from storage.objects where bucket_id = 'mission7-record-images';
  if found then raise exception 'Attached photo can be deleted'; end if;
end $$;

set local request.jwt.claim.sub = '71100000-0000-4000-8000-000000000002';
do $$
begin
  if exists (select 1 from public.work_records) then raise exception 'B can read A record'; end if;
  if exists (select 1 from storage.objects where bucket_id = 'mission7-record-images') then
    raise exception 'B can read A photo';
  end if;
  update public.work_records set title = 'B changed A' where id = '71100000-0000-4000-8000-000000000003';
  if found then raise exception 'B can update A'; end if;
  delete from public.work_records where id = '71100000-0000-4000-8000-000000000003';
  if found then raise exception 'B can delete A'; end if;
  delete from storage.objects where bucket_id = 'mission7-record-images';
  if found then raise exception 'B can delete A photo'; end if;
  begin
    insert into public.work_records (user_id, site_label, work_date, title)
      values ('71100000-0000-4000-8000-000000000001', '가상 현장', date '2026-11-17', '잘못된 소유자');
    raise exception 'B can forge A owner';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into storage.objects (bucket_id, name, owner_id)
      values ('mission7-record-images',
        'users/71100000-0000-4000-8000-000000000001/records/71100000-0000-4000-8000-000000000003/71100000-0000-4000-8000-000000000005.jpg',
        auth.uid()::text);
    raise exception 'B can upload inside A namespace';
  exception when insufficient_privilege then null;
  end;
end $$;

insert into public.work_records (user_id, id, site_label, work_date, title)
values (auth.uid(), '71100000-0000-4000-8000-000000000003', '가상 현장 B', date '2026-11-17', 'B 기록');

do $$
begin
  if (select count(*) from public.work_records) <> 1 then raise exception 'B record count incorrect'; end if;
  begin
    update public.work_records set user_id = '71100000-0000-4000-8000-000000000001';
    raise exception 'Ownership transfer permitted';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.work_records set image_path =
      'users/71100000-0000-4000-8000-000000000001/records/71100000-0000-4000-8000-000000000003/71100000-0000-4000-8000-000000000004.jpg';
    raise exception 'Cross-account photo association permitted';
  exception when check_violation then null;
  end;
end $$;

set local request.jwt.claim.sub = '71100000-0000-4000-8000-000000000001';
update public.work_records set image_path = null, title = 'A 수정'
where id = '71100000-0000-4000-8000-000000000003';

do $$
begin
  if not exists (select 1 from public.storage_cleanup_tasks where reason = 'removed') then
    raise exception 'Photo unlink did not create a cleanup task';
  end if;
  delete from storage.objects where bucket_id = 'mission7-record-images';
  if not found then raise exception 'Detached photo cannot be cleaned'; end if;
end $$;

set local request.jwt.claim.sub = '71100000-0000-4000-8000-000000000002';
do $$
begin
  if exists (select 1 from public.storage_cleanup_tasks) then raise exception 'B can see A cleanup task'; end if;
  delete from public.storage_cleanup_tasks;
  if found then raise exception 'B can delete A cleanup task'; end if;
end $$;

set local request.jwt.claim.sub = '71100000-0000-4000-8000-000000000001';
delete from public.work_records where id = '71100000-0000-4000-8000-000000000003';

do $$
begin
  if exists (select 1 from public.work_records) then raise exception 'A record was not deleted'; end if;
end $$;

reset role;
select 'mission7 ownership QA passed' as result;
rollback;
