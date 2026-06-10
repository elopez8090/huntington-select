-- Let signed-in users read their own provider row by email (any status).
-- Public directory policy still only exposes approved listings.

create policy providers_select_own_email
  on public.providers
  for select
  to authenticated
  using (
    email is not null
    and (auth.jwt() ->> 'email') is not null
    and lower(trim(email)) = lower(trim(auth.jwt() ->> 'email'))
  );
