create policy "authenticated users insert outbound mail" on public.mail_messages
for insert to authenticated with check (direction = 'outbound');
