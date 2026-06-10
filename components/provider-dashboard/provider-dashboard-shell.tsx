import { LogoutButton } from "@/components/auth/logout-button";
import Link from "next/link";
import type { ReactNode } from "react";

type ProviderDashboardShellProps = {
  email?: string;
  activeNav?: "dashboard" | "edit-listing";
  showEditListingNav?: boolean;
  children: ReactNode;
};

const navLinkClass = (active: boolean) =>
  active
    ? "border-amber-700 text-amber-950"
    : "border-transparent text-stone-600 hover:border-stone-300 hover:text-stone-900";

export function ProviderDashboardShell({
  email,
  activeNav = "dashboard",
  showEditListingNav = false,
  children,
}: ProviderDashboardShellProps) {
  return (
    <div className="min-h-full bg-gradient-to-b from-amber-50/50 to-stone-50 text-stone-900">
      <header className="border-b border-amber-100/80 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/"
                className="shrink-0 text-sm font-semibold tracking-tight text-stone-900"
              >
                Huntington Select
              </Link>
              <span className="hidden rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-950 sm:inline">
                Provider area
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              {email ? (
                <span className="truncate text-sm text-stone-600">{email}</span>
              ) : null}
              <LogoutButton tone="stone" />
            </div>
          </div>
          <nav
            className="-mb-px flex gap-6 overflow-x-auto border-t border-amber-50 pt-3 pb-0 sm:border-t-0 sm:pt-0"
            aria-label="Provider"
          >
            <Link
              href="/provider/dashboard"
              className={`border-b-2 pb-3 text-sm font-medium transition ${navLinkClass(activeNav === "dashboard")}`}
            >
              Provider Dashboard
            </Link>
            {showEditListingNav ? (
              <Link
                href="/provider/edit-listing"
                className={`border-b-2 pb-3 text-sm font-medium transition ${navLinkClass(activeNav === "edit-listing")}`}
              >
                Edit Listing
              </Link>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
