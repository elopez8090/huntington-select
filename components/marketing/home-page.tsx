import Link from "next/link";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

const steps = [
  {
    step: "1",
    title: "Join",
    description:
      "Create your member account in minutes and step into a curated program built for people who value quality experiences.",
  },
  {
    step: "2",
    title: "Buy credits",
    description:
      "Add credits when you are ready. They are your flexible currency inside the program—no clutter, no guesswork.",
  },
  {
    step: "3",
    title: "Redeem curated offers",
    description:
      "Browse hand-picked benefits from trusted partners and redeem with a few clicks. Every redemption is tracked for you.",
  },
] as const;

const benefits = [
  {
    title: "Curated, not crowded",
    description:
      "Every offer is selected for quality and relevance—so you spend time enjoying benefits, not scrolling endless deals.",
  },
  {
    title: "Credits you control",
    description:
      "Load credits on your schedule and use them when something fits. Your balance and history stay clear in your member dashboard.",
  },
  {
    title: "Trusted redemption",
    description:
      "Redemptions run through secure member flows with confirmations you can rely on—simple, transparent, and member-first.",
  },
  {
    title: "Local & premium partners",
    description:
      "Dining, events, wellness, and services from partners who reflect the standard Huntington Select members expect.",
  },
] as const;

const categories = [
  {
    slug: "dining",
    title: "Dining",
    description: "Chef-driven tables, wine bars, and neighborhood gems worth the reservation.",
  },
  {
    slug: "events",
    title: "Events",
    description: "Tickets, previews, and member-only gatherings across the calendar.",
  },
  {
    slug: "wellness",
    title: "Wellness",
    description: "Spa days, fitness studios, and restorative experiences to recharge.",
  },
  {
    slug: "services",
    title: "Services",
    description: "Concierge-style perks from vetted professionals and local specialists.",
  },
  {
    slug: "experiences",
    title: "Experiences",
    description: "One-of-a-kind outings and seasonal highlights you will actually use.",
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
              Members-only benefits
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Huntington Select
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-300 sm:text-xl">
              Huntington Select is a curated membership program. Join once,
              buy credits when you are ready, and redeem exclusive offers from
              premium local partners—dining, events, wellness, and more.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-full bg-amber-600 px-8 text-base font-semibold text-stone-950 transition-colors hover:bg-amber-500"
              >
                Join Now
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full border border-stone-600 bg-transparent px-8 text-base font-semibold text-stone-100 transition-colors hover:border-stone-400 hover:bg-stone-900"
              >
                Member Login
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
                How it works
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                Three straightforward steps from visitor to member enjoying
                curated benefits.
              </p>
            </div>
            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((item) => (
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
          id="benefits"
          className="scroll-mt-20 border-b border-stone-200 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Featured benefits
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                Designed for members who want quality, clarity, and experiences
                that feel intentional—not transactional.
              </p>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <li
                  key={benefit.title}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
                >
                  <h3 className="text-lg font-semibold text-stone-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                    {benefit.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="categories"
          className="scroll-mt-20 border-b border-stone-200 bg-white py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Offer categories
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                A preview of how benefits are organized inside the member
                catalog. Join to browse live offers and redeem with credits.
              </p>
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <li
                  key={category.slug}
                  className="group rounded-2xl border border-stone-200 p-6 transition-colors hover:border-amber-600/40 hover:bg-amber-50/30"
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
            <p className="mt-8 text-sm text-stone-500">
              Full catalog available after you sign in as a member.
            </p>
          </div>
        </section>

        <section className="bg-stone-950 py-16 text-stone-50 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to experience Huntington Select?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-400 sm:text-lg">
              Join the program today. When you are ready, add credits and start
              redeeming curated offers built for members who expect more.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 w-full min-w-[200px] items-center justify-center rounded-full bg-amber-600 px-8 text-base font-semibold text-stone-950 transition-colors hover:bg-amber-500 sm:w-auto"
              >
                Join Now
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 w-full min-w-[200px] items-center justify-center rounded-full border border-stone-600 px-8 text-base font-semibold text-stone-100 transition-colors hover:border-stone-400 hover:bg-stone-900 sm:w-auto"
              >
                Member Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
