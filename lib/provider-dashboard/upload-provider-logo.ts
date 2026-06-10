"use server";

import { getProviderListingForEdit } from "@/lib/provider-dashboard/get-provider-listing-for-edit";
import {
  ALLOWED_PROVIDER_LOGO_TYPES,
  MAX_PROVIDER_LOGO_BYTES,
  PROVIDER_LOGOS_BUCKET,
  getProviderLogoPublicUrl,
  providerLogoObjectPath,
} from "@/lib/provider-dashboard/provider-logo-storage";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type UploadProviderLogoResult =
  | { ok: true; logoUrl: string }
  | { ok: false; error: string };

export async function uploadProviderLogo(
  file: File,
): Promise<UploadProviderLogoResult> {
  if (!file || file.size === 0) {
    return { ok: false, error: "Choose an image file to upload." };
  }

  if (file.size > MAX_PROVIDER_LOGO_BYTES) {
    return { ok: false, error: "Logo must be 1 MB or smaller." };
  }

  if (!ALLOWED_PROVIDER_LOGO_TYPES.has(file.type)) {
    return {
      ok: false,
      error: "Logo must be a JPEG, PNG, WebP, or GIF image.",
    };
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

  const objectPath = providerLogoObjectPath(existing.id);
  const { error: uploadError } = await supabase.storage
    .from(PROVIDER_LOGOS_BUCKET)
    .upload(objectPath, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "3600",
    });

  if (uploadError) {
    return {
      ok: false,
      error: "Could not upload your logo. Please try again.",
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return {
      ok: false,
      error: "Storage is not configured. Please contact support.",
    };
  }

  const logoUrl = getProviderLogoPublicUrl(supabaseUrl, existing.id, Date.now());

  const { error: updateError } = await supabase
    .from("providers")
    .update({ logo_url: logoUrl })
    .eq("id", existing.id);

  if (updateError) {
    return {
      ok: false,
      error: "Logo uploaded but could not save to your listing.",
    };
  }

  revalidatePath("/provider/dashboard");
  revalidatePath("/provider/edit-listing");
  revalidatePath("/providers");

  return { ok: true, logoUrl };
}
