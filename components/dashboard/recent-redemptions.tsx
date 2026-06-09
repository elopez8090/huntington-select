import type { DashboardRedemption } from "@/lib/dashboard/get-dashboard-data";

type RecentRedemptionsProps = {
  redemptions: DashboardRedemption[];
};

function formatRedemptionDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function RecentRedemptions({ redemptions }: RecentRedemptionsProps) {
  if (redemptions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-10 text-center">
        <p className="text-sm font-medium text-zinc-800">No redemptions yet</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600">
          When you redeem an offer with your credits, your latest activity will
          appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      {redemptions.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-900">
              {item.offerTitle}
            </p>
            <p className="text-xs text-zinc-500">
              {formatRedemptionDate(item.created_at)}
            </p>
          </div>
          <p className="shrink-0 text-sm font-medium text-zinc-700">
            −{item.credits_used}{" "}
            <span className="font-normal text-zinc-500">
              credit{item.credits_used === 1 ? "" : "s"}
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
}
