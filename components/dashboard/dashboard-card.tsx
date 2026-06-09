import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  value: ReactNode;
  description?: string;
};

export function DashboardCard({ title, value, description }: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-sm font-medium text-zinc-500">{title}</p>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
        {value}
      </div>
      {description ? (
        <p className="mt-2 text-sm text-zinc-600">{description}</p>
      ) : null}
    </div>
  );
}
