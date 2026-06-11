"use client";

import { ProviderCard } from "@/components/providers/provider-card";
import type { ProviderListItem, ServiceCategory } from "@/lib/providers/types";
import { useMemo, useState } from "react";

type ProvidersDirectoryProps = {
  providers: ProviderListItem[];
  categories: ServiceCategory[];
};

export function ProvidersDirectory({
  providers,
  categories,
}: ProvidersDirectoryProps) {
  const [search, setSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState<string>("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return providers.filter((provider) => {
      if (categorySlug !== "all") {
        const hasCategory = provider.categories.some(
          (cat) => cat.slug === categorySlug,
        );
        if (!hasCategory) return false;
      }
      if (!query) return true;
      const haystack = [
        provider.business_name,
        provider.short_description ?? "",
        provider.city ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [providers, search, categorySlug]);

  const sortedFiltered = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.is_featured !== b.is_featured) {
        return a.is_featured ? -1 : 1;
      }
      return a.business_name.localeCompare(b.business_name);
    });
  }, [filtered]);

  if (providers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-200 bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-stone-800">
          No providers listed yet
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-stone-600">
          Approved local pros will appear here as Huntington Select grows the
          curated network.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:max-w-md">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Search</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Business name, description, or city…"
              className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 shadow-sm outline-none placeholder:text-stone-400 focus:border-amber-600/40 focus:ring-2 focus:ring-amber-600/15"
            />
          </label>
        </div>
        {categories.length > 0 ? (
          <div className="sm:w-56">
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Category</span>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 shadow-sm outline-none focus:border-amber-600/40 focus:ring-2 focus:ring-amber-600/15"
              >
                <option value="all">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-stone-800">No matches</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-stone-600">
            Try a different search term or choose another category to browse
            more providers.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedFiltered.map((provider) => (
            <li key={provider.id}>
              <ProviderCard provider={provider} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
