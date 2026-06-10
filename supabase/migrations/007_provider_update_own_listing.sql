-- Let signed-in users update their own provider row (matched by listing email).
-- Admins retain full manage via providers_update_admin.

create policy providers_update_own_email
  on public.providers
  for update
  to authenticated
  using (
    email is not null
    and (auth.jwt() ->> 'email') is not null
    and lower(trim(email)) = lower(trim(auth.jwt() ->> 'email'))
  )
  with check (
    email is not null
    and (auth.jwt() ->> 'email') is not null
    and lower(trim(email)) = lower(trim(auth.jwt() ->> 'email'))
  );
