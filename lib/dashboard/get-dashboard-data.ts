import type { createClient } from "@/lib/supabase/server";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

export type DashboardRedemption = {
  id: string;
  credits_used: number;
  created_at: string;
  offerTitle: string;
};

export type DashboardData = {
  email: string;
  creditBalance: number;
  totalRedemptions: number;
  activeOffersCount: number;
  recentRedemptions: DashboardRedemption[];
};

function offerTitleFromJoin(
  offers: { title: string } | { title: string }[] | null,
): string {
  if (!offers) return "Offer";
  if (Array.isArray(offers)) {
    return offers[0]?.title ?? "Offer";
  }
  return offers.title;
}

export async function getDashboardData(
  supabase: ServerSupabase,
  userId: string,
  fallbackEmail: string,
): Promise<DashboardData> {
  const [
    profileResult,
    balanceResult,
    redemptionsCountResult,
    recentRedemptionsResult,
    activeOffersResult,
  ] = await Promise.all([
    supabase.from("profiles").select("email").eq("id", userId).maybeSingle(),
    supabase
      .from("credit_balances")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("redemptions")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("redemptions")
      .select("id, credits_used, created_at, offers ( title )")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("offers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
  ]);

  const email = profileResult.data?.email ?? fallbackEmail;
  const creditBalance = balanceResult.data?.balance ?? 0;
  const totalRedemptions = redemptionsCountResult.count ?? 0;
  const activeOffersCount = activeOffersResult.count ?? 0;

  const recentRedemptions: DashboardRedemption[] =
    recentRedemptionsResult.data?.map((row) => ({
      id: row.id,
      credits_used: row.credits_used,
      created_at: row.created_at,
      offerTitle: offerTitleFromJoin(row.offers),
    })) ?? [];

  return {
    email,
    creditBalance,
    totalRedemptions,
    activeOffersCount,
    recentRedemptions,
  };
}
