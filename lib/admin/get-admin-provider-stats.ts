import type { AdminProviderStats } from "@/lib/admin/types";
import type { createClient } from "@/lib/supabase/server";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

export async function getAdminProviderStats(
  supabase: ServerSupabase,
): Promise<AdminProviderStats> {
  const [total, approved, pending, rejected, featured] = await Promise.all([
    supabase.from("providers").select("id", { count: "exact", head: true }),
    supabase
      .from("providers")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
    supabase
      .from("providers")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("providers")
      .select("id", { count: "exact", head: true })
      .eq("status", "rejected"),
    supabase
      .from("providers")
      .select("id", { count: "exact", head: true })
      .eq("is_featured", true),
  ]);

  if (total.error) throw new Error(total.error.message);
  if (approved.error) throw new Error(approved.error.message);
  if (pending.error) throw new Error(pending.error.message);
  if (rejected.error) throw new Error(rejected.error.message);
  if (featured.error) throw new Error(featured.error.message);

  return {
    total: total.count ?? 0,
    approved: approved.count ?? 0,
    pending: pending.count ?? 0,
    rejected: rejected.count ?? 0,
    featured: featured.count ?? 0,
  };
}
