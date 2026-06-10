import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Where to send a user after sign-in.
 * Same rule as public.is_admin() / requireAdmin(): profiles.role must be 'admin'.
 */
export async function getPostLoginRedirectPath(
  supabase: SupabaseClient,
): Promise<"/admin" | "/dashboard"> {
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

  return "/dashboard";
}
