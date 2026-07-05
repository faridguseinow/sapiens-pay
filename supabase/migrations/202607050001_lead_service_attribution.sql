alter table public.leads
  add column if not exists service_key text,
  add column if not exists service_name text,
  add column if not exists package_name text,
  add column if not exists source_path text,
  add column if not exists source_label text;

create index if not exists leads_service_index
  on public.leads (service_key, submitted_at desc);

update public.leads
set
  service_key = coalesce(service_key, profile->>'serviceKey'),
  service_name = coalesce(service_name, profile->>'service'),
  package_name = coalesce(package_name, profile->>'package'),
  source_path = coalesce(source_path, profile->>'sourcePath'),
  source_label = coalesce(source_label, profile->>'sourceLabel')
where profile is not null;

create or replace function public.sync_lead_attribution()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.service_key = coalesce(new.service_key, new.profile->>'serviceKey');
  new.service_name = coalesce(new.service_name, new.profile->>'service');
  new.package_name = coalesce(new.package_name, new.profile->>'package');
  new.source_path = coalesce(new.source_path, new.profile->>'sourcePath');
  new.source_label = coalesce(new.source_label, new.profile->>'sourceLabel');
  return new;
end;
$$;

drop trigger if exists leads_sync_attribution on public.leads;
create trigger leads_sync_attribution
before insert or update of profile on public.leads
for each row execute function public.sync_lead_attribution();

comment on column public.leads.service_key is 'Stable service identifier selected by the lead';
comment on column public.leads.service_name is 'Localized service name shown to the lead';
comment on column public.leads.package_name is 'Selected package, country, or payment platform';
comment on column public.leads.source_path is 'Website path where the lead form was opened';
comment on column public.leads.source_label is 'CTA or UI element that opened the lead form';
