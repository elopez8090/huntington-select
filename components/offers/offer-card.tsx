import {
  formatCategoryLabel,
  shortDescription,
} from "@/lib/offers/format";
import type { OfferListItem } from "@/lib/offers/types";
import Link from "next/link";

type OfferCardProps = {
  offer: OfferListItem;
};

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <Link
      href={`/offers/${offer.id}`}
      className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md sm:p-6"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
          {formatCategoryLabel(offer.category)}
        </span>
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 group-hover:text-zinc-950">
        {offer.title}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
        {shortDescription(offer.description)}
      </p>
      <p className="mt-4 text-sm font-medium text-zinc-800">
        {offer.credits_required.toLocaleString()}{" "}
        <span className="font-normal text-zinc-500">
          credit{offer.credits_required === 1 ? "" : "s"} required
        </span>
      </p>
    </Link>
  );
}
