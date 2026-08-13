alter table public.admin_tasks
  add column if not exists archived_at timestamptz,
  add column if not exists archived_by uuid references public.team_members(id) on delete set null;

create index if not exists admin_tasks_active_board_index
  on public.admin_tasks (status, deadline)
  where archived_at is null;

drop policy if exists "Staff update permitted tasks" on public.admin_tasks;
drop policy if exists "Assigned staff add task updates" on public.task_updates;

create or replace function public.mark_internal_task_seen(task_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.team_members;
  task public.admin_tasks;
begin
  select * into actor
  from public.team_members
  where auth_user_id = auth.uid() and is_active = true;

  if actor.id is null then raise exception 'İstifadəçi tapılmadı.'; end if;

  select * into task
  from public.admin_tasks
  where id = task_id and archived_at is null
  for update;

  if task.id is null then raise exception 'Tapşırıq tapılmadı.'; end if;
  if task.assignee_id <> actor.id then raise exception 'Bu tapşırıq sizə təyin edilməyib.'; end if;

  if task.seen_at is null then
    update public.admin_tasks set seen_at = now() where id = task.id;
    insert into public.task_updates (task_id, author, note)
    values (task.id, coalesce(actor.email, actor.name), 'Tapşırığı gördü.');
  end if;
end;
$$;

create or replace function public.update_internal_task_status(task_id uuid, next_status text, update_note text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.team_members;
  task public.admin_tasks;
  clean_note text := trim(coalesce(update_note, ''));
begin
  if next_status not in ('todo', 'in_progress', 'done') then raise exception 'Status yanlışdır.'; end if;
  if clean_note = '' or length(clean_note) > 2000 then raise exception 'Qeyd 1-2000 simvol olmalıdır.'; end if;

  select * into actor
  from public.team_members
  where auth_user_id = auth.uid() and is_active = true;

  if actor.id is null then raise exception 'İstifadəçi tapılmadı.'; end if;

  select * into task
  from public.admin_tasks
  where id = task_id and archived_at is null
  for update;

  if task.id is null then raise exception 'Tapşırıq tapılmadı.'; end if;
  if task.assignee_id <> actor.id then raise exception 'Bu tapşırıq sizə təyin edilməyib.'; end if;

  update public.admin_tasks
  set status = next_status,
      seen_at = coalesce(seen_at, now()),
      completed_at = case
        when next_status = 'done' then coalesce(completed_at, now())
        else null
      end
  where id = task.id;

  insert into public.task_updates (task_id, author, note, from_status, to_status)
  values (task.id, coalesce(actor.email, actor.name), clean_note, task.status, next_status);
end;
$$;

create or replace function public.archive_internal_task(task_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.team_members;
begin
  select * into actor
  from public.team_members
  where auth_user_id = auth.uid() and is_active = true;

  if actor.id is null or actor.role <> 'admin' then
    raise exception 'Tapşırığı yalnız admin arxivləşdirə bilər.';
  end if;

  update public.admin_tasks
  set archived_at = now(), archived_by = actor.id
  where id = task_id and archived_at is null;

  if not found then raise exception 'Tapşırıq tapılmadı və ya artıq arxivdədir.'; end if;
end;
$$;

revoke all on function public.mark_internal_task_seen(uuid) from public;
revoke all on function public.update_internal_task_status(uuid, text, text) from public;
revoke all on function public.archive_internal_task(uuid) from public;
grant execute on function public.mark_internal_task_seen(uuid) to authenticated;
grant execute on function public.update_internal_task_status(uuid, text, text) to authenticated;
grant execute on function public.archive_internal_task(uuid) to authenticated;
