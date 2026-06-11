import { formatCityState } from "@/lib/providers/format";
import type { ProviderListItem } from "@/lib/providers/types";
import Link from "next/link";

type ProviderCardProps = {
  provider: ProviderListItem;
};

export function ProviderCard({ provider }: ProviderCardProps) {
  const location = formatCityState(provider.city, provider.state);

  return (
    <Link
      href={`/providers/${provider.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:border-amber-600/30 hover:shadow-md"
    >
      <div className="flex items-start gap-4 p-5 sm:p-6">
        {provider.logo_url ? (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-stone-100 bg-stone-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={provider.logo_url}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-stone-100 to-stone-50 text-xs font-semibold uppercase tracking-wider text-stone-400"
            aria-hidden
          >
            {provider.business_name.slice(0, 2)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-stone-900 group-hover:text-stone-950">
              {provider.business_name}
            </h2>
            {provider.is_featured ? (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-amber-200/80">
                Featured
              </span>
            ) : null}
          </div>
          {location ? (
            <p className="mt-1 text-sm text-stone-500">{location}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col border-t border-stone-100 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
        {provider.short_description ? (
          <p className="flex-1 text-sm leading-relaxed text-stone-600">
            {provider.short_description}
          </p>
        ) : null}

        {provider.categories.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {provider.categories.map((cat) => (
              <li key={cat.id}>
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700">
                  {cat.name}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Link>
  );
}
