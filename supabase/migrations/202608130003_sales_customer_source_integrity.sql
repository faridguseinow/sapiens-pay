-- Keep source attribution queryable and sales-stage timestamps reliable.
create index if not exists sales_customers_source_index
  on public.sales_customers (source_id, created_at desc);

create or replace function public.sync_sales_customer_won_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'won' and old.status is distinct from new.status then
    new.won_at = coalesce(new.won_at, now());
  elsif new.status <> 'won' then
    new.won_at = null;
  end if;
  return new;
end;
$$;

drop trigger if exists sales_customers_sync_won_at on public.sales_customers;
create trigger sales_customers_sync_won_at
before update of status on public.sales_customers
for each row execute function public.sync_sales_customer_won_at();

update public.sales_customers
set won_at = coalesce(won_at, updated_at, created_at)
where status = 'won' and won_at is null;
