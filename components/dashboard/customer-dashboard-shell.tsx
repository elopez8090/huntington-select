import { LogoutButton } from "@/components/auth/logout-button";
import Link from "next/link";
import type { ReactNode } from "react";

type CustomerDashboardShellProps = {
  email?: string;
  activeNav?: "dashboard";
  children: ReactNode;
};

const navLinkClass = (active: boolean) =>
  active
    ? "border-sky-600 text-sky-900"
    : "border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900";

export function CustomerDashboardShell({
  email,
  activeNav = "dashboard",
  children,
}: CustomerDashboardShellProps) {
  return (
    <div className="min-h-full bg-gradient-to-b from-sky-50/80 to-zinc-50">
      <header className="border-b border-sky-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/"
                className="shrink-0 text-sm font-semibold tracking-tight text-zinc-900"
              >
                Huntington Select
              </Link>
              <span className="hidden rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-900 sm:inline">
                Customer area
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              {email ? (
                <span className="truncate text-sm text-zinc-600">{email}</span>
              ) : null}
              <LogoutButton tone="zinc" />
            </div>
          </div>
          <nav
            className="-mb-px flex gap-6 overflow-x-auto border-t border-sky-50 pt-3 pb-0 sm:border-t-0 sm:pt-0"
            aria-label="Customer"
          >
            <Link
              href="/dashboard"
              className={`border-b-2 pb-3 text-sm font-medium transition ${navLinkClass(activeNav === "dashboard")}`}
            >
              Customer Dashboard
            </Link>
            <Link
              href="/providers"
              className={`border-b-2 pb-3 text-sm font-medium transition ${navLinkClass(false)}`}
            >
              Browse Providers
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
