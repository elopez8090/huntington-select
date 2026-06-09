import { MemberShell } from "@/components/member/member-shell";
import {
  formatCategoryLabel,
  formatOfferDate,
  formatOfferStatus,
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
  return {
    title: `${offer.title} | Huntington Select`,
    description: offer.description.slice(0, 160),
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

  return (
    <MemberShell email={email} activeNav="offers">
      <Link
        href="/offers"
        className="mb-6 inline-flex text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
      >
        ← Back to offers
      </Link>

      <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
              {formatCategoryLabel(offer.category)}
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              {formatOfferStatus(offer.status)}
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            {offer.title}
          </h1>
          <p className="mt-3 text-lg font-medium text-zinc-800">
            {offer.credits_required.toLocaleString()}{" "}
            <span className="text-base font-normal text-zinc-500">
              credit{offer.credits_required === 1 ? "" : "s"} required
            </span>
          </p>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
          <section aria-labelledby="offer-description-heading">
            <h2
              id="offer-description-heading"
              className="text-sm font-medium text-zinc-500"
            >
              Description
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 sm:text-base">
              {offer.description || "No description provided."}
            </p>
          </section>

          <dl className="grid gap-4 border-t border-zinc-100 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-zinc-500">Status</dt>
              <dd className="mt-1 text-sm text-zinc-900">
                {formatOfferStatus(offer.status)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-zinc-500">Created</dt>
              <dd className="mt-1 text-sm text-zinc-900">
                {formatOfferDate(offer.created_at)}
              </dd>
            </div>
          </dl>
        </div>
      </article>
    </MemberShell>
  );
}
