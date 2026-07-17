create table if not exists public.mail_states (
  user_id uuid not null references auth.users(id) on delete cascade,
  message_id text not null,
  folder text not null default 'inbox' check (folder in ('inbox','archive','trash','spam')),
  is_read boolean not null default false,
  is_starred boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, message_id)
);

create table if not exists public.mail_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipients text[] not null default '{}',
  cc text[] not null default '{}',
  bcc text[] not null default '{}',
  subject text not null default '',
  body text not null default '',
  reply_to_message_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mail_messages (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  direction text not null check (direction in ('inbound','outbound')),
  message_id text,
  thread_key text not null,
  sender text not null,
  recipients text[] not null default '{}',
  cc text[] not null default '{}',
  bcc text[] not null default '{}',
  reply_to text[] not null default '{}',
  subject text not null default '',
  text_body text,
  html_body text,
  attachments jsonb not null default '[]'::jsonb,
  headers jsonb not null default '{}'::jsonb,
  delivery_status text,
  received_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists mail_states_user_folder_idx on public.mail_states(user_id, folder);
create index if not exists mail_drafts_user_updated_idx on public.mail_drafts(user_id, updated_at desc);
alter table public.mail_states enable row level security;
alter table public.mail_drafts enable row level security;
alter table public.mail_messages enable row level security;

create policy "users manage own mail states" on public.mail_states for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users manage own mail drafts" on public.mail_drafts for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "authenticated users read mail messages" on public.mail_messages for select to authenticated using (true);
