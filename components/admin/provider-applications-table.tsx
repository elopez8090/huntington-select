"use client";

import { FormMessage } from "@/components/auth/form-message";
import type { ProviderApplicationRow } from "@/lib/admin/types";
import {
  approveProviderApplication,
  rejectProviderApplication,
} from "@/lib/admin/review-provider-application";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProviderApplicationsTableProps = {
  applications: ProviderApplicationRow[];
};

function formatSubmittedAt(iso: string): string {
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
    case "pending":
      return "bg-amber-100 text-amber-900";
    case "approved":
      return "bg-emerald-100 text-emerald-900";
    case "rejected":
      return "bg-stone-200 text-stone-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function ProviderApplicationsTable({
  applications,
}: ProviderApplicationsTableProps) {
  const router = useRouter();
  const [message, setMessage] = useState<{
    text: string;
    variant: "error" | "success";
  } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleApprove(id: string) {
    setMessage(null);
    setBusyId(id);
    const result = await approveProviderApplication(id);
    setBusyId(null);
    if (!result.ok) {
      setMessage({ text: result.error, variant: "error" });
      return;
    }
    setMessage({ text: "Application approved and listing created.", variant: "success" });
    router.refresh();
  }

  async function handleReject(id: string) {
    setMessage(null);
    setBusyId(id);
    const result = await rejectProviderApplication(id);
    setBusyId(null);
    if (!result.ok) {
      setMessage({ text: result.error, variant: "error" });
      return;
    }
    setMessage({ text: "Application rejected.", variant: "success" });
    router.refresh();
  }

  if (applications.length === 0) {
    return (
      <p className="rounded-xl border border-stone-200 bg-white px-4 py-8 text-center text-sm text-stone-600">
        No provider applications yet.
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
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {applications.map((app) => {
                const isPending = app.status === "pending";
                const isBusy = busyId === app.id;
                return (
                  <tr key={app.id} className="text-stone-800">
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {app.business_name}
                    </td>
                    <td className="px-4 py-3">{app.contact_name}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${app.email}`}
                        className="text-amber-900 underline-offset-2 hover:underline"
                      >
                        {app.email}
                      </a>
                    </td>
                    <td className="px-4 py-3">{app.category_name}</td>
                    <td className="px-4 py-3">{app.city}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(app.status)}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {formatSubmittedAt(app.submitted_at)}
                    </td>
                    <td className="px-4 py-3">
                      {isPending ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleApprove(app.id)}
                            className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-stone-800 disabled:opacity-50"
                          >
                            {isBusy ? "Working…" : "Approve"}
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleReject(app.id)}
                            className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-800 transition hover:bg-stone-50 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-stone-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ul className="space-y-4 md:hidden">
        {applications.map((app) => {
          const isPending = app.status === "pending";
          const isBusy = busyId === app.id;
          return (
            <li
              key={app.id}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-stone-900">{app.business_name}</p>
                  <p className="mt-1 text-sm text-stone-600">{app.contact_name}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(app.status)}`}
                >
                  {app.status}
                </span>
              </div>
              <dl className="mt-3 grid gap-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Email</dt>
                  <dd className="text-right text-stone-800">
                    <a
                      href={`mailto:${app.email}`}
                      className="text-amber-900 underline-offset-2 hover:underline"
                    >
                      {app.email}
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Category</dt>
                  <dd className="text-right text-stone-800">{app.category_name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">City</dt>
                  <dd className="text-right text-stone-800">{app.city}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Submitted</dt>
                  <dd className="text-right text-stone-800">
                    {formatSubmittedAt(app.submitted_at)}
                  </dd>
                </div>
              </dl>
              {isPending ? (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleApprove(app.id)}
                    className="flex-1 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:opacity-50"
                  >
                    {isBusy ? "Working…" : "Approve"}
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleReject(app.id)}
                    className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 transition hover:bg-stone-50 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
