import { ProviderProfile } from "@/components/providers/provider-profile";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { providerCardSummary } from "@/lib/providers/format";
import { getApprovedProviderBySlug } from "@/lib/providers/get-providers";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProviderDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProviderDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const provider = await getApprovedProviderBySlug(supabase, slug);
  if (!provider) {
    return { title: "Provider not found | Huntington Select" };
  }
  const description = providerCardSummary(
    provider.short_description,
    provider.description,
  );
  return {
    title: `${provider.business_name} | Huntington Select`,
    description: description.slice(0, 160),
  };
}

export default async function ProviderDetailPage({
  params,
}: ProviderDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const provider = await getApprovedProviderBySlug(supabase, slug);

  if (!provider) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-stone-50 text-stone-900">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <Link
            href="/providers"
            className="mb-6 inline-flex text-sm font-medium text-stone-600 transition hover:text-stone-900"
          >
            ← Back to providers
          </Link>

          <ProviderProfile provider={provider} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
