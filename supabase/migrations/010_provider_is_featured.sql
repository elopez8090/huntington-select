-- Add providers.is_featured and partial index for approved featured listings.
-- Safe when the column was never created or environments diverged (no rename).

drop index if exists public.providers_featured_approved_idx;

alter table public.providers
  add column if not exists is_featured boolean not null default false;

create index if not exists providers_is_featured_approved_idx
  on public.providers (is_featured)
  where is_featured = true and status = 'approved';
