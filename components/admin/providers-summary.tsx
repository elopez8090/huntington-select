import { DashboardCard } from "@/components/dashboard/dashboard-card";
import type { AdminProviderFilter } from "@/lib/admin/admin-provider-filters";
import type { AdminProviderStats } from "@/lib/admin/types";
import Link from "next/link";

type ProvidersSummaryProps = {
  stats: AdminProviderStats;
  activeFilter: AdminProviderFilter;
  search: string;
};

function filterHref(filter: AdminProviderFilter, search: string): string {
  const params = new URLSearchParams();
  if (filter !== "all") {
    params.set("filter", filter);
  }
  if (search) {
    params.set("q", search);
  }
  const query = params.toString();
  return query ? `/admin/providers?${query}` : "/admin/providers";
}

export function ProvidersSummary({
  stats,
  activeFilter,
  search,
}: ProvidersSummaryProps) {
  const cards: {
    title: string;
    value: number;
    description: string;
    filter: AdminProviderFilter;
  }[] = [
    {
      title: "Total providers",
      value: stats.total,
      description: "All directory listings.",
      filter: "all",
    },
    {
      title: "Approved",
      value: stats.approved,
      description: "Visible when approved in the directory.",
      filter: "approved",
    },
    {
      title: "Pending",
      value: stats.pending,
      description: "Awaiting approval or review.",
      filter: "pending",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      description: "Not published in the directory.",
      filter: "rejected",
    },
    {
      title: "Featured",
      value: stats.featured,
      description: "Highlighted on the homepage and directory.",
      filter: "featured",
    },
  ];

  return (
    <section
      aria-label="Provider summary"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    >
      {cards.map((card) => {
        const isActive = activeFilter === card.filter;
        return (
          <Link
            key={card.filter}
            href={filterHref(card.filter, search)}
            className={`block rounded-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 ${
              isActive ? "ring-2 ring-amber-500/70 ring-offset-2" : ""
            }`}
          >
            <DashboardCard
              title={card.title}
              value={card.value.toLocaleString()}
              description={card.description}
            />
          </Link>
        );
      })}
    </section>
  );
}
