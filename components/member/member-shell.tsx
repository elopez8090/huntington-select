import Link from "next/link";
import type { ReactNode } from "react";

type MemberShellProps = {
  email?: string;
  activeNav?: "dashboard" | "offers";
  children: ReactNode;
};

const navLinkClass = (active: boolean) =>
  active
    ? "text-sm font-medium text-zinc-900"
    : "text-sm font-medium text-zinc-600 transition hover:text-zinc-900";

export function MemberShell({ email, activeNav, children }: MemberShellProps) {
  return (
    <div className="min-h-full bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between gap-4">
            <Link
              href="/"
              className="shrink-0 text-sm font-semibold tracking-tight text-zinc-900"
            >
              Huntington Select
            </Link>
            {email ? (
              <span className="hidden truncate text-sm text-zinc-600 sm:inline">
                {email}
              </span>
            ) : null}
          </div>
          <nav
            className="-mb-px flex gap-6 overflow-x-auto border-t border-zinc-100 pt-3 pb-0 sm:border-t-0 sm:pt-0"
            aria-label="Member"
          >
            <Link href="/dashboard" className={navLinkClass(activeNav === "dashboard")}>
              Customer Dashboard
            </Link>
            <Link href="/offers" className={navLinkClass(activeNav === "offers")}>
              Offers
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
