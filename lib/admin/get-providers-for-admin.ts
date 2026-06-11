import type { createClient } from "@/lib/supabase/server";
import type { AdminProviderRow } from "@/lib/admin/types";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

export async function getProvidersForAdmin(
  supabase: ServerSupabase,
): Promise<AdminProviderRow[]> {
  const { data, error } = await supabase
    .from("providers")
    .select(
      "id, business_name, slug, city, state, status, is_featured, created_at",
    )
    .order("is_featured", { ascending: false })
    .order("business_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    business_name: row.business_name,
    slug: row.slug,
    city: row.city,
    state: row.state,
    status: row.status,
    is_featured: row.is_featured,
    created_at: row.created_at,
  }));
}
