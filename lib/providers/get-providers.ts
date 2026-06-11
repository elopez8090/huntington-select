import type { createClient } from "@/lib/supabase/server";
import type {
  ProviderCategoryRef,
  ProviderDetail,
  ProviderListItem,
  ServiceCategory,
} from "@/lib/providers/types";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

type CategoryJoinRow = {
  service_categories: ProviderCategoryRef | null;
};

function mapCategories(rows: CategoryJoinRow[] | null): ProviderCategoryRef[] {
  if (!rows?.length) return [];
  const categories = rows
    .map((row) => row.service_categories)
    .filter((cat): cat is ProviderCategoryRef => cat != null);
  return categories.sort((a, b) => a.name.localeCompare(b.name));
}

const listColumns =
  "id, slug, business_name, short_description, city, state, logo_url, is_featured, provider_categories ( service_categories ( id, name, slug ) )";

const detailColumns =
  "id, slug, business_name, description, short_description, phone, email, website, address, city, state, zip_code, logo_url, cover_image_url, is_featured, provider_categories ( service_categories ( id, name, slug ) )";

function mapListRow(row: {
  id: string;
  slug: string;
  business_name: string;
  short_description: string | null;
  city: string | null;
  state: string | null;
  logo_url: string | null;
  is_featured: boolean;
  provider_categories: unknown;
}): ProviderListItem {
  return {
    id: row.id,
    slug: row.slug,
    business_name: row.business_name,
    short_description: row.short_description,
    city: row.city,
    state: row.state,
    logo_url: row.logo_url,
    is_featured: row.is_featured,
    categories: mapCategories(
      row.provider_categories as CategoryJoinRow[] | null,
    ),
  };
}

export async function getServiceCategories(
  supabase: ServerSupabase,
): Promise<ServiceCategory[]> {
  const { data, error } = await supabase
    .from("service_categories")
    .select("id, name, slug, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getApprovedProviders(
  supabase: ServerSupabase,
): Promise<ProviderListItem[]> {
  const { data, error } = await supabase
    .from("providers")
    .select(listColumns)
    .eq("status", "approved")
    .order("is_featured", { ascending: false })
    .order("business_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapListRow(row));
}

export async function getFeaturedProviders(
  supabase: ServerSupabase,
  limit = 6,
): Promise<ProviderListItem[]> {
  const { data, error } = await supabase
    .from("providers")
    .select(listColumns)
    .eq("status", "approved")
    .eq("is_featured", true)
    .order("business_name", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapListRow(row));
}

export async function getApprovedProviderBySlug(
  supabase: ServerSupabase,
  slug: string,
): Promise<ProviderDetail | null> {
  const { data, error } = await supabase
    .from("providers")
    .select(detailColumns)
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    business_name: data.business_name,
    description: data.description,
    short_description: data.short_description,
    phone: data.phone,
    email: data.email,
    website: data.website,
    address: data.address,
    city: data.city,
    state: data.state,
    zip_code: data.zip_code,
    logo_url: data.logo_url,
    cover_image_url: data.cover_image_url,
    is_featured: data.is_featured,
    categories: mapCategories(
      data.provider_categories as unknown as CategoryJoinRow[] | null,
    ),
  };
}
