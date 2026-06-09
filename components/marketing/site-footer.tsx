import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="text-base font-semibold text-stone-900">
              Huntington Select
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              A curated local service provider network for Huntington
              homeowners—and trusted pros who serve the community.
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-stone-600"
            aria-label="Footer"
          >
            <Link href="/register" className="hover:text-stone-900">
              Join
            </Link>
            <Link href="/login" className="hover:text-stone-900">
              Member Login
            </Link>
          </nav>
        </div>
        <p className="mt-10 text-xs text-stone-500">
          © {new Date().getFullYear()} Huntington Select. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
