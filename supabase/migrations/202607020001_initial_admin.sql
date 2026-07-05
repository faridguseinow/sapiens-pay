create extension if not exists "pgcrypto";

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  translation_group_id uuid not null default gen_random_uuid(),
  locale text not null check (locale in ('az', 'ru', 'en')),
  title text not null,
  slug text not null,
  excerpt text,
  content text not null default '',
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (locale, slug)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  preferred_contact text,
  estimated_loss numeric not null default 0,
  locale text not null default 'az' check (locale in ('az', 'ru', 'en')),
  profile jsonb not null default '{}'::jsonb,
  answers jsonb not null default '[]'::jsonb,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'won', 'closed')),
  notes text,
  next_follow_up_at timestamptz,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_public_index
  on public.posts (locale, status, published_at desc);
create index if not exists leads_submitted_index
  on public.leads (submitted_at desc);
create index if not exists leads_status_index
  on public.leads (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

alter table public.posts enable row level security;
alter table public.leads enable row level security;

create policy "Published posts are public"
on public.posts for select
to anon
using (status = 'published');

create policy "Admins manage posts"
on public.posts for all
to authenticated
using (true)
with check (true);

create policy "Website can submit leads"
on public.leads for insert
to anon
with check (
  status = 'new'
  and notes is null
  and next_follow_up_at is null
);

create policy "Admins manage leads"
on public.leads for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = excluded.public;

create policy "Blog images are public"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'blog-images');

create policy "Admins upload blog images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'blog-images');

create policy "Admins update blog images"
on storage.objects for update
to authenticated
using (bucket_id = 'blog-images')
with check (bucket_id = 'blog-images');

create policy "Admins delete blog images"
on storage.objects for delete
to authenticated
using (bucket_id = 'blog-images');
