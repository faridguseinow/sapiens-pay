drop policy if exists "Authenticated staff view active marketing sources"
  on public.marketing_sources;

create policy "Authenticated staff view active marketing sources"
on public.marketing_sources
for select
to authenticated
using (is_active = true);
