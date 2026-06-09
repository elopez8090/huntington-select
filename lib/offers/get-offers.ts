import type { createClient } from "@/lib/supabase/server";
import type { OfferDetail, OfferListItem } from "@/lib/offers/types";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

const listColumns =
  "id, title, description, category, credits_required, created_at";

export async function getActiveOffers(
  supabase: ServerSupabase,
): Promise<OfferListItem[]> {
  const { data, error } = await supabase
    .from("offers")
    .select(listColumns)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getOfferById(
  supabase: ServerSupabase,
  id: string,
): Promise<OfferDetail | null> {
  const { data, error } = await supabase
    .from("offers")
    .select(`${listColumns}, status`)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
