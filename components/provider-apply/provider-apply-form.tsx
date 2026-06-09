"use client";

import { FormMessage } from "@/components/auth/form-message";
import { submitProviderApplication } from "@/lib/provider-applications/submit-application";
import type { ServiceCategory } from "@/lib/providers/types";
import { useState, type FormEvent } from "react";

const inputClassName =
  "mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition focus:border-amber-700/50 focus:ring-2 focus:ring-amber-100";

type ProviderApplyFormProps = {
  categories: ServiceCategory[];
};

export function ProviderApplyForm({ categories }: ProviderApplyFormProps) {
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

    const result = await submitProviderApplication({
      businessName: String(formData.get("businessName") ?? ""),
      contactName: String(formData.get("contactName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      website: String(formData.get("website") ?? ""),
      serviceCategoryId: String(formData.get("serviceCategoryId") ?? ""),
      city: String(formData.get("city") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      whySelect: String(formData.get("whySelect") ?? ""),
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSuccess(
      "Thank you. Your application was received and is pending review. We will contact you by email.",
    );
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error ? <FormMessage variant="error" message={error} /> : null}
      {success ? <FormMessage variant="success" message={success} /> : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="apply-business-name"
            className="block text-sm font-medium text-stone-700"
          >
            Business name
          </label>
          <input
            id="apply-business-name"
            name="businessName"
            type="text"
            required
            autoComplete="organization"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="apply-contact-name"
            className="block text-sm font-medium text-stone-700"
          >
            Contact name
          </label>
          <input
            id="apply-contact-name"
            name="contactName"
            type="text"
            required
            autoComplete="name"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="apply-email"
            className="block text-sm font-medium text-stone-700"
          >
            Email
          </label>
          <input
            id="apply-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="apply-phone"
            className="block text-sm font-medium text-stone-700"
          >
            Phone
          </label>
          <input
            id="apply-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="apply-website"
            className="block text-sm font-medium text-stone-700"
          >
            Website <span className="font-normal text-stone-500">(optional)</span>
          </label>
          <input
            id="apply-website"
            name="website"
            type="url"
            placeholder="https://"
            autoComplete="url"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="apply-service-category"
            className="block text-sm font-medium text-stone-700"
          >
            Service category
          </label>
          <select
            id="apply-service-category"
            name="serviceCategoryId"
            required
            defaultValue=""
            className={inputClassName}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="apply-city"
            className="block text-sm font-medium text-stone-700"
          >
            City
          </label>
          <input
            id="apply-city"
            name="city"
            type="text"
            required
            autoComplete="address-level2"
            placeholder="Huntington"
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="apply-short-description"
          className="block text-sm font-medium text-stone-700"
        >
          Short description
        </label>
        <textarea
          id="apply-short-description"
          name="shortDescription"
          required
          rows={3}
          placeholder="What services do you offer, and who do you typically serve?"
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor="apply-why-select"
          className="block text-sm font-medium text-stone-700"
        >
          Why you should be selected
        </label>
        <textarea
          id="apply-why-select"
          name="whySelect"
          required
          rows={4}
          placeholder="Experience, licenses, local reputation, or what makes your business a fit for Huntington Select."
          className={inputClassName}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[12rem]"
      >
        {isSubmitting ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
