import { userHasProviderListing } from "@/lib/auth/user-has-provider-listing";
import type { SupabaseClient } from "@supabase/supabase-js";

export type PostLoginRedirectPath =
  | "/admin"
  | "/dashboard"
  | "/provider/dashboard";

/**
 * Where to send a user after sign-in.
 * Admin: profiles.role = 'admin'. Provider: email matches public.providers.
 */
export async function getPostLoginRedirectPath(
  supabase: SupabaseClient,
): Promise<PostLoginRedirectPath> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "/dashboard";
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role === "admin") {
    return "/admin";
  }

  const email = user.email ?? "";
  if (email && (await userHasProviderListing(supabase, email))) {
    return "/provider/dashboard";
  }

  return "/dashboard";
}
