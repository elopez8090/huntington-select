import { DashboardActionCard } from "@/components/dashboard/dashboard-action-card";
import { CustomerDashboardShell } from "@/components/dashboard/customer-dashboard-shell";
import { userHasProviderListing } from "@/lib/auth/user-has-provider-listing";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Customer Dashboard | Huntington Select",
  description: "Find trusted local providers and manage your Huntington Select account.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "";
  if (email && (await userHasProviderListing(supabase, email))) {
    redirect("/provider/dashboard");
  }

  return (
    <CustomerDashboardShell email={email} activeNav="dashboard">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-sky-800/90">
          Customer
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Customer Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Find trusted local providers and manage your saved providers or future
          requests.
        </p>
      </div>

      <section
        aria-label="Customer shortcuts"
        className="grid gap-4 sm:grid-cols-2"
      >
        <DashboardActionCard
          variant="customer"
          title="Browse Providers"
          description="Explore vetted Huntington Select providers by category and location."
          href="/providers"
        />
        <DashboardActionCard
          variant="customer"
          title="Saved Providers"
          description="Keep a shortlist of providers you want to contact later."
          comingSoon
        />
        <DashboardActionCard
          variant="customer"
          title="Request a Quote"
          description="Send a service request to providers from your account."
          comingSoon
        />
        <DashboardActionCard
          variant="customer"
          title="Account Details"
          description="Your sign-in email and membership settings for this customer account."
          footer={
            <p className="text-sm text-zinc-800">
              Signed in as{" "}
              <span className="font-medium text-zinc-900">{email || "—"}</span>
            </p>
          }
        />
      </section>
    </CustomerDashboardShell>
  );
}
