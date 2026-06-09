import { MemberShell } from "@/components/member/member-shell";
import Link from "next/link";

export default function OfferNotFound() {
  return (
    <MemberShell>
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-12 text-center">
        <h1 className="text-lg font-semibold text-zinc-900">Offer not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600">
          This offer may be unavailable or you may not have access to view it.
        </p>
        <Link
          href="/offers"
          className="mt-6 inline-flex text-sm font-medium text-zinc-900 underline-offset-4 hover:underline"
        >
          Back to offers
        </Link>
      </div>
    </MemberShell>
  );
}
