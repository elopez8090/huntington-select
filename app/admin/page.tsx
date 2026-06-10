import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { getAdminDashboardStats } from "@/lib/admin/get-admin-dashboard-stats";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = {
  title: "Admin | Huntington Select",
  description: "Huntington Select admin dashboard.",
};

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const stats = await getAdminDashboardStats(supabase);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-amber-800/90">
            Admin
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Review applications and keep the provider directory up to date.
          </p>
        </div>
        <Link
          href="/admin/provider-applications"
          className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
        >
          Review applications
          {stats.pendingApplications > 0 ? (
            <span className="ml-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
              {stats.pendingApplications}
            </span>
          ) : null}
        </Link>
      </div>

      <section
        aria-label="Directory overview"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <DashboardCard
          title="Total providers"
          value={stats.totalProviders.toLocaleString()}
          description="All provider records in the directory."
        />
        <DashboardCard
          title="Pending applications"
          value={stats.pendingApplications.toLocaleString()}
          description="Waiting for your review."
        />
        <DashboardCard
          title="Approved providers"
          value={stats.approvedProviders.toLocaleString()}
          description="Published in the public directory."
        />
        <DashboardCard
          title="Categories"
          value={stats.categoryCount.toLocaleString()}
          description="Service categories for filtering."
        />
      </section>
    </>
  );
}
