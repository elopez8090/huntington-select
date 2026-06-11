import { ProviderCard } from "@/components/providers/provider-card";
import type { ProviderListItem } from "@/lib/providers/types";
import Link from "next/link";

type FeaturedProvidersSectionProps = {
  providers: ProviderListItem[];
};

export function FeaturedProvidersSection({
  providers,
}: FeaturedProvidersSectionProps) {
  if (providers.length === 0) {
    return null;
  }

  return (
    <section
      id="featured-providers"
      className="scroll-mt-20 border-b border-stone-200 bg-amber-50/40 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-amber-800/90">
            Spotlight
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Featured providers
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
            Hand-picked local pros we are proud to highlight for Huntington
            homeowners.
          </p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <li key={provider.id}>
              <ProviderCard provider={provider} />
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Link
            href="/providers"
            className="inline-flex h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-6 text-sm font-semibold text-stone-900 transition-colors hover:border-stone-400 hover:bg-stone-50"
          >
            View full directory
          </Link>
        </div>
      </div>
    </section>
  );
}
