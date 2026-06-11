"use client";

import {
  ADMIN_PROVIDER_FILTERS,
  type AdminProviderFilter,
} from "@/lib/admin/admin-provider-filters";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

type ProvidersToolbarProps = {
  activeFilter: AdminProviderFilter;
  search: string;
};

function buildProvidersUrl(filter: AdminProviderFilter, q: string): string {
  const params = new URLSearchParams();
  if (filter !== "all") {
    params.set("filter", filter);
  }
  if (q.trim()) {
    params.set("q", q.trim());
  }
  const query = params.toString();
  return query ? `/admin/providers?${query}` : "/admin/providers";
}

export function ProvidersToolbar({
  activeFilter,
  search,
}: ProvidersToolbarProps) {
  const router = useRouter();
  const searchId = useId();
  const [query, setQuery] = useState(search);

  useEffect(() => {
    setQuery(search);
  }, [search]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(buildProvidersUrl(activeFilter, query));
  }

  return (
    <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-stone-700">Filter listings</p>
        <form
          onSubmit={handleSearchSubmit}
          className="flex w-full flex-col gap-2 sm:max-w-md sm:flex-row"
        >
          <label htmlFor={searchId} className="sr-only">
            Search providers
          </label>
          <input
            id={searchId}
            name="q"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, business, or email"
            className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
          <button
            type="submit"
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Search
          </button>
        </form>
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Provider status filters"
      >
        {ADMIN_PROVIDER_FILTERS.map((item) => {
          const isActive = item.value === activeFilter;
          return (
            <Link
              key={item.value}
              href={buildProvidersUrl(item.value, search)}
              role="tab"
              aria-selected={isActive}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 ${
                isActive
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
