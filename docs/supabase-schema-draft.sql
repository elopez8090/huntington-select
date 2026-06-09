-- Huntington Select — MVP Supabase schema (draft)
-- Tables: profiles, offers, credit_balances, credit_ledger, redemptions
-- RLS policies and Stripe-related tables are intentionally omitted.

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
