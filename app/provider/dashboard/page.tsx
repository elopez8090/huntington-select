import { LogoutButton } from "@/components/auth/logout-button";
import { ProviderListingSummary } from "@/components/provider-dashboard/provider-listing-summary";
import { getProviderListingByEmail } from "@/lib/provider-dashboard/get-provider-listing-by-email";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Provider dashboard | Huntington Select",
  description: "View your Huntington Select provider listing.",
};

export default async function ProviderDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "";
  const listing = email
    ? await getProviderListingByEmail(supabase, email)
    : null;

  return (
    <div className="min-h-full bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="shrink-0 text-sm font-semibold tracking-tight text-stone-900"
          >
            Huntington Select
          </Link>
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {email ? (
              <span className="truncate text-sm text-stone-600">{email}</span>
            ) : null}
            <LogoutButton tone="stone" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-amber-800/90">
            Provider
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Your dashboard
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            This is where you can see your directory listing once it is linked to
            your account.
          </p>
        </div>

        {listing ? (
          <ProviderListingSummary listing={listing} />
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-white px-5 py-8 text-center shadow-sm sm:px-8">
            <h2 className="text-lg font-semibold text-stone-900">
              No listing linked yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-600">
              We could not find a provider listing that matches your sign-in email.
              If you have not applied yet, you can submit an application for our
              team to review.
            </p>
            <Link
              href="/provider-apply"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Apply to join the network
            </Link>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-stone-600">
          <Link
            href="/providers"
            className="font-medium text-stone-900 underline-offset-2 hover:underline"
          >
            Browse the public directory
          </Link>
        </p>
      </main>
    </div>
  );
}
