import { formatCityState } from "@/lib/providers/format";
import { formatExternalHref } from "@/lib/offers/format";
import type { ProviderDashboardListing } from "@/lib/provider-dashboard/types";

type ProviderListingSummaryProps = {
  listing: ProviderDashboardListing;
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
    case "archived":
      return "bg-stone-200 text-stone-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function formatStatusLabel(status: string): string {
  return status.replace(/_/g, " ");
}

export function ProviderListingSummary({ listing }: ProviderListingSummaryProps) {
  const location = formatCityState(listing.city, listing.state);
  const websiteHref = listing.website
    ? formatExternalHref(listing.website)
    : null;
  const websiteLabel = listing.website?.trim() || null;

  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-100 px-5 py-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
              {listing.business_name}
            </h2>
            {location ? (
              <p className="mt-1 text-sm font-medium text-stone-500">{location}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${providerStatusBadgeClass(listing.status)}`}
            >
              {formatStatusLabel(listing.status)}
            </span>
            {listing.featured ? (
              <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-amber-200/80">
                Featured
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                Not featured
              </span>
            )}
          </div>
        </div>
      </div>

      <dl className="divide-y divide-stone-100 px-5 sm:px-8">
        {listing.phone ? (
          <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-stone-500">Phone</dt>
            <dd className="text-sm text-stone-900 sm:col-span-2">
              <a
                href={`tel:${listing.phone.replace(/\s/g, "")}`}
                className="font-medium text-stone-900 underline-offset-2 hover:underline"
              >
                {listing.phone}
              </a>
            </dd>
          </div>
        ) : null}

        {listing.email ? (
          <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-stone-500">Email</dt>
            <dd className="break-all text-sm text-stone-900 sm:col-span-2">
              <a
                href={`mailto:${listing.email}`}
                className="font-medium text-stone-900 underline-offset-2 hover:underline"
              >
                {listing.email}
              </a>
            </dd>
          </div>
        ) : null}

        {websiteLabel && websiteHref ? (
          <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-stone-500">Website</dt>
            <dd className="break-all text-sm sm:col-span-2">
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-stone-900 underline-offset-2 hover:underline"
              >
                {websiteLabel}
              </a>
            </dd>
          </div>
        ) : null}

        {listing.short_description?.trim() ? (
          <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-stone-500">Short description</dt>
            <dd className="text-sm leading-relaxed text-stone-700 sm:col-span-2">
              {listing.short_description.trim()}
            </dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}
