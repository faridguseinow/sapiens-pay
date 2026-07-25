alter table public.team_members
  add column if not exists auth_user_id uuid references auth.users(id) on delete cascade;

create unique index if not exists team_members_auth_user_index
  on public.team_members (auth_user_id)
  where auth_user_id is not null;

update public.team_members member
set auth_user_id = auth_user.id
from auth.users auth_user
where member.auth_user_id is null
  and member.email is not null
  and lower(member.email) = lower(auth_user.email);

insert into public.team_members (name, email, auth_user_id)
select
  coalesce(
    nullif(trim(auth_user.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(auth_user.raw_user_meta_data ->> 'name'), ''),
    split_part(auth_user.email, '@', 1)
  ),
  auth_user.email,
  auth_user.id
from auth.users auth_user
where not exists (
  select 1 from public.team_members member where member.auth_user_id = auth_user.id
)
on conflict (name) do update set
  email = excluded.email,
  auth_user_id = excluded.auth_user_id,
  is_active = true;

create or replace function public.sync_team_member_from_auth()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.team_members (name, email, auth_user_id)
  values (
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      split_part(new.email, '@', 1)
    ),
    new.email,
    new.id
  )
  on conflict (auth_user_id) where auth_user_id is not null
  do update set
    name = excluded.name,
    email = excluded.email,
    is_active = true;
  return new;
end;
$$;

drop trigger if exists sync_team_member_after_auth_change on auth.users;
create trigger sync_team_member_after_auth_change
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.sync_team_member_from_auth();
