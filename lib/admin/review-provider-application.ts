"use server";

import { makeUniqueProviderSlug } from "@/lib/admin/make-provider-slug";
import { assertAdminForAction } from "@/lib/auth/require-admin";
import {
  notifyProviderApplicationApproved,
  notifyProviderApplicationRejected,
} from "@/lib/email/provider-application-notifications";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ReviewApplicationResult =
  | { ok: true }
  | { ok: false; error: string };

type ApplicationRecord = {
  id: string;
  business_name: string;
  email: string;
  phone: string;
  website: string | null;
  city: string;
  short_description: string;
  why_select: string;
  status: string;
  service_category_id: string;
};

function buildProviderDescription(
  shortDescription: string,
  whySelect: string,
): string {
  const parts = [shortDescription.trim(), whySelect.trim()].filter(Boolean);
  return parts.join("\n\n");
}

export async function approveProviderApplication(
  applicationId: string,
): Promise<ReviewApplicationResult> {
  const admin = await assertAdminForAction();
  if (!admin.ok) {
    return admin;
  }

  const id = applicationId.trim();
  if (!id) {
    return { ok: false, error: "Application not found." };
  }

  const supabase = await createClient();

  const { data: application, error: fetchError } = await supabase
    .from("provider_applications")
    .select(
      "id, business_name, email, phone, website, city, short_description, why_select, status, service_category_id",
    )
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, error: "Could not load this application." };
  }

  if (!application) {
    return { ok: false, error: "Application not found." };
  }

  const app = application as ApplicationRecord;

  if (app.status !== "pending") {
    return {
      ok: false,
      error: "Only pending applications can be approved.",
    };
  }

  const slug = await makeUniqueProviderSlug(supabase, app.business_name);

  const { data: provider, error: insertError } = await supabase
    .from("providers")
    .insert({
      business_name: app.business_name,
      slug,
      description: buildProviderDescription(
        app.short_description,
        app.why_select,
      ),
      short_description: app.short_description,
      phone: app.phone,
      email: app.email,
      website: app.website,
      city: app.city,
      state: "NY",
      status: "approved",
    })
    .select("id")
    .single();

  if (insertError || !provider) {
    return {
      ok: false,
      error: "Could not create the provider listing. Please try again.",
    };
  }

  const { error: categoryError } = await supabase
    .from("provider_categories")
    .insert({
      provider_id: provider.id,
      category_id: app.service_category_id,
    });

  if (categoryError) {
    await supabase.from("providers").delete().eq("id", provider.id);
    return {
      ok: false,
      error: "Could not link the service category. Please try again.",
    };
  }

  const reviewedAt = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("provider_applications")
    .update({
      status: "approved",
      reviewed_at: reviewedAt,
    })
    .eq("id", id)
    .eq("status", "pending");

  if (updateError) {
    return {
      ok: false,
      error:
        "The listing was created but the application could not be marked approved. Please contact support.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/provider-applications");
  revalidatePath("/providers");

  void notifyProviderApplicationApproved({
    toEmail: app.email,
    businessName: app.business_name,
  });

  return { ok: true };
}

export async function rejectProviderApplication(
  applicationId: string,
): Promise<ReviewApplicationResult> {
  const admin = await assertAdminForAction();
  if (!admin.ok) {
    return admin;
  }

  const id = applicationId.trim();
  if (!id) {
    return { ok: false, error: "Application not found." };
  }

  const supabase = await createClient();

  const { data: application, error: fetchError } = await supabase
    .from("provider_applications")
    .select("id, status, email, contact_name")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, error: "Could not load this application." };
  }

  if (!application) {
    return { ok: false, error: "Application not found." };
  }

  if (application.status !== "pending") {
    return {
      ok: false,
      error: "Only pending applications can be rejected.",
    };
  }

  const { error: updateError } = await supabase
    .from("provider_applications")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending");

  if (updateError) {
    return {
      ok: false,
      error: "Could not reject this application. Please try again.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/provider-applications");

  void notifyProviderApplicationRejected({
    toEmail: application.email,
    contactName: application.contact_name,
  });

  return { ok: true };
}
