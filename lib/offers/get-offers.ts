import type { createClient } from "@/lib/supabase/server";
import type { OfferDetail, OfferListItem } from "@/lib/offers/types";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

const listColumns =
  "id, title, description, category, credits_required, created_at, short_description, image_url, featured, merchant_name, expiration_date";

const detailColumns = `${listColumns}, status, merchant_website, location, redemption_instructions, terms_and_conditions, updated_at`;

export async function getActiveOffers(
  supabase: ServerSupabase,
): Promise<OfferListItem[]> {
  const { data, error } = await supabase
    .from("offers")
    .select(listColumns)
    .eq("status", "active")
    .order("featured", { ascending: false })
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
    .select(detailColumns)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
