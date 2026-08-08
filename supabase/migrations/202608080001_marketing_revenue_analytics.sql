-- Marketing & Revenue Analytics extends the existing CRM instead of replacing it.
-- Money is stored in the original currency plus an AZN-normalized amount so that
-- cross-currency totals are never produced by summing incompatible values.

create table if not exists public.marketing_sources (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z0-9][a-z0-9-]*$'),
  name text not null,
  channel text not null,
  is_paid boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.marketing_sources (key, name, channel, is_paid) values
  ('meta-ads', 'Meta Ads', 'Paid social', true),
  ('instagram-organic', 'Instagram Organic', 'Organic social', false),
  ('tiktok-organic', 'TikTok Organic', 'Organic social', false),
  ('google-ads', 'Google Ads', 'Paid search', true),
  ('telegram', 'Telegram', 'Messaging', false),
  ('referral', 'Tövsiyə', 'Referral', false),
  ('partner', 'Partnyor', 'Partner', false),
  ('influencer', 'Influencer', 'Influencer', true),
  ('direct', 'Birbaşa', 'Direct', false),
  ('website', 'Vebsayt', 'Website', false),
  ('whatsapp', 'WhatsApp', 'Messaging', false),
  ('sdr-outbound', 'SDR Outbound', 'Outbound', false),
  ('sales-outbound', 'Sales Outbound', 'Outbound', false),
  ('other', 'Digər', 'Other', false)
on conflict (key) do update set
  name = excluded.name,
  channel = excluded.channel,
  is_paid = excluded.is_paid;

create table if not exists public.analytics_products (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z0-9][a-z0-9-]*$'),
  name text not null,
  category text,
  is_recurring boolean not null default false,
  target_margin_percent numeric check (target_margin_percent between 0 and 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.analytics_products (key, name, category) values
  ('wise', 'Wise', 'Bank hesabı'),
  ('wise-business', 'Wise Business', 'Bank hesabı'),
  ('payoneer', 'Payoneer', 'Bank hesabı'),
  ('payoneer-business', 'Payoneer Business', 'Bank hesabı'),
  ('paypal', 'PayPal', 'Ödəniş sistemi'),
  ('paypal-business', 'PayPal Business', 'Ödəniş sistemi'),
  ('stripe', 'Stripe', 'Ödəniş sistemi'),
  ('shopify-payments', 'Shopify Payments', 'Ödəniş sistemi'),
  ('company-registration', 'Şirkət qeydiyyatı', 'Şirkət xidməti'),
  ('bookkeeping', 'Mühasibatlıq', 'Davamlı xidmət'),
  ('compliance', 'Compliance', 'Davamlı xidmət'),
  ('business-address', 'Biznes ünvanı', 'Şirkət xidməti'),
  ('package', 'Paket / Bundle', 'Paket')
on conflict (key) do update set name = excluded.name, category = excluded.category;

create table if not exists public.marketing_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  platform text not null,
  source_id uuid not null references public.marketing_sources(id) on delete restrict,
  external_id text,
  objective text,
  starts_at date,
  ends_at date,
  status text not null default 'active' check (status in ('draft', 'active', 'paused', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, external_id)
);

create table if not exists public.marketing_daily_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_date date not null,
  source_id uuid not null references public.marketing_sources(id) on delete restrict,
  campaign_id uuid references public.marketing_campaigns(id) on delete cascade,
  currency text not null default 'AZN' check (currency ~ '^[A-Z]{3}$'),
  spend numeric not null default 0 check (spend >= 0),
  spend_azn numeric not null default 0 check (spend_azn >= 0),
  impressions bigint not null default 0 check (impressions >= 0),
  reach bigint not null default 0 check (reach >= 0),
  clicks bigint not null default 0 check (clicks >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (metric_date, source_id, campaign_id)
);

create table if not exists public.marketing_expenses (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null,
  amount numeric not null check (amount >= 0),
  amount_azn numeric not null check (amount_azn >= 0),
  currency text not null default 'AZN' check (currency ~ '^[A-Z]{3}$'),
  platform text,
  source_id uuid references public.marketing_sources(id) on delete set null,
  campaign_id uuid references public.marketing_campaigns(id) on delete set null,
  expense_type text not null check (expense_type in (
    'advertising', 'influencer', 'content', 'creative', 'agency', 'software', 'other'
  )),
  description text,
  created_by uuid references public.team_members(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads
  add column if not exists source_id uuid references public.marketing_sources(id) on delete set null,
  add column if not exists campaign_id uuid references public.marketing_campaigns(id) on delete set null,
  add column if not exists product_id uuid references public.analytics_products(id) on delete set null,
  add column if not exists lead_medium text,
  add column if not exists lead_content text,
  add column if not exists lead_term text,
  add column if not exists first_touch_source_id uuid references public.marketing_sources(id) on delete set null,
  add column if not exists first_touch_medium text,
  add column if not exists first_touch_campaign text,
  add column if not exists last_touch_source_id uuid references public.marketing_sources(id) on delete set null,
  add column if not exists last_touch_medium text,
  add column if not exists last_touch_campaign text,
  add column if not exists referrer text,
  add column if not exists landing_page text,
  add column if not exists country text,
  add column if not exists qualified_at timestamptz,
  add column if not exists contacted_at timestamptz,
  add column if not exists assigned_at timestamptz,
  add column if not exists converted_at timestamptz,
  add column if not exists paid_at timestamptz,
  add column if not exists assigned_sdr_id uuid references public.team_members(id) on delete set null,
  add column if not exists assigned_sales_id uuid references public.team_members(id) on delete set null,
  add column if not exists deal_value numeric check (deal_value >= 0);

alter table public.sales_customers
  add column if not exists lead_id uuid references public.leads(id) on delete set null,
  add column if not exists source_id uuid references public.marketing_sources(id) on delete set null,
  add column if not exists campaign_id uuid references public.marketing_campaigns(id) on delete set null,
  add column if not exists product_id uuid references public.analytics_products(id) on delete set null,
  add column if not exists country text,
  add column if not exists won_at timestamptz;

create table if not exists public.customer_payments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.sales_customers(id) on delete restrict,
  lead_id uuid references public.leads(id) on delete set null,
  product_id uuid references public.analytics_products(id) on delete set null,
  source_id uuid references public.marketing_sources(id) on delete set null,
  campaign_id uuid references public.marketing_campaigns(id) on delete set null,
  amount numeric not null check (amount > 0),
  amount_azn numeric not null check (amount_azn > 0),
  direct_cost_azn numeric check (direct_cost_azn >= 0),
  currency text not null default 'AZN' check (currency ~ '^[A-Z]{3}$'),
  payment_status text not null default 'paid' check (payment_status in ('pending', 'paid', 'refunded', 'failed')),
  revenue_type text not null default 'one_time' check (revenue_type in ('one_time', 'recurring')),
  paid_at timestamptz,
  external_reference text unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_touchpoints (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  source_id uuid references public.marketing_sources(id) on delete set null,
  campaign_id uuid references public.marketing_campaigns(id) on delete set null,
  medium text,
  content text,
  term text,
  referrer text,
  landing_page text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create or replace function public.sync_lead_stage_timestamps()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.status = 'contacted' and old.status is distinct from new.status and new.contacted_at is null then
    new.contacted_at = now();
  end if;
  if new.status = 'qualified' and old.status is distinct from new.status and new.qualified_at is null then
    new.qualified_at = now();
  end if;
  if new.status = 'won' and old.status is distinct from new.status then
    new.converted_at = coalesce(new.converted_at, now());
  end if;
  return new;
end;
$$;

drop trigger if exists leads_sync_stage_timestamps on public.leads;
create trigger leads_sync_stage_timestamps before update of status on public.leads
for each row execute function public.sync_lead_stage_timestamps();

drop trigger if exists marketing_campaigns_set_updated_at on public.marketing_campaigns;
create trigger marketing_campaigns_set_updated_at before update on public.marketing_campaigns
for each row execute function public.set_updated_at();
drop trigger if exists marketing_daily_metrics_set_updated_at on public.marketing_daily_metrics;
create trigger marketing_daily_metrics_set_updated_at before update on public.marketing_daily_metrics
for each row execute function public.set_updated_at();
drop trigger if exists marketing_expenses_set_updated_at on public.marketing_expenses;
create trigger marketing_expenses_set_updated_at before update on public.marketing_expenses
for each row execute function public.set_updated_at();
drop trigger if exists customer_payments_set_updated_at on public.customer_payments;
create trigger customer_payments_set_updated_at before update on public.customer_payments
for each row execute function public.set_updated_at();

create index if not exists leads_analytics_date_index on public.leads (submitted_at, status);
create index if not exists leads_analytics_source_index on public.leads (source_id, submitted_at);
create index if not exists leads_analytics_campaign_index on public.leads (campaign_id, submitted_at);
create index if not exists leads_analytics_product_index on public.leads (product_id, submitted_at);
create index if not exists leads_analytics_sdr_index on public.leads (assigned_sdr_id, submitted_at);
create index if not exists leads_analytics_sales_index on public.leads (assigned_sales_id, submitted_at);
create index if not exists campaign_metrics_date_index on public.marketing_daily_metrics (metric_date, campaign_id);
create index if not exists marketing_expenses_date_index on public.marketing_expenses (expense_date, expense_type);
create index if not exists payments_paid_date_index on public.customer_payments (paid_at, payment_status);
create index if not exists payments_attribution_index on public.customer_payments (source_id, campaign_id, product_id);
create index if not exists touchpoints_lead_date_index on public.lead_touchpoints (lead_id, occurred_at);

alter table public.marketing_sources enable row level security;
alter table public.analytics_products enable row level security;
alter table public.marketing_campaigns enable row level security;
alter table public.marketing_daily_metrics enable row level security;
alter table public.marketing_expenses enable row level security;
alter table public.customer_payments enable row level security;
alter table public.lead_touchpoints enable row level security;

create policy "Active marketing sources are public"
on public.marketing_sources for select to anon
using (is_active = true);

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'marketing_sources', 'analytics_products', 'marketing_campaigns',
    'marketing_daily_metrics', 'marketing_expenses', 'customer_payments', 'lead_touchpoints'
  ] loop
    execute format('create policy "Admins manage %s" on public.%I for all to authenticated using (exists (select 1 from public.team_members me where me.auth_user_id = auth.uid() and me.role = ''admin'')) with check (exists (select 1 from public.team_members me where me.auth_user_id = auth.uid() and me.role = ''admin''))', table_name, table_name);
  end loop;
end $$;

comment on table public.marketing_daily_metrics is 'Daily ad-platform aggregates; spend_azn is used for cross-currency KPI totals.';
comment on table public.customer_payments is 'Actual customer payment ledger and the sole source of recognized analytics revenue.';
comment on table public.lead_touchpoints is 'Immutable ordered attribution contacts; lead first/last fields are denormalized snapshots.';
