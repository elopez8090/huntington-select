"use client";

import { FormMessage } from "@/components/auth/form-message";
import type { AdminProviderRow } from "@/lib/admin/types";
import { toggleProviderFeatured } from "@/lib/admin/toggle-provider-featured";
import { formatCityState } from "@/lib/providers/format";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProvidersTableProps = {
  providers: AdminProviderRow[];
};

function formatCreatedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusBadgeClass(status: string): string {
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

function FeaturedBadge({ featured }: { featured: boolean }) {
  if (!featured) {
    return (
      <span className="text-xs text-stone-500">—</span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-amber-200/80">
      Featured
    </span>
  );
}

export function ProvidersTable({ providers }: ProvidersTableProps) {
  const router = useRouter();
  const [message, setMessage] = useState<{
    text: string;
    variant: "error" | "success";
  } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleToggleFeatured(id: string) {
    setMessage(null);
    setBusyId(id);
    const result = await toggleProviderFeatured(id);
    setBusyId(null);
    if (!result.ok) {
      setMessage({ text: result.error, variant: "error" });
      return;
    }
    setMessage({
      text: result.is_featured
        ? "Provider marked as featured."
        : "Provider removed from featured.",
      variant: "success",
    });
    router.refresh();
  }

  if (providers.length === 0) {
    return (
      <p className="rounded-xl border border-stone-200 bg-white px-4 py-8 text-center text-sm text-stone-600">
        No providers yet. Approve an application to create a listing.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {message ? (
        <FormMessage variant={message.variant} message={message.text} />
      ) : null}

      <div className="hidden overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Listed</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {providers.map((provider) => {
                const location = formatCityState(provider.city, provider.state);
                const isBusy = busyId === provider.id;
                return (
                  <tr key={provider.id} className="text-stone-800">
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-900">
                        {provider.business_name}
                      </div>
                      {provider.status === "approved" ? (
                        <Link
                          href={`/providers/${provider.slug}`}
                          className="mt-0.5 text-xs text-amber-800 hover:underline"
                        >
                          View public listing
                        </Link>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {location || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(provider.status)}`}
                      >
                        {provider.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <FeaturedBadge featured={provider.is_featured} />
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {formatCreatedAt(provider.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleToggleFeatured(provider.id)}
                        className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBusy
                          ? "Saving…"
                          : provider.is_featured
                            ? "Remove featured"
                            : "Mark featured"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ul className="space-y-3 md:hidden">
        {providers.map((provider) => {
          const location = formatCityState(provider.city, provider.state);
          const isBusy = busyId === provider.id;
          return (
            <li
              key={provider.id}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-stone-900">
                    {provider.business_name}
                  </p>
                  {location ? (
                    <p className="mt-0.5 text-xs text-stone-500">{location}</p>
                  ) : null}
                </div>
                <FeaturedBadge featured={provider.is_featured} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(provider.status)}`}
                >
                  {provider.status}
                </span>
              </div>
              <button
                type="button"
                disabled={isBusy}
                onClick={() => handleToggleFeatured(provider.id)}
                className="mt-4 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-medium text-stone-800 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBusy
                  ? "Saving…"
                  : provider.is_featured
                    ? "Remove featured"
                    : "Mark featured"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
