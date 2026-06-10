import { AdminNav } from "@/components/admin/admin-nav";
import Link from "next/link";
import type { ReactNode } from "react";

type AdminShellProps = {
  email: string;
  children: ReactNode;
};

export function AdminShell({ email, children }: AdminShellProps) {
  return (
    <div className="min-h-full bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between gap-4">
            <Link
              href="/"
              className="shrink-0 text-sm font-semibold tracking-tight text-stone-900"
            >
              Huntington Select
            </Link>
            <span className="truncate text-sm text-stone-600">{email}</span>
          </div>
          <AdminNav />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
