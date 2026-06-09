import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { RecentRedemptions } from "@/components/dashboard/recent-redemptions";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard | Huntington Select",
  description: "Your Huntington Select member dashboard.",
};

function welcomeName(email: string): string {
  const local = email.split("@")[0]?.trim();
  if (!local) return "there";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dashboard = await getDashboardData(supabase, user.id, user.email ?? "");

  return (
    <div className="min-h-full bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="shrink-0 text-sm font-semibold tracking-tight text-zinc-900"
          >
            Huntington Select
          </Link>
          <span className="truncate text-sm text-zinc-600">{dashboard.email}</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Welcome back, {welcomeName(dashboard.email)}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Signed in as{" "}
            <span className="font-medium text-zinc-800">{dashboard.email}</span>
          </p>
        </div>

        <section
          aria-label="Account overview"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <DashboardCard
            title="Available Credits"
            value={dashboard.creditBalance.toLocaleString()}
            description={
              dashboard.creditBalance === 0
                ? "You have no credits yet. Purchases and grants will show here."
                : "Credits ready to use on member offers."
            }
          />
          <DashboardCard
            title="Total Redemptions"
            value={dashboard.totalRedemptions.toLocaleString()}
            description={
              dashboard.totalRedemptions === 0
                ? "You have not redeemed any offers yet."
                : "Offers you have redeemed with credits."
            }
          />
          <DashboardCard
            title="Active Offers"
            value={dashboard.activeOffersCount.toLocaleString()}
            description={
              dashboard.activeOffersCount === 0
                ? "No offers are available right now. Check back soon."
                : "Offers you can browse when the catalog launches."
            }
          />
        </section>

        <section className="mt-10" aria-labelledby="recent-redemptions-heading">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="recent-redemptions-heading"
                className="text-lg font-semibold text-zinc-900"
              >
                Recent redemption history
              </h2>
              <p className="text-sm text-zinc-600">Your latest 5 redemptions</p>
            </div>
          </div>
          <RecentRedemptions redemptions={dashboard.recentRedemptions} />
        </section>
      </main>
    </div>
  );
}
