import { ProvidersDirectory } from "@/components/providers/providers-directory";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import {
  getApprovedProviders,
  getServiceCategories,
} from "@/lib/providers/get-providers";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Providers | Huntington Select",
  description:
    "Browse vetted local contractors and service providers in the Huntington Select network.",
};

export default async function ProvidersPage() {
  const supabase = await createClient();
  const [providers, categories] = await Promise.all([
    getApprovedProviders(supabase),
    getServiceCategories(supabase),
  ]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-stone-50 text-stone-900">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-amber-800/90">
              Curated directory
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Local service providers
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
              Every listing is reviewed before it appears here. Search by name
              or city, or filter by the type of work you need.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <ProvidersDirectory providers={providers} categories={categories} />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
