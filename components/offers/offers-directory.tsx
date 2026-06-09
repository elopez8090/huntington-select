"use client";

import { OfferCard } from "@/components/offers/offer-card";
import { formatCategoryLabel } from "@/lib/offers/format";
import type { OfferListItem } from "@/lib/offers/types";
import { useMemo, useState } from "react";

type OffersDirectoryProps = {
  offers: OfferListItem[];
};

export function OffersDirectory({ offers }: OffersDirectoryProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set(offers.map((o) => o.category));
    return Array.from(set).sort((a, b) =>
      formatCategoryLabel(a).localeCompare(formatCategoryLabel(b)),
    );
  }, [offers]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return offers.filter((offer) => {
      if (category !== "all" && offer.category !== category) return false;
      if (!query) return true;
      return offer.title.toLowerCase().includes(query);
    });
  }, [offers, search, category]);

  if (offers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-12 text-center">
        <p className="text-sm font-medium text-zinc-800">No offers available</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600">
          There are no active offers in the catalog right now. Check back soon or
          visit your dashboard for updates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:max-w-md">
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Search by title</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search offers…"
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-zinc-900/10 placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-2"
            />
          </label>
        </div>
        <div className="sm:w-48">
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/10"
            >
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {formatCategoryLabel(cat)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-12 text-center">
          <p className="text-sm font-medium text-zinc-800">No search results</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600">
            Try a different title or clear the category filter to see more offers.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((offer) => (
            <li key={offer.id}>
              <OfferCard offer={offer} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
