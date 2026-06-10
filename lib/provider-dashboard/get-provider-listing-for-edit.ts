import type { createClient } from "@/lib/supabase/server";
import type { ProviderEditListing } from "@/lib/provider-dashboard/types";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

const editListingColumns =
  "id, business_name, short_description, description, phone, website, address, city, state, zip_code";

/**
 * Finds the provider directory row whose email matches the signed-in user (case-insensitive).
 */
export async function getProviderListingForEdit(
  supabase: ServerSupabase,
  email: string,
): Promise<ProviderEditListing | null> {
  const normalized = email.trim();
  if (!normalized) {
    return null;
  }

  const { data, error } = await supabase
    .from("providers")
    .select(editListingColumns)
    .ilike("email", normalized)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return data as ProviderEditListing;
}
