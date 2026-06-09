-- Huntington Select — provider applications intake
-- Public submit; admin read/update. Does not modify prior migrations.

-- ---------------------------------------------------------------------------
-- provider_applications
-- ---------------------------------------------------------------------------
create table public.provider_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  business_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  website text,
  service_category_id uuid not null references public.service_categories (id) on delete restrict,
  city text not null,
  short_description text not null,
  why_select text not null,
  status text not null default 'pending',
  admin_notes text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint provider_applications_status_check check (
    status in ('pending', 'approved', 'rejected')
  )
);

create index provider_applications_status_idx
  on public.provider_applications (status);

create index provider_applications_submitted_at_idx
  on public.provider_applications (submitted_at desc);

create index provider_applications_service_category_id_idx
  on public.provider_applications (service_category_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_provider_applications_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger provider_applications_set_updated_at
  before update on public.provider_applications
  for each row
  execute function public.set_provider_applications_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.provider_applications enable row level security;

-- Anyone (signed in or not) may submit; status must stay pending; no admin fields
create policy provider_applications_insert_public
  on public.provider_applications
  for insert
  to anon, authenticated
  with check (
    status = 'pending'
    and admin_notes is null
    and reviewed_at is null
  );

create policy provider_applications_select_admin
  on public.provider_applications
  for select
  to authenticated
  using (public.is_admin());

create policy provider_applications_update_admin
  on public.provider_applications
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
