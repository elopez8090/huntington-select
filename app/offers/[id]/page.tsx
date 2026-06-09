import { MemberShell } from "@/components/member/member-shell";
import {
  formatCategoryLabel,
  formatExpirationDate,
  formatExternalHref,
  offerCardSummary,
} from "@/lib/offers/format";
import { getOfferById } from "@/lib/offers/get-offers";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type OfferDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: OfferDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const offer = await getOfferById(supabase, id);
  if (!offer) {
    return { title: "Offer not found | Huntington Select" };
  }
  const summary = offerCardSummary(offer.short_description, offer.description);
  return {
    title: `${offer.title} | Huntington Select`,
    description: summary.slice(0, 160),
  };
}

export default async function OfferDetailPage({ params }: OfferDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, offer] = await Promise.all([
    supabase.from("profiles").select("email").eq("id", user.id).maybeSingle(),
    getOfferById(supabase, id),
  ]);

  if (!offer) {
    notFound();
  }

  const email = profile?.email ?? user.email ?? "";
  const websiteHref = offer.merchant_website
    ? formatExternalHref(offer.merchant_website)
    : null;

  return (
    <MemberShell email={email} activeNav="offers">
      <Link
        href="/offers"
        className="mb-6 inline-flex text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
      >
        ← Back to offers
      </Link>

      <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        {offer.image_url ? (
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-zinc-100 sm:aspect-[2.5/1]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={offer.image_url}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="border-b border-zinc-100 px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
              {formatCategoryLabel(offer.category)}
            </span>
            {offer.expiration_date ? (
              <span className="rounded-full bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200/80">
                Valid through {formatExpirationDate(offer.expiration_date)}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            {offer.title}
          </h1>

          {offer.merchant_name ? (
            <p className="mt-2 text-base font-medium text-zinc-600">
              {offer.merchant_name}
            </p>
          ) : null}

          <p className="mt-4 text-lg font-medium text-zinc-800">
            {offer.credits_required.toLocaleString()}{" "}
            <span className="text-base font-normal text-zinc-500">
              credit{offer.credits_required === 1 ? "" : "s"} required
            </span>
          </p>
        </div>

        <div className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">
          <section aria-labelledby="offer-description-heading">
            <h2
              id="offer-description-heading"
              className="text-sm font-medium text-zinc-500"
            >
              About this offer
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 sm:text-base">
              {offer.description.trim() || "No description provided."}
            </p>
          </section>

          {offer.location || websiteHref ? (
            <section
              aria-labelledby="offer-partner-heading"
              className="border-t border-zinc-100 pt-8"
            >
              <h2
                id="offer-partner-heading"
                className="text-sm font-medium text-zinc-500"
              >
                Partner details
              </h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                {offer.location ? (
                  <div>
                    <dt className="text-sm font-medium text-zinc-500">
                      Location
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap text-sm text-zinc-900">
                      {offer.location}
                    </dd>
                  </div>
                ) : null}
                {websiteHref ? (
                  <div>
                    <dt className="text-sm font-medium text-zinc-500">
                      Website
                    </dt>
                    <dd className="mt-1 text-sm">
                      <a
                        href={websiteHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 transition hover:decoration-zinc-500"
                      >
                        Visit merchant website
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>
          ) : null}

          {offer.redemption_instructions?.trim() ? (
            <section
              aria-labelledby="offer-redemption-heading"
              className="border-t border-zinc-100 pt-8"
            >
              <h2
                id="offer-redemption-heading"
                className="text-sm font-medium text-zinc-500"
              >
                How to redeem
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 sm:text-base">
                {offer.redemption_instructions.trim()}
              </p>
            </section>
          ) : null}

          {offer.terms_and_conditions?.trim() ? (
            <section
              aria-labelledby="offer-terms-heading"
              className="border-t border-zinc-100 pt-8"
            >
              <h2
                id="offer-terms-heading"
                className="text-sm font-medium text-zinc-500"
              >
                Terms &amp; conditions
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-600">
                {offer.terms_and_conditions.trim()}
              </p>
            </section>
          ) : null}
        </div>
      </article>
    </MemberShell>
  );
}
