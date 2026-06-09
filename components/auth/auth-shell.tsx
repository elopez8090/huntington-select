import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-lg items-center px-4 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-zinc-900"
          >
            Huntington Select
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              {title}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">{subtitle}</p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            {children}
          </div>

          <p className="mt-6 text-center text-sm text-zinc-600">{footer}</p>
        </div>
      </main>
    </div>
  );
}
