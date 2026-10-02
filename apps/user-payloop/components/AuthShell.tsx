import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@repo/ui/cn";
import { Logo } from "@repo/ui/logo";

/**
 * Minimal chrome shared by the sign-in and sign-up screens: brand anchor at the
 * top, centered content, and a footer slot for cross-links.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center rounded-md transition-opacity hover:opacity-75"
        >
          <Logo />
          <span className="sr-only">Payloop home</span>
        </Link>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:items-center sm:py-12">
        <div className={cn("w-full max-w-md", className)}>
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-fg">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-sm text-fg-muted text-pretty">{subtitle}</p>
            ) : null}
          </div>

          {children}
        </div>
      </main>

      {footer ? (
        <footer className="px-4 py-6 text-center text-sm text-fg-muted">
          {footer}
        </footer>
      ) : null}
    </div>
  );
}