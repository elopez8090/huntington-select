"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinkClass = (active: boolean) =>
  active
    ? "whitespace-nowrap border-b-2 border-amber-800 pb-3 text-sm font-medium text-stone-900"
    : "whitespace-nowrap border-b-2 border-transparent pb-3 text-sm font-medium text-stone-600 transition hover:border-stone-300 hover:text-stone-900";

export function AdminNav() {
  const pathname = usePathname();
  const isApplications = pathname.startsWith("/admin/provider-applications");
  const isOverview = pathname === "/admin" || pathname === "/admin/";

  return (
    <nav className="-mb-px flex gap-6 overflow-x-auto" aria-label="Admin">
      <Link href="/admin" className={navLinkClass(isOverview)}>
        Overview
      </Link>
      <Link
        href="/admin/provider-applications"
        className={navLinkClass(isApplications)}
      >
        Provider applications
      </Link>
    </nav>
  );
}
