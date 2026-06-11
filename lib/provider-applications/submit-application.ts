"use server";

import {
  notifyAdminProviderApplicationSubmitted,
} from "@/lib/email/provider-application-notifications";
import { createClient } from "@/lib/supabase/server";

export type SubmitProviderApplicationInput = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  serviceCategoryId: string;
  city: string;
  shortDescription: string;
  whySelect: string;
};

export type SubmitProviderApplicationResult =
  | { ok: true }
  | { ok: false; error: string };

function trim(value: string): string {
  return value.trim();
}

export async function submitProviderApplication(
  input: SubmitProviderApplicationInput,
): Promise<SubmitProviderApplicationResult> {
  const businessName = trim(input.businessName);
  const contactName = trim(input.contactName);
  const email = trim(input.email);
  const phone = trim(input.phone);
  const website = trim(input.website);
  const serviceCategoryId = trim(input.serviceCategoryId);
  const city = trim(input.city);
  const shortDescription = trim(input.shortDescription);
  const whySelect = trim(input.whySelect);

  if (!businessName) {
    return { ok: false, error: "Business name is required." };
  }
  if (!contactName) {
    return { ok: false, error: "Contact name is required." };
  }
  if (!email) {
    return { ok: false, error: "Email is required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!phone) {
    return { ok: false, error: "Phone is required." };
  }
  if (!serviceCategoryId) {
    return { ok: false, error: "Please choose a service category." };
  }
  if (!city) {
    return { ok: false, error: "City is required." };
  }
  if (!shortDescription) {
    return { ok: false, error: "Short description is required." };
  }
  if (!whySelect) {
    return { ok: false, error: "Please tell us why you should be selected." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error: insertError } = await supabase
    .from("provider_applications")
    .insert({
      user_id: user?.id ?? null,
      business_name: businessName,
      contact_name: contactName,
      email,
      phone,
      website: website || null,
      service_category_id: serviceCategoryId,
      city,
      short_description: shortDescription,
      why_select: whySelect,
      status: "pending",
    });

  if (insertError) {
    return {
      ok: false,
      error:
        "We could not save your application. Please try again in a moment.",
    };
  }

  const { data: category } = await supabase
    .from("service_categories")
    .select("name")
    .eq("id", serviceCategoryId)
    .maybeSingle();

  void notifyAdminProviderApplicationSubmitted({
    applicantName: contactName,
    businessName,
    email,
    categoryName: category?.name ?? "—",
  });

  return { ok: true };
}
