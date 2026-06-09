import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import Link from "next/link";

export default function ProviderNotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-stone-50 text-stone-900">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-stone-900">
          Provider not found
        </h1>
        <p className="mt-3 max-w-md text-sm text-stone-600">
          This listing may have been removed or is not yet approved for the
          public directory.
        </p>
        <Link
          href="/providers"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          Browse providers
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
