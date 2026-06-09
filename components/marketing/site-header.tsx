import Link from "next/link";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#benefits", label: "Benefits" },
  { href: "#categories", label: "Categories" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-stone-900 sm:text-lg"
        >
          Huntington Select
        </Link>

        <nav
          className="hidden items-center gap-8 text-sm font-medium text-stone-600 md:flex"
          aria-label="Main"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-stone-900"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            className="transition-colors hover:text-stone-900"
          >
            Member Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-stone-900 px-4 py-2 text-white transition-colors hover:bg-stone-800"
          >
            Join Now
          </Link>
        </nav>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-800 [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-stone-200 bg-white p-3 shadow-lg">
            <ul className="flex flex-col gap-1 text-sm font-medium text-stone-700">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block rounded-lg px-3 py-2 hover:bg-stone-50"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/login"
                  className="block rounded-lg px-3 py-2 hover:bg-stone-50"
                >
                  Member Login
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href="/register"
                  className="block rounded-lg bg-stone-900 px-3 py-2 text-center text-white hover:bg-stone-800"
                >
                  Join Now
                </Link>
              </li>
            </ul>
          </div>
        </details>
      </div>
    </header>
  );
}
