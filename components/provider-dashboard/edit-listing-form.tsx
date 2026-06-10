"use client";

import { FormMessage } from "@/components/auth/form-message";
import { updateProviderListing } from "@/lib/provider-dashboard/update-provider-listing";
import type { ProviderEditListing } from "@/lib/provider-dashboard/types";
import { useState, type FormEvent } from "react";

const inputClassName =
  "mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition focus:border-amber-700/50 focus:ring-2 focus:ring-amber-100";

type EditListingFormProps = {
  listing: ProviderEditListing;
};

export function EditListingForm({ listing }: EditListingFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = await updateProviderListing({
      businessName: String(formData.get("businessName") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      description: String(formData.get("description") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      website: String(formData.get("website") ?? ""),
      address: String(formData.get("address") ?? ""),
      city: String(formData.get("city") ?? ""),
      state: String(formData.get("state") ?? ""),
      zipCode: String(formData.get("zipCode") ?? ""),
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSuccess("Your listing was saved.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error ? <FormMessage variant="error" message={error} /> : null}
      {success ? <FormMessage variant="success" message={success} /> : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="edit-business-name"
            className="block text-sm font-medium text-stone-700"
          >
            Business name
          </label>
          <input
            id="edit-business-name"
            name="businessName"
            type="text"
            required
            defaultValue={listing.business_name}
            autoComplete="organization"
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="edit-short-description"
            className="block text-sm font-medium text-stone-700"
          >
            Short description
          </label>
          <textarea
            id="edit-short-description"
            name="shortDescription"
            rows={3}
            defaultValue={listing.short_description ?? ""}
            placeholder="A brief summary for directory cards"
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="edit-description"
            className="block text-sm font-medium text-stone-700"
          >
            Full description
          </label>
          <textarea
            id="edit-description"
            name="description"
            rows={6}
            defaultValue={listing.description}
            placeholder="Tell customers about your services and experience"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="edit-phone"
            className="block text-sm font-medium text-stone-700"
          >
            Phone
          </label>
          <input
            id="edit-phone"
            name="phone"
            type="tel"
            defaultValue={listing.phone ?? ""}
            autoComplete="tel"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="edit-website"
            className="block text-sm font-medium text-stone-700"
          >
            Website <span className="font-normal text-stone-500">(optional)</span>
          </label>
          <input
            id="edit-website"
            name="website"
            type="url"
            placeholder="https://"
            defaultValue={listing.website ?? ""}
            autoComplete="url"
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="edit-address"
            className="block text-sm font-medium text-stone-700"
          >
            Street address
          </label>
          <input
            id="edit-address"
            name="address"
            type="text"
            defaultValue={listing.address ?? ""}
            autoComplete="street-address"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="edit-city"
            className="block text-sm font-medium text-stone-700"
          >
            City
          </label>
          <input
            id="edit-city"
            name="city"
            type="text"
            defaultValue={listing.city ?? ""}
            autoComplete="address-level2"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="edit-state"
            className="block text-sm font-medium text-stone-700"
          >
            State
          </label>
          <input
            id="edit-state"
            name="state"
            type="text"
            defaultValue={listing.state ?? ""}
            autoComplete="address-level1"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="edit-zip-code"
            className="block text-sm font-medium text-stone-700"
          >
            ZIP code
          </label>
          <input
            id="edit-zip-code"
            name="zipCode"
            type="text"
            inputMode="numeric"
            defaultValue={listing.zip_code ?? ""}
            autoComplete="postal-code"
            className={inputClassName}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[10rem]"
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
