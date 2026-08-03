-- Incremental blog/SEO upgrade. Existing rows and URLs are preserved.
alter table public.posts
  add column if not exists subtitle text,
  add column if not exists featured_image_alt text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists author text,
  add column if not exists is_featured boolean not null default false,
  add column if not exists focus_keyword text,
  add column if not exists secondary_keywords text[] not null default '{}',
  add column if not exists canonical_url text,
  add column if not exists og_title text,
  add column if not exists og_description text,
  add column if not exists og_image_url text,
  add column if not exists robots_index boolean not null default true,
  add column if not exists include_in_sitemap boolean not null default true;

alter table public.posts drop constraint if exists posts_status_check;
alter table public.posts
  add constraint posts_status_check
  check (status in ('draft', 'published', 'scheduled', 'archived'));

-- Old published rows remain published. Future-dated rows become explicitly scheduled.
update public.posts
set status = 'scheduled',
    scheduled_at = coalesce(scheduled_at, published_at)
where status = 'published' and published_at > now();

create unique index if not exists posts_locale_slug_unique
  on public.posts (locale, slug);
create index if not exists posts_public_blog_index
  on public.posts (locale, status, published_at desc)
  where robots_index = true;
create index if not exists posts_tags_gin_index on public.posts using gin (tags);

create table if not exists public.post_slug_redirects (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  locale text not null check (locale in ('az', 'ru', 'en')),
  old_slug text not null,
  created_at timestamptz not null default now(),
  unique (locale, old_slug)
);

alter table public.post_slug_redirects enable row level security;

drop policy if exists "Published posts are public" on public.posts;
create policy "Published posts are public"
on public.posts for select to anon
using (
  status in ('published', 'scheduled')
  and published_at is not null
  and published_at <= now()
);

create policy "Public redirects target published posts"
on public.post_slug_redirects for select to anon
using (
  exists (
    select 1 from public.posts
    where posts.id = post_slug_redirects.post_id
      and posts.status in ('published', 'scheduled')
      and posts.published_at is not null
      and posts.published_at <= now()
  )
);

drop policy if exists "Admins manage posts" on public.posts;
create policy "Admins manage posts"
on public.posts for all to authenticated
using (exists (select 1 from public.team_members where auth_user_id = auth.uid() and role = 'admin'))
with check (exists (select 1 from public.team_members where auth_user_id = auth.uid() and role = 'admin'));

create policy "Admins manage post redirects"
on public.post_slug_redirects for all to authenticated
using (exists (select 1 from public.team_members where auth_user_id = auth.uid() and role = 'admin'))
with check (exists (select 1 from public.team_members where auth_user_id = auth.uid() and role = 'admin'));

drop policy if exists "Admins upload blog images" on storage.objects;
drop policy if exists "Admins update blog images" on storage.objects;
drop policy if exists "Admins delete blog images" on storage.objects;
create policy "Admins upload blog images" on storage.objects for insert to authenticated
with check (bucket_id = 'blog-images' and exists (select 1 from public.team_members where auth_user_id = auth.uid() and role = 'admin'));
create policy "Admins update blog images" on storage.objects for update to authenticated
using (bucket_id = 'blog-images' and exists (select 1 from public.team_members where auth_user_id = auth.uid() and role = 'admin'))
with check (bucket_id = 'blog-images' and exists (select 1 from public.team_members where auth_user_id = auth.uid() and role = 'admin'));
create policy "Admins delete blog images" on storage.objects for delete to authenticated
using (bucket_id = 'blog-images' and exists (select 1 from public.team_members where auth_user_id = auth.uid() and role = 'admin'));
