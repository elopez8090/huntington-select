import { ProvidersTable } from "@/components/admin/providers-table";
import { getProvidersForAdmin } from "@/lib/admin/get-providers-for-admin";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Manage providers | Admin | Huntington Select",
  description: "Manage provider listings and featured status.",
};

export default async function AdminProvidersPage() {
  const supabase = await createClient();
  const providers = await getProvidersForAdmin(supabase);

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
          View directory listings and choose which approved providers appear as
          featured on the homepage and directory.
        </p>
      </div>

      <ProvidersTable providers={providers} />
    </>
  );
}
