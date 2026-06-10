import Link from "next/link";
import type { ReactNode } from "react";

type DashboardActionCardVariant = "customer" | "provider";

type DashboardActionCardProps = {
  title: string;
  description: string;
  variant: DashboardActionCardVariant;
  href?: string;
  comingSoon?: boolean;
  footer?: ReactNode;
};

const variantStyles: Record<
  DashboardActionCardVariant,
  { card: string; title: string; badge: string; link: string }
> = {
  customer: {
    card: "border-sky-200/80 bg-white hover:border-sky-300",
    title: "text-zinc-900",
    badge: "bg-sky-50 text-sky-800 ring-sky-200/80",
    link: "text-sky-900 hover:text-sky-950",
  },
  provider: {
    card: "border-amber-200/70 bg-white hover:border-amber-300/80",
    title: "text-stone-900",
    badge: "bg-amber-50 text-amber-900 ring-amber-200/80",
    link: "text-amber-950 hover:text-stone-900",
  },
};

export function DashboardActionCard({
  title,
  description,
  variant,
  href,
  comingSoon = false,
  footer,
}: DashboardActionCardProps) {
  const styles = variantStyles[variant];
  const isInteractive = Boolean(href) && !comingSoon;

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className={`text-base font-semibold ${styles.title}`}>{title}</p>
        {comingSoon ? (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${styles.badge}`}
          >
            Coming soon
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{description}</p>
      {footer ? <div className="mt-4">{footer}</div> : null}
      {isInteractive ? (
        <p className={`mt-4 text-sm font-medium ${styles.link}`}>Open →</p>
      ) : null}
    </>
  );

  const className = `flex h-full flex-col rounded-xl border p-5 shadow-sm transition sm:p-6 ${styles.card} ${
    isInteractive ? "hover:shadow-md" : "opacity-[0.92]"
  }`;

  if (isInteractive && href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}
