import type { AdminDashboardStats } from "@/lib/admin/types";
import type { createClient } from "@/lib/supabase/server";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

export async function getAdminDashboardStats(
  supabase: ServerSupabase,
): Promise<AdminDashboardStats> {
  const [
    providersResult,
    pendingResult,
    approvedResult,
    categoriesResult,
  ] = await Promise.all([
    supabase.from("providers").select("id", { count: "exact", head: true }),
    supabase
      .from("provider_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("providers")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
    supabase
      .from("service_categories")
      .select("id", { count: "exact", head: true }),
  ]);

  if (providersResult.error) {
    throw new Error(providersResult.error.message);
  }
  if (pendingResult.error) {
    throw new Error(pendingResult.error.message);
  }
  if (approvedResult.error) {
    throw new Error(approvedResult.error.message);
  }
  if (categoriesResult.error) {
    throw new Error(categoriesResult.error.message);
  }

  return {
    totalProviders: providersResult.count ?? 0,
    pendingApplications: pendingResult.count ?? 0,
    approvedProviders: approvedResult.count ?? 0,
    categoryCount: categoriesResult.count ?? 0,
  };
}
