import { MemberShell } from "@/components/member/member-shell";
import { OffersDirectory } from "@/components/offers/offers-directory";
import { getActiveOffers } from "@/lib/offers/get-offers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Offers | Huntington Select",
  description: "Browse active member offers and credit costs.",
};

export default async function OffersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user.id)
    .maybeSingle();

  const email = profile?.email ?? user.email ?? "";
  const offers = await getActiveOffers(supabase);

  return (
    <MemberShell email={email} activeNav="offers">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Offers
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Browse active benefits you can redeem with your credits.
        </p>
      </div>

      <OffersDirectory offers={offers} />
    </MemberShell>
  );
}
