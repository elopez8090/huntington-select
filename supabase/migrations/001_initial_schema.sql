-- Huntington Select — initial schema and RLS (MVP)
-- Tables: profiles, offers, credit_balances, credit_ledger, redemptions
-- Stripe-related tables intentionally omitted.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'member',
  created_at timestamptz not null default now(),

  constraint profiles_role_check check (role in ('member', 'admin'))
);

create index profiles_role_idx on public.profiles (role);

-- ---------------------------------------------------------------------------
-- offers
-- ---------------------------------------------------------------------------
create table public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default 'general',
  credits_required integer not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),

  constraint offers_status_check check (status in ('draft', 'active', 'archived')),
  constraint offers_credits_required_positive check (credits_required > 0)
);

create index offers_status_idx on public.offers (status);
create index offers_category_idx on public.offers (category);
create index offers_created_at_idx on public.offers (created_at desc);

-- ---------------------------------------------------------------------------
-- credit_balances
-- ---------------------------------------------------------------------------
create table public.credit_balances (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  balance integer not null default 0,

  constraint credit_balances_balance_non_negative check (balance >= 0)
);

-- ---------------------------------------------------------------------------
-- credit_ledger
-- ---------------------------------------------------------------------------
create table public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount integer not null,
  type text not null,
  description text not null default '',
  created_at timestamptz not null default now(),

  constraint credit_ledger_type_check check (
    type in ('purchase', 'redemption', 'admin_adjustment')
  ),
  constraint credit_ledger_amount_nonzero check (amount <> 0)
);

create index credit_ledger_user_id_created_at_idx
  on public.credit_ledger (user_id, created_at desc);

create index credit_ledger_type_idx on public.credit_ledger (type);

-- ---------------------------------------------------------------------------
-- redemptions
-- ---------------------------------------------------------------------------
create table public.redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  offer_id uuid not null references public.offers (id) on delete restrict,
  credits_used integer not null,
  created_at timestamptz not null default now(),

  constraint redemptions_credits_used_positive check (credits_used > 0)
);

create index redemptions_user_id_created_at_idx
  on public.redemptions (user_id, created_at desc);

create index redemptions_offer_id_idx on public.redemptions (offer_id);

-- ---------------------------------------------------------------------------
-- RLS helper
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.offers enable row level security;
alter table public.credit_balances enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.redemptions enable row level security;

-- profiles: read own row; admins read all. No client insert/delete.
create policy profiles_select_authenticated
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy profiles_update_own_member
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid() and not public.is_admin())
  with check (id = auth.uid() and role = 'member');

create policy profiles_update_admin
  on public.profiles
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- offers: members see active only; admins full CRUD
create policy offers_select_authenticated
  on public.offers
  for select
  to authenticated
  using (status = 'active' or public.is_admin());

create policy offers_insert_admin
  on public.offers
  for insert
  to authenticated
  with check (public.is_admin());

create policy offers_update_admin
  on public.offers
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy offers_delete_admin
  on public.offers
  for delete
  to authenticated
  using (public.is_admin());

-- credit_balances: read only via client; mutations use service role
create policy credit_balances_select_authenticated
  on public.credit_balances
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- credit_ledger: read only via client; append-only, server writes
create policy credit_ledger_select_authenticated
  on public.credit_ledger
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- redemptions: read only via client; inserts via service role
create policy redemptions_select_authenticated
  on public.redemptions
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());
