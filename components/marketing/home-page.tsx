import Link from "next/link";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

const customerSteps = [
  {
    step: "1",
    title: "Choose a category",
    description:
      "Start with what you need—roofing, plumbing, landscaping, and more. Every category is organized for homeowners in Huntington.",
  },
  {
    step: "2",
    title: "Browse trusted pros",
    description:
      "Explore vetted local contractors and service providers selected for quality, professionalism, and community reputation.",
  },
  {
    step: "3",
    title: "Connect with confidence",
    description:
      "Reach out knowing each provider earned a place in the network through our curation process—not an open directory.",
  },
] as const;

const trustReasons = [
  {
    title: "Local to Huntington",
    description:
      "Providers in the network serve Huntington and nearby communities—people who know the area, the homes, and the standards neighbors expect.",
  },
  {
    title: "Vetted before listing",
    description:
      "We review credentials, experience, and reputation before a provider is featured. Not everyone who applies is accepted.",
  },
  {
    title: "Quality over volume",
    description:
      "The network stays intentionally curated. You see fewer names, but each one is chosen to represent dependable work and clear communication.",
  },
  {
    title: "Ongoing standards",
    description:
      "Membership in Huntington Select reflects a commitment to the bar we set—so homeowners can hire with more peace of mind.",
  },
] as const;

const serviceCategories = [
  {
    slug: "roofing-exterior",
    title: "Roofing & exterior",
    description:
      "Roof repair, siding, gutters, and exterior work from pros who protect your home year-round.",
  },
  {
    slug: "plumbing-hvac",
    title: "Plumbing & HVAC",
    description:
      "Licensed specialists for leaks, heating, cooling, and the systems that keep your home comfortable.",
  },
  {
    slug: "electrical",
    title: "Electrical",
    description:
      "Panel upgrades, lighting, and safe electrical work from experienced local electricians.",
  },
  {
    slug: "landscaping",
    title: "Landscaping & outdoor",
    description:
      "Lawns, hardscaping, and outdoor living from teams that take pride in Huntington properties.",
  },
  {
    slug: "remodeling",
    title: "Remodeling & interior",
    description:
      "Kitchens, baths, and whole-home updates from craftsmen who respect your space and timeline.",
  },
  {
    slug: "general",
    title: "General home services",
    description:
      "Handyman, cleaning, and specialty trades for the projects that do not fit a single box.",
  },
] as const;

const providerBenefits = [
  {
    title: "Stand out in a curated network",
    description:
      "You are not one of hundreds on a generic listing site. Huntington Select highlights providers we trust and recommend.",
  },
  {
    title: "Homeowners who value quality",
    description:
      "Members and visitors come here looking for dependable local pros—not the lowest bid at any cost.",
  },
  {
    title: "Premium local brand",
    description:
      "Associate your business with a selective Huntington program built around trust, clarity, and community.",
  },
  {
    title: "Straightforward application",
    description:
      "Tell us about your work and credentials. If you are a fit, we will guide you through joining the network.",
  },
] as const;

export function HomePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-stone-50 text-stone-900">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden border-b border-stone-200 bg-stone-950 text-stone-50">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(180,140,90,0.22),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-200/90">
              Curated local service network
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Trusted local pros for Huntington homeowners
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-300 sm:text-xl">
              Huntington Select is a curated network of contractors and service
              providers for Huntington. Find vetted local professionals for
              your home—without wading through endless, unverified listings.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/providers"
                className="inline-flex h-12 items-center justify-center rounded-full bg-amber-600 px-8 text-base font-semibold text-stone-950 transition-colors hover:bg-amber-500"
              >
                Browse Providers
              </Link>
              <Link
                href="/provider-apply"
                className="inline-flex h-12 items-center justify-center rounded-full border border-stone-600 bg-transparent px-8 text-base font-semibold text-stone-100 transition-colors hover:border-stone-400 hover:bg-stone-900"
              >
                Join as a Provider
              </Link>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-20 border-b border-stone-200 bg-white py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                How it works for homeowners
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                A simple path from “I need help at home” to a provider you can
                feel good about contacting.
              </p>
            </div>
            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {customerSteps.map((item) => (
                <li
                  key={item.step}
                  className="rounded-2xl border border-stone-200 bg-stone-50 p-6 sm:p-8"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white">
                    {item.step}
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="categories"
          className="scroll-mt-20 border-b border-stone-200 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Featured service categories
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                Common home projects, organized so you can find the right kind
                of provider faster.
              </p>
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {serviceCategories.map((category) => (
                <li
                  key={category.slug}
                  className="group rounded-2xl border border-stone-200 bg-white p-6 transition-colors hover:border-amber-600/40 hover:bg-amber-50/30"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-amber-800/80">
                    {category.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {category.description}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link
                href="/providers"
                className="inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
              >
                Browse all providers
              </Link>
            </div>
          </div>
        </section>

        <section
          id="trust"
          className="scroll-mt-20 border-b border-stone-200 bg-white py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Why our providers are trusted
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                Huntington Select is selective by design. Here is what
                “curated” means for your home.
              </p>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2">
              {trustReasons.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-stone-200 bg-stone-50 p-6 sm:p-8"
                >
                  <h3 className="text-lg font-semibold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="for-providers"
          className="scroll-mt-20 border-b border-stone-200 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-amber-800/90">
                For contractors & service providers
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Why join the Huntington Select network
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                If you take pride in your work and serve Huntington homeowners,
                we built this network for businesses like yours—not for
                volume-driven lead dumps.
              </p>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2">
              {providerBenefits.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
                >
                  <h3 className="text-lg font-semibold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link
                href="/provider-apply"
                className="inline-flex h-11 items-center justify-center rounded-full border-2 border-stone-900 bg-transparent px-6 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-900 hover:text-white"
              >
                Apply to join the network
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-stone-950 py-16 text-stone-50 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to find a pro—or join the network?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-400 sm:text-lg">
              Homeowners: browse curated local providers. Contractors: apply to
              be considered for Huntington Select membership.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/providers"
                className="inline-flex h-12 w-full min-w-[200px] items-center justify-center rounded-full bg-amber-600 px-8 text-base font-semibold text-stone-950 transition-colors hover:bg-amber-500 sm:w-auto"
              >
                Browse Providers
              </Link>
              <Link
                href="/provider-apply"
                className="inline-flex h-12 w-full min-w-[200px] items-center justify-center rounded-full border border-stone-600 px-8 text-base font-semibold text-stone-100 transition-colors hover:border-stone-400 hover:bg-stone-900 sm:w-auto"
              >
                Join as a Provider
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
