-- Huntington Select — auto-create profile on Supabase Auth signup
-- Does not modify prior migrations.

-- ---------------------------------------------------------------------------
-- profile on auth.users insert
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, created_at)
  values (new.id, new.email, 'member', now());
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
