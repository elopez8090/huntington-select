-- Huntington Select — sample provider directory data (demo only)
-- Safe to run in Supabase SQL Editor after migration 003_provider_network_schema.sql
-- Uses fixed UUIDs and ON CONFLICT so you can re-run without duplicate slug errors.

-- ---------------------------------------------------------------------------
-- service_categories (6)
-- ---------------------------------------------------------------------------
insert into public.service_categories (id, name, slug, description, sort_order)
values
  (
    'a1000001-0001-4001-8001-000000000001',
    'Plumbing',
    'plumbing',
    'Sample category: pipes, fixtures, and water heaters for Huntington homes.',
    10
  ),
  (
    'a1000001-0001-4001-8001-000000000002',
    'Electrical',
    'electrical',
    'Sample category: panels, wiring, and lighting on the North Shore.',
    20
  ),
  (
    'a1000001-0001-4001-8001-000000000003',
    'Landscaping',
    'landscaping',
    'Sample category: lawns, planting, and outdoor upkeep.',
    30
  ),
  (
    'a1000001-0001-4001-8001-000000000004',
    'HVAC',
    'hvac',
    'Sample category: heating, cooling, and comfort systems.',
    40
  ),
  (
    'a1000001-0001-4001-8001-000000000005',
    'Painting',
    'painting',
    'Sample category: interior and exterior painting.',
    50
  ),
  (
    'a1000001-0001-4001-8001-000000000006',
    'Home Cleaning',
    'home-cleaning',
    'Sample category: recurring and deep home cleaning.',
    60
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- providers (5 approved — visible in public directory)
-- ---------------------------------------------------------------------------
insert into public.providers (
  id,
  business_name,
  slug,
  description,
  short_description,
  phone,
  email,
  website,
  address,
  city,
  state,
  zip_code,
  status,
  is_featured
)
values
  (
    'b2000002-0002-4002-8002-000000000001',
    '[SAMPLE] Huntington Harbor Plumbing Co.',
    'sample-huntington-harbor-plumbing',
    'Demo listing only — not a real business. Imaginary full-service plumbing for Huntington Village and harbor-area homes.',
    'Sample plumber for directory testing.',
    '631-555-0101',
    'demo-plumbing@example.huntington-select.test',
    'https://example.huntington-select.test/sample-plumbing',
    '123 Demo Harbor Rd',
    'Huntington',
    'NY',
    '11743',
    'approved',
    true
  ),
  (
    'b2000002-0002-4002-8002-000000000002',
    '[DEMO] North Shore Electric LLC',
    'demo-north-shore-electric',
    'Demo listing only. Fictional licensed electrical work for Huntington, Halesite, and Cold Spring Harbor.',
    'Sample electrician for directory testing.',
    '631-555-0102',
    'demo-electric@example.huntington-select.test',
    'https://example.huntington-select.test/sample-electric',
    '45 Sample Main St',
    'Huntington',
    'NY',
    '11743',
    'approved',
    false
  ),
  (
    'b2000002-0002-4002-8002-000000000003',
    '[SAMPLE] Greenway Lawn & Garden (Huntington)',
    'sample-greenway-lawn-huntington',
    'Demo listing only. Made-up landscaping and yard care along Route 110 and nearby neighborhoods.',
    'Sample landscaper for directory testing.',
    '631-555-0103',
    'demo-landscape@example.huntington-select.test',
    null,
    '200 Demo Greenway Ln',
    'Huntington Station',
    'NY',
    '11746',
    'approved',
    true
  ),
  (
    'b2000002-0002-4002-8002-000000000004',
    '[DEMO] Main Street Paint Pros',
    'demo-main-street-paint-pros',
    'Demo listing only. Sample interior and exterior painting for Huntington homes and small businesses.',
    'Sample painter for directory testing.',
    '631-555-0104',
    'demo-paint@example.huntington-select.test',
    'https://example.huntington-select.test/sample-paint',
    '8 Demo Main St',
    'Huntington',
    'NY',
    '11743',
    'approved',
    false
  ),
  (
    'b2000002-0002-4002-8002-000000000005',
    '[SAMPLE] Town Line HVAC & Comfort',
    'sample-town-line-hvac',
    'Demo listing only. Fictional heating and AC service near the Huntington–South Huntington town line.',
    'Sample HVAC for directory testing.',
    '631-555-0105',
    'demo-hvac@example.huntington-select.test',
    'https://example.huntington-select.test/sample-hvac',
    '500 Demo Town Line Rd',
    'South Huntington',
    'NY',
    '11746',
    'approved',
    false
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- provider_categories (links)
-- ---------------------------------------------------------------------------
insert into public.provider_categories (provider_id, category_id)
values
  -- Huntington Harbor Plumbing → Plumbing
  (
    'b2000002-0002-4002-8002-000000000001',
    'a1000001-0001-4001-8001-000000000001'
  ),
  -- North Shore Electric → Electrical
  (
    'b2000002-0002-4002-8002-000000000002',
    'a1000001-0001-4001-8001-000000000002'
  ),
  -- Greenway Lawn → Landscaping, Home Cleaning (demo multi-category)
  (
    'b2000002-0002-4002-8002-000000000003',
    'a1000001-0001-4001-8001-000000000003'
  ),
  (
    'b2000002-0002-4002-8002-000000000003',
    'a1000001-0001-4001-8001-000000000006'
  ),
  -- Main Street Paint → Painting
  (
    'b2000002-0002-4002-8002-000000000004',
    'a1000001-0001-4001-8001-000000000005'
  ),
  -- Town Line HVAC → HVAC
  (
    'b2000002-0002-4002-8002-000000000005',
    'a1000001-0001-4001-8001-000000000004'
  )
on conflict (provider_id, category_id) do nothing;
