alter table public.posts
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists category text,
  add column if not exists scheduled_at timestamptz;

create index if not exists posts_schedule_index
  on public.posts (status, scheduled_at, published_at);
