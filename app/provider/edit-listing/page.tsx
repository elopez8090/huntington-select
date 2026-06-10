import { EditListingForm } from "@/components/provider-dashboard/edit-listing-form";
import { ProviderDashboardShell } from "@/components/provider-dashboard/provider-dashboard-shell";
import { getProviderListingForEdit } from "@/lib/provider-dashboard/get-provider-listing-for-edit";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Edit listing | Huntington Select",
  description: "Update your Huntington Select provider directory listing.",
};

export default async function ProviderEditListingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "";
  const listing = email
    ? await getProviderListingForEdit(supabase, email)
    : null;

  if (!listing) {
    redirect("/provider/dashboard");
  }

  return (
    <ProviderDashboardShell
      email={email}
      activeNav="edit-listing"
      showEditListingNav
    >
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-amber-800/90">
          Provider
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
          Edit your listing
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Update the details customers see on your directory profile. Status,
          categories, and photos are managed separately.
        </p>
        <p className="mt-4">
          <Link
            href="/provider/dashboard"
            className="text-sm font-medium text-stone-900 underline-offset-2 hover:underline"
          >
            Back to Provider Dashboard
          </Link>
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white px-5 py-6 shadow-sm sm:px-8 sm:py-8">
        <EditListingForm listing={listing} />
      </div>
    </ProviderDashboardShell>
  );
}
