import { ProviderApplyForm } from "@/components/provider-apply/provider-apply-form";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getServiceCategories } from "@/lib/providers/get-providers";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = {
  title: "Apply as a provider | Huntington Select",
  description:
    "Apply to join the curated Huntington Select network of trusted local contractors and service providers.",
};

export default async function ProviderApplyPage() {
  const supabase = await createClient();
  const categories = await getServiceCategories(supabase);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-stone-50 text-stone-900">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-amber-800/90">
              For service providers
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Apply to join the network
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
              Huntington Select is a curated directory—not an open listing site.
              Tell us about your business. If it is a good fit, our team will
              review your application and follow up by email.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          {categories.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Applications are temporarily unavailable because service categories
              are not set up yet. Please check back soon or{" "}
              <Link href="/" className="font-medium underline-offset-2 hover:underline">
                return home
              </Link>
              .
            </div>
          ) : (
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <ProviderApplyForm categories={categories} />
            </div>
          )}

          <p className="mt-8 text-center text-sm text-stone-600">
            <Link
              href="/providers"
              className="font-medium text-stone-900 underline-offset-2 hover:underline"
            >
              Browse the provider directory
            </Link>
            {" · "}
            <Link
              href="/"
              className="font-medium text-stone-900 underline-offset-2 hover:underline"
            >
              Back to home
            </Link>
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
