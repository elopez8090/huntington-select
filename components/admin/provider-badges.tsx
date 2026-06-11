export function ProviderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${statusBadgeClass(status)}`}
    >
      {status}
    </span>
  );
}

export function ProviderFeaturedBadge({ featured }: { featured: boolean }) {
  if (!featured) {
    return (
      <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600 ring-1 ring-stone-200/80">
        Not featured
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-950 ring-1 ring-amber-300/80">
      Featured
    </span>
  );
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-900 ring-emerald-200/80";
    case "pending":
      return "bg-amber-50 text-amber-950 ring-amber-200/80";
    case "draft":
      return "bg-stone-100 text-stone-700 ring-stone-200/80";
    case "rejected":
      return "bg-red-50 text-red-900 ring-red-200/80";
    case "archived":
      return "bg-stone-200 text-stone-800 ring-stone-300/80";
    default:
      return "bg-stone-100 text-stone-700 ring-stone-200/80";
  }
}
