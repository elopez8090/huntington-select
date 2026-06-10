import type { ProviderApplicationRow } from "@/lib/admin/types";
import type { createClient } from "@/lib/supabase/server";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

function categoryNameFromJoin(
  serviceCategories: { name: string } | { name: string }[] | null,
): string {
  if (!serviceCategories) return "—";
  if (Array.isArray(serviceCategories)) {
    return serviceCategories[0]?.name ?? "—";
  }
  return serviceCategories.name;
}

export async function getProviderApplicationsForAdmin(
  supabase: ServerSupabase,
): Promise<ProviderApplicationRow[]> {
  const { data, error } = await supabase
    .from("provider_applications")
    .select(
      `
      id,
      business_name,
      contact_name,
      email,
      city,
      status,
      submitted_at,
      service_categories ( name )
    `,
    )
    .order("submitted_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    business_name: row.business_name,
    contact_name: row.contact_name,
    email: row.email,
    city: row.city,
    status: row.status,
    submitted_at: row.submitted_at,
    category_name: categoryNameFromJoin(
      row.service_categories as { name: string } | { name: string }[] | null,
    ),
  }));
}
