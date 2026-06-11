import type { createClient } from "@/lib/supabase/server";
import type { ProviderDashboardListing } from "@/lib/provider-dashboard/types";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

const listingColumns =
  "business_name, status, is_featured, city, state, phone, email, website, short_description";

/**
 * Finds the provider directory row whose email matches the signed-in user (case-insensitive).
 */
export async function getProviderListingByEmail(
  supabase: ServerSupabase,
  email: string,
): Promise<ProviderDashboardListing | null> {
  const normalized = email.trim();
  if (!normalized) {
    return null;
  }

  const { data, error } = await supabase
    .from("providers")
    .select(listingColumns)
    .ilike("email", normalized)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return data as ProviderDashboardListing;
}
