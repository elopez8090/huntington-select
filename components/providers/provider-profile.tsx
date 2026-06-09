import {
  formatCityState,
  formatFullAddress,
  providerCardSummary,
} from "@/lib/providers/format";
import { formatExternalHref } from "@/lib/offers/format";
import type { ProviderDetail } from "@/lib/providers/types";

type ProviderProfileProps = {
  provider: ProviderDetail;
};

export function ProviderProfile({ provider }: ProviderProfileProps) {
  const location = formatCityState(provider.city, provider.state);
  const fullAddress = formatFullAddress(
    provider.address,
    provider.city,
    provider.state,
    provider.zip_code,
  );
  const websiteHref = provider.website
    ? formatExternalHref(provider.website)
    : null;
  const summary = providerCardSummary(
    provider.short_description,
    provider.description,
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      {provider.cover_image_url ? (
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-stone-100 sm:aspect-[2.5/1]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={provider.cover_image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <div className="border-b border-stone-100 px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {provider.logo_url ? (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-stone-100 bg-stone-50 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={provider.logo_url}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                {provider.business_name}
              </h1>
              {provider.featured ? (
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-amber-200/80">
                  Featured
                </span>
              ) : null}
            </div>
            {location ? (
              <p className="mt-2 text-sm font-medium text-stone-500">
                {location}
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
        </div>
      </div>

      <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1fr_minmax(0,280px)]">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
            About
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-stone-700">
            {provider.description.trim() ? provider.description : summary}
          </p>
        </div>

        <aside className="rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
            Contact
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {provider.phone ? (
              <li>
                <span className="block text-xs font-medium text-stone-500">
                  Phone
                </span>
                <a
                  href={`tel:${provider.phone.replace(/\s/g, "")}`}
                  className="font-medium text-stone-900 underline-offset-2 hover:underline"
                >
                  {provider.phone}
                </a>
              </li>
            ) : null}
            {provider.email ? (
              <li>
                <span className="block text-xs font-medium text-stone-500">
                  Email
                </span>
                <a
                  href={`mailto:${provider.email}`}
                  className="break-all font-medium text-stone-900 underline-offset-2 hover:underline"
                >
                  {provider.email}
                </a>
              </li>
            ) : null}
            {websiteHref ? (
              <li>
                <span className="block text-xs font-medium text-stone-500">
                  Website
                </span>
                <a
                  href={websiteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all font-medium text-amber-800 underline-offset-2 hover:underline"
                >
                  {provider.website?.trim()}
                </a>
              </li>
            ) : null}
            {fullAddress ? (
              <li>
                <span className="block text-xs font-medium text-stone-500">
                  Address
                </span>
                <p className="font-medium text-stone-900">{fullAddress}</p>
              </li>
            ) : null}
          </ul>
          {!provider.phone &&
          !provider.email &&
          !websiteHref &&
          !fullAddress ? (
            <p className="mt-4 text-sm text-stone-600">
              Contact details will be added soon.
            </p>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
