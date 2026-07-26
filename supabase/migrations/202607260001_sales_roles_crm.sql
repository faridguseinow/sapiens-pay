alter table public.team_members
  add column if not exists role text not null default 'sales'
  check (role in ('admin', 'sales'));

alter table public.team_members drop constraint if exists team_members_name_key;

-- Migration-dən əvvəl mövcud olan panel istifadəçiləri admin olaraq qalır.
update public.team_members set role = 'admin';
alter table public.team_members alter column role set default 'sales';

create table if not exists public.sales_customers (
  id uuid primary key default gen_random_uuid(),
  representative_id uuid not null references public.team_members(id) on delete restrict,
  name text not null,
  phone text not null,
  email text,
  service_key text not null check (
    service_key in (
      'foreign-bank-accounts',
      'shopify-payments',
      'company-formation',
      'international-payments'
    )
  ),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'interested', 'proposal', 'won', 'lost')),
  potential_value numeric not null default 0 check (potential_value >= 0),
  notes text,
  next_contact_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sales_customers_representative_index
  on public.sales_customers (representative_id, created_at desc);
create index if not exists sales_customers_status_index
  on public.sales_customers (status);

drop trigger if exists sales_customers_set_updated_at on public.sales_customers;
create trigger sales_customers_set_updated_at
before update on public.sales_customers
for each row execute function public.set_updated_at();

alter table public.sales_customers enable row level security;

drop policy if exists "Authenticated users manage team members" on public.team_members;
create policy "Staff can view team members"
on public.team_members for select to authenticated using (true);
create policy "Owner manages team roles"
on public.team_members for update to authenticated
using ((auth.jwt() ->> 'email') = 'cavidrahimo@gmail.com')
with check ((auth.jwt() ->> 'email') = 'cavidrahimo@gmail.com');

create policy "Admins view all sales customers"
on public.sales_customers for select to authenticated
using (
  exists (
    select 1 from public.team_members me
    where me.auth_user_id = auth.uid() and me.role = 'admin'
  )
  or representative_id = (
    select me.id from public.team_members me where me.auth_user_id = auth.uid()
  )
);
create policy "Staff create permitted sales customers"
on public.sales_customers for insert to authenticated
with check (
  exists (
    select 1 from public.team_members me
    where me.auth_user_id = auth.uid()
      and (me.role = 'admin' or representative_id = me.id)
  )
);
create policy "Staff update permitted sales customers"
on public.sales_customers for update to authenticated
using (
  exists (
    select 1 from public.team_members me
    where me.auth_user_id = auth.uid()
      and (me.role = 'admin' or representative_id = me.id)
  )
)
with check (
  exists (
    select 1 from public.team_members me
    where me.auth_user_id = auth.uid()
      and (me.role = 'admin' or representative_id = me.id)
  )
);
create policy "Admins delete sales customers"
on public.sales_customers for delete to authenticated
using (
  exists (
    select 1 from public.team_members me
    where me.auth_user_id = auth.uid() and me.role = 'admin'
  )
);

drop policy if exists "Authenticated users manage internal tasks" on public.admin_tasks;
create policy "Staff view permitted tasks"
on public.admin_tasks for select to authenticated
using (
  exists (
    select 1 from public.team_members me
    where me.auth_user_id = auth.uid()
      and (me.role = 'admin' or admin_tasks.assignee_id = me.id)
  )
);
create policy "Admins create tasks"
on public.admin_tasks for insert to authenticated
with check (
  exists (
    select 1 from public.team_members me
    where me.auth_user_id = auth.uid() and me.role = 'admin'
  )
);
create policy "Staff update permitted tasks"
on public.admin_tasks for update to authenticated
using (
  exists (
    select 1 from public.team_members me
    where me.auth_user_id = auth.uid()
      and (me.role = 'admin' or admin_tasks.assignee_id = me.id)
  )
)
with check (
  exists (
    select 1 from public.team_members me
    where me.auth_user_id = auth.uid()
      and (me.role = 'admin' or admin_tasks.assignee_id = me.id)
  )
);
create policy "Admins delete tasks"
on public.admin_tasks for delete to authenticated
using (
  exists (
    select 1 from public.team_members me
    where me.auth_user_id = auth.uid() and me.role = 'admin'
  )
);

drop policy if exists "Authenticated users manage task updates" on public.task_updates;
create policy "Staff view permitted task updates"
on public.task_updates for select to authenticated
using (
  exists (
    select 1
    from public.admin_tasks task
    join public.team_members me on me.auth_user_id = auth.uid()
    where task.id = task_updates.task_id
      and (me.role = 'admin' or task.assignee_id = me.id)
  )
);
create policy "Assigned staff add task updates"
on public.task_updates for insert to authenticated
with check (
  exists (
    select 1
    from public.admin_tasks task
    join public.team_members me on me.auth_user_id = auth.uid()
    where task.id = task_updates.task_id
      and (me.role = 'admin' or task.assignee_id = me.id)
  )
);
