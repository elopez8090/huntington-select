import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AdminSession = {
  userId: string;
  email: string;
};

/**
 * Same rule as public.is_admin(): profiles.role must be 'admin'.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .maybeSingle();

  if (error || profile?.role !== "admin") {
    redirect("/");
  }

  return {
    userId: user.id,
    email: profile.email ?? user.email ?? "",
  };
}

export async function assertAdminForAction(): Promise<
  | { ok: true; userId: string }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || profile?.role !== "admin") {
    return { ok: false, error: "You do not have permission to do that." };
  }

  return { ok: true, userId: user.id };
}
