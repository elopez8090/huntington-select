import {
  formatCategoryLabel,
  formatExpirationDate,
  offerCardSummary,
} from "@/lib/offers/format";
import type { OfferListItem } from "@/lib/offers/types";
import Link from "next/link";

type OfferCardProps = {
  offer: OfferListItem;
};

export function OfferCard({ offer }: OfferCardProps) {
  const summary = offerCardSummary(offer.short_description, offer.description);

  return (
    <Link
      href={`/offers/${offer.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-300 hover:shadow-md"
    >
      {offer.image_url ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={offer.image_url}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div
          className="flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-50"
          aria-hidden
        >
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Offer
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
            {formatCategoryLabel(offer.category)}
          </span>
          {offer.featured ? (
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-amber-200/80">
              Featured
            </span>
          ) : null}
          {offer.expiration_date ? (
            <span className="rounded-full bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200/80">
              Ends {formatExpirationDate(offer.expiration_date)}
            </span>
          ) : null}
        </div>

        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 group-hover:text-zinc-950">
          {offer.title}
        </h2>

        {offer.merchant_name ? (
          <p className="mt-1 text-sm font-medium text-zinc-500">
            {offer.merchant_name}
          </p>
        ) : null}

        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
          {summary}
        </p>

        <p className="mt-4 text-sm font-medium text-zinc-800">
          {offer.credits_required.toLocaleString()}{" "}
          <span className="font-normal text-zinc-500">
            credit{offer.credits_required === 1 ? "" : "s"} required
          </span>
        </p>
      </div>
    </Link>
  );
}
