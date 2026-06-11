"use server";

import { getProviderListingForEdit } from "@/lib/provider-dashboard/get-provider-listing-for-edit";
import {
  ALLOWED_PROVIDER_COVER_TYPES,
  MAX_PROVIDER_COVER_BYTES,
  PROVIDER_COVERS_BUCKET,
  getProviderCoverPublicUrl,
  providerCoverObjectPath,
} from "@/lib/provider-dashboard/provider-cover-storage";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type UploadProviderCoverResult =
  | { ok: true; coverImageUrl: string }
  | { ok: false; error: string };

export async function uploadProviderCover(
  file: File,
): Promise<UploadProviderCoverResult> {
  if (!file || file.size === 0) {
    return { ok: false, error: "Choose an image file to upload." };
  }

  if (file.size > MAX_PROVIDER_COVER_BYTES) {
    return { ok: false, error: "Cover image must be 1 MB or smaller." };
  }

  if (!ALLOWED_PROVIDER_COVER_TYPES.has(file.type)) {
    return {
      ok: false,
      error: "Cover image must be a JPEG, PNG, WebP, or GIF image.",
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

  const objectPath = providerCoverObjectPath(existing.id);
  const { error: uploadError } = await supabase.storage
    .from(PROVIDER_COVERS_BUCKET)
    .upload(objectPath, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "3600",
    });

  if (uploadError) {
    return {
      ok: false,
      error: "Could not upload your cover image. Please try again.",
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return {
      ok: false,
      error: "Storage is not configured. Please contact support.",
    };
  }

  const coverImageUrl = getProviderCoverPublicUrl(
    supabaseUrl,
    existing.id,
    Date.now(),
  );

  const { error: updateError } = await supabase
    .from("providers")
    .update({ cover_image_url: coverImageUrl })
    .eq("id", existing.id);

  if (updateError) {
    return {
      ok: false,
      error: "Cover uploaded but could not save to your listing.",
    };
  }

  revalidatePath("/provider/dashboard");
  revalidatePath("/provider/edit-listing");
  revalidatePath("/providers");

  return { ok: true, coverImageUrl };
}
