"use server";

import { assertAdminForAction } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ToggleProviderFeaturedResult =
  | { ok: true; is_featured: boolean }
  | { ok: false; error: string };

export async function toggleProviderFeatured(
  providerId: string,
): Promise<ToggleProviderFeaturedResult> {
  const admin = await assertAdminForAction();
  if (!admin.ok) {
    return admin;
  }

  const id = providerId.trim();
  if (!id) {
    return { ok: false, error: "Provider not found." };
  }

  const supabase = await createClient();

  const { data: provider, error: fetchError } = await supabase
    .from("providers")
    .select("id, is_featured")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, error: "Could not load this provider." };
  }

  if (!provider) {
    return { ok: false, error: "Provider not found." };
  }

  const nextFeatured = !provider.is_featured;

  const { error: updateError } = await supabase
    .from("providers")
    .update({ is_featured: nextFeatured })
    .eq("id", id);

  if (updateError) {
    return {
      ok: false,
      error: "Could not update featured status. Please try again.",
    };
  }

  revalidatePath("/admin/providers");
  revalidatePath("/");
  revalidatePath("/providers");

  return { ok: true, is_featured: nextFeatured };
}
