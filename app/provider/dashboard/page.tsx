import { DashboardActionCard } from "@/components/dashboard/dashboard-action-card";
import { ProviderDashboardShell } from "@/components/provider-dashboard/provider-dashboard-shell";
import { ProviderListingSummary } from "@/components/provider-dashboard/provider-listing-summary";
import { userHasProviderListing } from "@/lib/auth/user-has-provider-listing";
import { getProviderListingByEmail } from "@/lib/provider-dashboard/get-provider-listing-by-email";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Provider Dashboard | Huntington Select",
  description: "Manage your Huntington Select listing, profile, and provider visibility.",
};

function providerStatusBadgeClass(status: string): string {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-900";
    case "pending":
      return "bg-amber-100 text-amber-900";
    case "draft":
      return "bg-stone-100 text-stone-700";
    case "rejected":
      return "bg-red-100 text-red-900";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export default async function ProviderDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "";
  if (!email || !(await userHasProviderListing(supabase, email))) {
    redirect("/dashboard");
  }

  const listing = await getProviderListingByEmail(supabase, email);

  return (
    <ProviderDashboardShell
      email={email}
      activeNav="dashboard"
      showEditListingNav={Boolean(listing)}
    >
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-amber-800/90">
          Provider
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
          Provider Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
          Manage your Huntington Select listing, profile, and provider visibility.
        </p>
      </div>

      <section
        aria-label="Provider shortcuts"
        className="mb-10 grid gap-4 sm:grid-cols-2"
      >
        <DashboardActionCard
          variant="provider"
          title="Edit Listing"
          description="Update business details, contact info, and descriptions customers see."
          href="/provider/edit-listing"
        />
        <DashboardActionCard
          variant="provider"
          title="Logo / Branding"
          description="Upload or refresh your logo on the edit listing page."
          href="/provider/edit-listing"
        />
        <DashboardActionCard
          variant="provider"
          title="Profile Status"
          description="Directory review status for your listing."
          footer={
            listing ? (
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${providerStatusBadgeClass(listing.status)}`}
              >
                {listing.status.replace(/_/g, " ")}
              </span>
            ) : (
              <span className="text-sm text-stone-600">Status unavailable</span>
            )
          }
        />
        <DashboardActionCard
          variant="provider"
          title="Requests / Leads"
          description="See customer inquiries when lead routing launches."
          comingSoon
        />
      </section>

      {listing ? (
        <section aria-labelledby="listing-summary-heading">
          <h2
            id="listing-summary-heading"
            className="mb-4 text-lg font-semibold text-stone-900"
          >
            Listing preview
          </h2>
          <ProviderListingSummary listing={listing} />
        </section>
      ) : null}

      <p className="mt-8 text-center text-sm text-stone-600">
        <Link
          href="/providers"
          className="font-medium text-stone-900 underline-offset-2 hover:underline"
        >
          View public directory
        </Link>
      </p>
    </ProviderDashboardShell>
  );
}
