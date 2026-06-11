"use server";

import { assertAdminForAction } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type UpdateProviderStatusResult =
  | { ok: true }
  | { ok: false; error: string };

async function setProviderStatus(
  providerId: string,
  nextStatus: "approved" | "rejected",
): Promise<UpdateProviderStatusResult> {
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
    .select("id, status")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, error: "Could not load this provider." };
  }

  if (!provider) {
    return { ok: false, error: "Provider not found." };
  }

  if (provider.status === nextStatus) {
    return {
      ok: false,
      error:
        nextStatus === "approved"
          ? "This provider is already approved."
          : "This provider is already rejected.",
    };
  }

  const { error: updateError } = await supabase
    .from("providers")
    .update({ status: nextStatus })
    .eq("id", id);

  if (updateError) {
    return {
      ok: false,
      error: "Could not update provider status. Please try again.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/providers");
  revalidatePath("/providers");
  revalidatePath("/");

  return { ok: true };
}

export async function approveProviderListing(
  providerId: string,
): Promise<UpdateProviderStatusResult> {
  return setProviderStatus(providerId, "approved");
}

export async function rejectProviderListing(
  providerId: string,
): Promise<UpdateProviderStatusResult> {
  return setProviderStatus(providerId, "rejected");
}
