import { ProvidersSummary } from "@/components/admin/providers-summary";
import { ProvidersTable } from "@/components/admin/providers-table";
import { ProvidersToolbar } from "@/components/admin/providers-toolbar";
import {
  parseAdminProviderFilter,
  sanitizeAdminProviderSearch,
} from "@/lib/admin/admin-provider-filters";
import { getAdminProviderStats } from "@/lib/admin/get-admin-provider-stats";
import { getProvidersForAdmin } from "@/lib/admin/get-providers-for-admin";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Manage providers | Admin | Huntington Select",
  description: "Manage provider listings and featured status.",
};

type AdminProvidersPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminProvidersPage({
  searchParams,
}: AdminProvidersPageProps) {
  const params = await searchParams;
  const filter = parseAdminProviderFilter(params.filter);
  const search = sanitizeAdminProviderSearch(params.q);

  const supabase = await createClient();
  const [stats, providers] = await Promise.all([
    getAdminProviderStats(supabase),
    getProvidersForAdmin(supabase, { filter, search }),
  ]);

  return (
    <>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-amber-800/90">
          Admin
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
          Manage providers
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Review listings, update approval status, and choose which approved
          providers appear as featured on the homepage and directory.
        </p>
      </div>

      <div className="space-y-6">
        <ProvidersSummary
          stats={stats}
          activeFilter={filter}
          search={search}
        />
        <ProvidersToolbar activeFilter={filter} search={search} />
        <ProvidersTable
          providers={providers}
          emptyMessage={
            search || filter !== "all"
              ? "No providers match your filters. Try a different search or filter."
              : "No providers yet. Approve an application to create a listing."
          }
        />
      </div>
    </>
  );
}
