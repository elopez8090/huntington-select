import { LogoutButton } from "@/components/auth/logout-button";
import { EditListingForm } from "@/components/provider-dashboard/edit-listing-form";
import { getProviderListingForEdit } from "@/lib/provider-dashboard/get-provider-listing-for-edit";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Edit listing | Huntington Select",
  description: "Update your Huntington Select provider directory listing.",
};

export default async function ProviderEditListingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "";
  const listing = email
    ? await getProviderListingForEdit(supabase, email)
    : null;

  if (!listing) {
    redirect("/provider/dashboard");
  }

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
            Edit your listing
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Update the details customers see on your directory profile. Status,
            categories, and photos are managed separately.
          </p>
          <p className="mt-4">
            <Link
              href="/provider/dashboard"
              className="text-sm font-medium text-stone-900 underline-offset-2 hover:underline"
            >
              Back to dashboard
            </Link>
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white px-5 py-6 shadow-sm sm:px-8 sm:py-8">
          <EditListingForm listing={listing} />
        </div>
      </main>
    </div>
  );
}
