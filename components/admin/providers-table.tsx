"use client";

import { FormMessage } from "@/components/auth/form-message";
import {
  ProviderFeaturedBadge,
  ProviderStatusBadge,
} from "@/components/admin/provider-badges";
import type { AdminProviderRow } from "@/lib/admin/types";
import { setProviderFeatured } from "@/lib/admin/toggle-provider-featured";
import {
  approveProviderListing,
  rejectProviderListing,
} from "@/lib/admin/update-provider-status";
import { formatCityState } from "@/lib/providers/format";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProvidersTableProps = {
  providers: AdminProviderRow[];
  emptyMessage: string;
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

type BusyAction =
  | "approve"
  | "reject"
  | "feature"
  | "unfeature"
  | null;

function busyKey(providerId: string, action: NonNullable<BusyAction>): string {
  return `${providerId}:${action}`;
}

export function ProvidersTable({
  providers,
  emptyMessage,
}: ProvidersTableProps) {
  const router = useRouter();
  const [message, setMessage] = useState<{
    text: string;
    variant: "error" | "success";
  } | null>(null);
  const [busyKeyState, setBusyKeyState] = useState<string | null>(null);

  async function runAction(
    providerId: string,
    action: NonNullable<BusyAction>,
    work: () => Promise<{ ok: boolean; error?: string }>,
    successText: string,
  ) {
    setMessage(null);
    setBusyKeyState(busyKey(providerId, action));
    const result = await work();
    setBusyKeyState(null);
    if (!result.ok) {
      setMessage({
        text: result.error ?? "Something went wrong.",
        variant: "error",
      });
      return;
    }
    setMessage({ text: successText, variant: "success" });
    router.refresh();
  }

  function isBusy(providerId: string, action: NonNullable<BusyAction>): boolean {
    return busyKeyState === busyKey(providerId, action);
  }

  if (providers.length === 0) {
    return (
      <p className="rounded-xl border border-stone-200 bg-white px-4 py-8 text-center text-sm text-stone-600">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {message ? (
        <FormMessage variant={message.variant} message={message.text} />
      ) : null}

      <div className="hidden overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 font-medium">Email</th>
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
                const canApprove = provider.status !== "approved";
                const canReject = provider.status !== "rejected";
                const anyBusy =
                  isBusy(provider.id, "approve") ||
                  isBusy(provider.id, "reject") ||
                  isBusy(provider.id, "feature") ||
                  isBusy(provider.id, "unfeature");

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
                    <td className="px-4 py-3 text-stone-700">
                      {provider.contact_name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {provider.email ? (
                        <a
                          href={`mailto:${provider.email}`}
                          className="text-amber-900 underline-offset-2 hover:underline"
                        >
                          {provider.email}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {location || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <ProviderStatusBadge status={provider.status} />
                    </td>
                    <td className="px-4 py-3">
                      <ProviderFeaturedBadge featured={provider.is_featured} />
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {formatCreatedAt(provider.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex min-w-[14rem] flex-wrap gap-2">
                        {canApprove ? (
                          <button
                            type="button"
                            disabled={anyBusy}
                            onClick={() =>
                              runAction(
                                provider.id,
                                "approve",
                                () => approveProviderListing(provider.id),
                                "Provider approved.",
                              )
                            }
                            className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isBusy(provider.id, "approve")
                              ? "Saving…"
                              : "Approve"}
                          </button>
                        ) : null}
                        {canReject ? (
                          <button
                            type="button"
                            disabled={anyBusy}
                            onClick={() =>
                              runAction(
                                provider.id,
                                "reject",
                                () => rejectProviderListing(provider.id),
                                "Provider rejected.",
                              )
                            }
                            className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isBusy(provider.id, "reject")
                              ? "Saving…"
                              : "Reject"}
                          </button>
                        ) : null}
                        {!provider.is_featured ? (
                          <button
                            type="button"
                            disabled={anyBusy}
                            onClick={() =>
                              runAction(
                                provider.id,
                                "feature",
                                () =>
                                  setProviderFeatured(provider.id, true).then(
                                    (r) =>
                                      r.ok
                                        ? r
                                        : { ok: false, error: r.error },
                                  ),
                                "Provider marked as featured.",
                              )
                            }
                            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isBusy(provider.id, "feature")
                              ? "Saving…"
                              : "Feature"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={anyBusy}
                            onClick={() =>
                              runAction(
                                provider.id,
                                "unfeature",
                                () =>
                                  setProviderFeatured(provider.id, false).then(
                                    (r) =>
                                      r.ok
                                        ? r
                                        : { ok: false, error: r.error },
                                  ),
                                "Provider removed from featured.",
                              )
                            }
                            className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isBusy(provider.id, "unfeature")
                              ? "Saving…"
                              : "Unfeature"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ul className="space-y-3 lg:hidden">
        {providers.map((provider) => {
          const location = formatCityState(provider.city, provider.state);
          const canApprove = provider.status !== "approved";
          const canReject = provider.status !== "rejected";
          const anyBusy =
            isBusy(provider.id, "approve") ||
            isBusy(provider.id, "reject") ||
            isBusy(provider.id, "feature") ||
            isBusy(provider.id, "unfeature");

          return (
            <li
              key={provider.id}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-stone-900">
                    {provider.business_name}
                  </p>
                  {provider.contact_name ? (
                    <p className="mt-0.5 text-sm text-stone-600">
                      {provider.contact_name}
                    </p>
                  ) : null}
                  {provider.email ? (
                    <a
                      href={`mailto:${provider.email}`}
                      className="mt-1 block text-sm text-amber-900 underline-offset-2 hover:underline"
                    >
                      {provider.email}
                    </a>
                  ) : null}
                  {location ? (
                    <p className="mt-1 text-xs text-stone-500">{location}</p>
                  ) : null}
                </div>
                <ProviderFeaturedBadge featured={provider.is_featured} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <ProviderStatusBadge status={provider.status} />
                <span className="text-xs text-stone-500">
                  Listed {formatCreatedAt(provider.created_at)}
                </span>
              </div>
              {provider.status === "approved" ? (
                <Link
                  href={`/providers/${provider.slug}`}
                  className="mt-3 inline-block text-sm text-amber-800 hover:underline"
                >
                  View public listing
                </Link>
              ) : null}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {canApprove ? (
                  <button
                    type="button"
                    disabled={anyBusy}
                    onClick={() =>
                      runAction(
                        provider.id,
                        "approve",
                        () => approveProviderListing(provider.id),
                        "Provider approved.",
                      )
                    }
                    className="col-span-2 rounded-lg bg-stone-900 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-1"
                  >
                    {isBusy(provider.id, "approve") ? "Saving…" : "Approve"}
                  </button>
                ) : null}
                {canReject ? (
                  <button
                    type="button"
                    disabled={anyBusy}
                    onClick={() =>
                      runAction(
                        provider.id,
                        "reject",
                        () => rejectProviderListing(provider.id),
                        "Provider rejected.",
                      )
                    }
                    className="col-span-2 rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm font-medium text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-1"
                  >
                    {isBusy(provider.id, "reject") ? "Saving…" : "Reject"}
                  </button>
                ) : null}
                {!provider.is_featured ? (
                  <button
                    type="button"
                    disabled={anyBusy}
                    onClick={() =>
                      runAction(
                        provider.id,
                        "feature",
                        () =>
                          setProviderFeatured(provider.id, true).then((r) =>
                            r.ok ? r : { ok: false, error: r.error },
                          ),
                        "Provider marked as featured.",
                      )
                    }
                    className="col-span-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isBusy(provider.id, "feature") ? "Saving…" : "Feature"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={anyBusy}
                    onClick={() =>
                      runAction(
                        provider.id,
                        "unfeature",
                        () =>
                          setProviderFeatured(provider.id, false).then((r) =>
                            r.ok ? r : { ok: false, error: r.error },
                          ),
                        "Provider removed from featured.",
                      )
                    }
                    className="col-span-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-medium text-stone-800 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isBusy(provider.id, "unfeature") ? "Saving…" : "Unfeature"}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
