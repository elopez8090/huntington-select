import type { AdminProviderFilter } from "@/lib/admin/admin-provider-filters";
import { sanitizeAdminProviderSearch } from "@/lib/admin/admin-provider-filters";
import type { createClient } from "@/lib/supabase/server";
import type { AdminProviderRow } from "@/lib/admin/types";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

export type GetProvidersForAdminOptions = {
  filter?: AdminProviderFilter;
  search?: string;
};

const PROVIDER_SELECT =
  "id, business_name, email, slug, city, state, status, is_featured, created_at";

type ProviderIdRow = { id: string };

function applyListFilter<
  Q extends {
    eq: (column: string, value: string | boolean) => Q;
  },
>(query: Q, filter: AdminProviderFilter): Q {
  switch (filter) {
    case "approved":
      return query.eq("status", "approved");
    case "pending":
      return query.eq("status", "pending");
    case "rejected":
      return query.eq("status", "rejected");
    case "featured":
      return query.eq("is_featured", true);
    default:
      return query;
  }
}

async function providerIdsMatchingSearch(
  supabase: ServerSupabase,
  filter: AdminProviderFilter,
  search: string,
): Promise<string[]> {
  const pattern = `%${search}%`;
  const ids = new Set<string>();

  const baseIdQuery = () => {
    const q = supabase.from("providers").select("id");
    return applyListFilter(q, filter);
  };

  const { data: contactApps } = await supabase
    .from("provider_applications")
    .select("email")
    .ilike("contact_name", pattern);

  const contactEmails = [
    ...new Set((contactApps ?? []).map((row) => row.email).filter(Boolean)),
  ];

  const [byBusiness, byEmail, byContactEmail] = await Promise.all([
    baseIdQuery().ilike("business_name", pattern),
    baseIdQuery().ilike("email", pattern),
    contactEmails.length > 0
      ? baseIdQuery().in("email", contactEmails)
      : Promise.resolve({ data: [] as ProviderIdRow[], error: null }),
  ]);

  if (byBusiness.error) throw new Error(byBusiness.error.message);
  if (byEmail.error) throw new Error(byEmail.error.message);
  if (byContactEmail.error) throw new Error(byContactEmail.error.message);

  for (const row of byBusiness.data ?? []) ids.add(row.id);
  for (const row of byEmail.data ?? []) ids.add(row.id);
  for (const row of byContactEmail.data ?? []) ids.add(row.id);

  return [...ids];
}

async function attachContactNames(
  supabase: ServerSupabase,
  rows: Omit<AdminProviderRow, "contact_name">[],
): Promise<AdminProviderRow[]> {
  const emails = [
    ...new Set(rows.map((row) => row.email).filter((e): e is string => !!e)),
  ];

  if (emails.length === 0) {
    return rows.map((row) => ({ ...row, contact_name: null }));
  }

  const { data: applications, error } = await supabase
    .from("provider_applications")
    .select("email, contact_name, submitted_at")
    .in("email", emails)
    .order("submitted_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const contactByEmail = new Map<string, string>();
  for (const app of applications ?? []) {
    if (!contactByEmail.has(app.email)) {
      contactByEmail.set(app.email, app.contact_name);
    }
  }

  return rows.map((row) => ({
    ...row,
    contact_name: row.email ? (contactByEmail.get(row.email) ?? null) : null,
  }));
}

function mapProviderRow(row: {
  id: string;
  business_name: string;
  email: string | null;
  slug: string;
  city: string | null;
  state: string | null;
  status: string;
  is_featured: boolean;
  created_at: string;
}): Omit<AdminProviderRow, "contact_name"> {
  return {
    id: row.id,
    business_name: row.business_name,
    email: row.email,
    slug: row.slug,
    city: row.city,
    state: row.state,
    status: row.status,
    is_featured: row.is_featured,
    created_at: row.created_at,
  };
}

export async function getProvidersForAdmin(
  supabase: ServerSupabase,
  options: GetProvidersForAdminOptions = {},
): Promise<AdminProviderRow[]> {
  const filter = options.filter ?? "all";
  const search = sanitizeAdminProviderSearch(options.search);

  if (search) {
    const matchingIds = await providerIdsMatchingSearch(
      supabase,
      filter,
      search,
    );
    if (matchingIds.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from("providers")
      .select(PROVIDER_SELECT)
      .in("id", matchingIds)
      .order("is_featured", { ascending: false })
      .order("business_name", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const rows = (data ?? []).map(mapProviderRow);
    return attachContactNames(supabase, rows);
  }

  let query = supabase.from("providers").select(PROVIDER_SELECT);
  query = applyListFilter(query, filter);

  const { data, error } = await query
    .order("is_featured", { ascending: false })
    .order("business_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []).map(mapProviderRow);
  return attachContactNames(supabase, rows);
}
