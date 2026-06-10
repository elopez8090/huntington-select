"use server";

import { getProviderListingForEdit } from "@/lib/provider-dashboard/get-provider-listing-for-edit";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type UpdateProviderListingInput = {
  businessName: string;
  shortDescription: string;
  description: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

export type UpdateProviderListingResult =
  | { ok: true }
  | { ok: false; error: string };

function trim(value: string): string {
  return value.trim();
}

function emptyToNull(value: string): string | null {
  const trimmed = trim(value);
  return trimmed ? trimmed : null;
}

export async function updateProviderListing(
  input: UpdateProviderListingInput,
): Promise<UpdateProviderListingResult> {
  const businessName = trim(input.businessName);
  const shortDescription = trim(input.shortDescription);
  const description = trim(input.description);
  const phone = trim(input.phone);
  const website = trim(input.website);
  const address = trim(input.address);
  const city = trim(input.city);
  const state = trim(input.state);
  const zipCode = trim(input.zipCode);

  if (!businessName) {
    return { ok: false, error: "Business name is required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  const email = user.email?.trim() ?? "";
  if (!email) {
    return {
      ok: false,
      error: "Your account does not have an email address on file.",
    };
  }

  const existing = await getProviderListingForEdit(supabase, email);
  if (!existing) {
    return {
      ok: false,
      error: "No provider listing is linked to your account.",
    };
  }

  const { error } = await supabase
    .from("providers")
    .update({
      business_name: businessName,
      short_description: emptyToNull(shortDescription),
      description: description,
      phone: emptyToNull(phone),
      website: emptyToNull(website),
      address: emptyToNull(address),
      city: emptyToNull(city),
      state: emptyToNull(state),
      zip_code: emptyToNull(zipCode),
    })
    .eq("id", existing.id);

  if (error) {
    return {
      ok: false,
      error: "Could not save your listing. Please try again.",
    };
  }

  revalidatePath("/provider/dashboard");
  revalidatePath("/provider/edit-listing");
  revalidatePath("/providers");

  return { ok: true };
}
