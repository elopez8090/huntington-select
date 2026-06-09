-- Huntington Select — offers table schema v2 (MVP fields)
-- Adds presentation, partner, validity, compliance, and audit columns to public.offers.
-- Does not change 001_initial_schema.sql or RLS policies.

-- ---------------------------------------------------------------------------
-- offers: new columns
-- ---------------------------------------------------------------------------
alter table public.offers
  add column short_description text,
  add column image_url text,
  add column featured boolean not null default false,
  add column merchant_name text,
  add column merchant_website text,
  add column location text,
  add column expiration_date date,
  add column redemption_instructions text,
  add column terms_and_conditions text,
  add column updated_at timestamptz not null default now();

-- Existing rows: align updated_at with created_at (new column default is migration time)
update public.offers
set updated_at = created_at;

-- ---------------------------------------------------------------------------
-- indexes
-- ---------------------------------------------------------------------------
create index offers_featured_active_idx
  on public.offers (featured)
  where featured = true and status = 'active';

create index offers_expiration_date_idx
  on public.offers (expiration_date)
  where expiration_date is not null;

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_offers_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger offers_set_updated_at
  before update on public.offers
  for each row
  execute function public.set_offers_updated_at();
