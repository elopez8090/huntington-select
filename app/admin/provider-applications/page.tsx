import { ProviderApplicationsTable } from "@/components/admin/provider-applications-table";
import { getProviderApplicationsForAdmin } from "@/lib/admin/get-provider-applications";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Provider applications | Admin | Huntington Select",
  description: "Review provider applications for Huntington Select.",
};

export default async function AdminProviderApplicationsPage() {
  const supabase = await createClient();
  const applications = await getProviderApplicationsForAdmin(supabase);

  return (
    <>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-amber-800/90">
          Admin
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
          Provider applications
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Approve to create a directory listing, or reject to close the request.
        </p>
      </div>

      <ProviderApplicationsTable applications={applications} />
    </>
  );
}
