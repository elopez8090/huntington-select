-- Provider cover image uploads (Supabase Storage bucket + RLS).
-- Object path: {provider_id}/cover (one cover per provider).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'provider-covers',
  'provider-covers',
  true,
  1048576,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy provider_covers_select_public
  on storage.objects
  for select
  to public
  using (bucket_id = 'provider-covers');

create policy provider_covers_insert_own
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'provider-covers'
    and (string_to_array(name, '/'))[1] in (
      select p.id::text
      from public.providers p
      where
        p.email is not null
        and (auth.jwt() ->> 'email') is not null
        and lower(trim(p.email)) = lower(trim(auth.jwt() ->> 'email'))
    )
  );

create policy provider_covers_update_own
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'provider-covers'
    and (string_to_array(name, '/'))[1] in (
      select p.id::text
      from public.providers p
      where
        p.email is not null
        and (auth.jwt() ->> 'email') is not null
        and lower(trim(p.email)) = lower(trim(auth.jwt() ->> 'email'))
    )
  )
  with check (
    bucket_id = 'provider-covers'
    and (string_to_array(name, '/'))[1] in (
      select p.id::text
      from public.providers p
      where
        p.email is not null
        and (auth.jwt() ->> 'email') is not null
        and lower(trim(p.email)) = lower(trim(auth.jwt() ->> 'email'))
    )
  );

create policy provider_covers_delete_own
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'provider-covers'
    and (string_to_array(name, '/'))[1] in (
      select p.id::text
      from public.providers p
      where
        p.email is not null
        and (auth.jwt() ->> 'email') is not null
        and lower(trim(p.email)) = lower(trim(auth.jwt() ->> 'email'))
    )
  );
