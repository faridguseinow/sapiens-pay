alter table public.sales_customers
  add column if not exists source_detail text check (char_length(source_detail) <= 180);

comment on column public.sales_customers.source_detail is
  'Free-text acquisition source when the selected marketing source is Other.';
