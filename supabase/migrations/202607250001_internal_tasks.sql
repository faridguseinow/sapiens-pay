create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (name)
);

create table if not exists public.admin_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assignee_id uuid not null references public.team_members(id) on delete restrict,
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'done')),
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  deadline timestamptz not null,
  seen_at timestamptz,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.task_updates (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.admin_tasks(id) on delete cascade,
  author text not null,
  note text not null,
  from_status text check (from_status in ('todo', 'in_progress', 'done')),
  to_status text check (to_status in ('todo', 'in_progress', 'done')),
  created_at timestamptz not null default now()
);

create index if not exists admin_tasks_status_deadline_index
  on public.admin_tasks (status, deadline);
create index if not exists admin_tasks_assignee_index
  on public.admin_tasks (assignee_id);
create index if not exists task_updates_task_index
  on public.task_updates (task_id, created_at desc);

drop trigger if exists admin_tasks_set_updated_at on public.admin_tasks;
create trigger admin_tasks_set_updated_at
before update on public.admin_tasks
for each row execute function public.set_updated_at();

alter table public.team_members enable row level security;
alter table public.admin_tasks enable row level security;
alter table public.task_updates enable row level security;

create policy "Authenticated users manage team members"
on public.team_members for all to authenticated using (true) with check (true);

create policy "Authenticated users manage internal tasks"
on public.admin_tasks for all to authenticated using (true) with check (true);

create policy "Authenticated users manage task updates"
on public.task_updates for all to authenticated using (true) with check (true);

insert into public.team_members (name)
values ('Ramazan Umarov')
on conflict (name) do nothing;
