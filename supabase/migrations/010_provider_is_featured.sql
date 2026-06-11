-- Rename providers.featured to is_featured (same semantics, default false).

drop index if exists public.providers_featured_approved_idx;

alter table public.providers
  rename column featured to is_featured;

create index providers_is_featured_approved_idx
  on public.providers (is_featured)
  where is_featured = true and status = 'approved';
