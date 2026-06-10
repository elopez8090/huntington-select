import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * True when the signed-in user's email matches a row in public.providers.
 * Used for redirects and area guards without changing profiles.role.
 */
export async function userHasProviderListing(
  supabase: SupabaseClient,
  email: string,
): Promise<boolean> {
  const normalized = email.trim();
  if (!normalized) {
    return false;
  }

  const { data, error } = await supabase
    .from("providers")
    .select("id")
    .ilike("email", normalized)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data !== null;
}
