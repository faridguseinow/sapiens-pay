-- Existing sales potential values were entered in USD. Convert them once to AZN at 1 USD = 1.70 AZN.
update public.sales_customers
set potential_value = round(potential_value * 1.70, 2);

comment on column public.sales_customers.potential_value is
  'Potential sales value in AZN.';
