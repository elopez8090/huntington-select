-- Huntington Select — provider network schema (MVP)
-- Tables: service_categories, providers, provider_categories
-- Does not modify 001_initial_schema.sql or 002_offer_schema_v2.sql.

-- ---------------------------------------------------------------------------
-- service_categories
-- ---------------------------------------------------------------------------
create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),

  constraint service_categories_slug_unique unique (slug)
);

create index service_categories_sort_order_idx
  on public.service_categories (sort_order);

-- ---------------------------------------------------------------------------
-- providers
-- ---------------------------------------------------------------------------
create table public.providers (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  slug text not null,
  description text not null default '',
  short_description text,
  phone text,
  email text,
  website text,
  address text,
  city text,
  state text,
  zip_code text,
  logo_url text,
  cover_image_url text,
  status text not null default 'draft',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint providers_slug_unique unique (slug),
  constraint providers_status_check check (
    status in ('draft', 'pending', 'approved', 'rejected', 'archived')
  )
);

create index providers_status_idx on public.providers (status);

create index providers_featured_approved_idx
  on public.providers (featured)
  where featured = true and status = 'approved';

create index providers_city_state_idx
  on public.providers (city, state)
  where status = 'approved';

create index providers_created_at_idx
  on public.providers (created_at desc);

-- ---------------------------------------------------------------------------
-- provider_categories (join)
-- ---------------------------------------------------------------------------
create table public.provider_categories (
  provider_id uuid not null references public.providers (id) on delete cascade,
  category_id uuid not null references public.service_categories (id) on delete cascade,

  primary key (provider_id, category_id)
);

create index provider_categories_category_id_idx
  on public.provider_categories (category_id);

-- ---------------------------------------------------------------------------
-- providers updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_providers_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger providers_set_updated_at
  before update on public.providers
  for each row
  execute function public.set_providers_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.service_categories enable row level security;
alter table public.providers enable row level security;
alter table public.provider_categories enable row level security;

-- service_categories: public read; admins full manage
create policy service_categories_select_public
  on public.service_categories
  for select
  to anon, authenticated
  using (true);

create policy service_categories_insert_admin
  on public.service_categories
  for insert
  to authenticated
  with check (public.is_admin());

create policy service_categories_update_admin
  on public.service_categories
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy service_categories_delete_admin
  on public.service_categories
  for delete
  to authenticated
  using (public.is_admin());

-- providers: public read approved only; admins full manage
create policy providers_select_public_approved
  on public.providers
  for select
  to anon, authenticated
  using (status = 'approved');

create policy providers_select_admin
  on public.providers
  for select
  to authenticated
  using (public.is_admin());

create policy providers_insert_admin
  on public.providers
  for insert
  to authenticated
  with check (public.is_admin());

create policy providers_update_admin
  on public.providers
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy providers_delete_admin
  on public.providers
  for delete
  to authenticated
  using (public.is_admin());

-- provider_categories: public read when provider is approved; admins full manage
create policy provider_categories_select_public_approved
  on public.provider_categories
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.providers p
      where p.id = provider_id
        and p.status = 'approved'
    )
  );

create policy provider_categories_select_admin
  on public.provider_categories
  for select
  to authenticated
  using (public.is_admin());

create policy provider_categories_insert_admin
  on public.provider_categories
  for insert
  to authenticated
  with check (public.is_admin());

create policy provider_categories_update_admin
  on public.provider_categories
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy provider_categories_delete_admin
  on public.provider_categories
  for delete
  to authenticated
  using (public.is_admin());
