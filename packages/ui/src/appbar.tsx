import type { ReactNode } from "react";

import { cn } from "./cn";
import { Logo } from "./logo";
import { LogOutIcon } from "./icons";

export interface AppbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
  onSignOut?: () => void;
  onSignIn?: () => void;
  /** Leading slot, e.g. a mobile navigation trigger. */
  leading?: ReactNode;
  /** Where the wordmark should point. Defaults to `/`. */
  href?: string;
  /**
   * Replaces the default wordmark anchor. Provide a router-aware link here so
   * navigation stays client-side.
   */
  brand?: ReactNode;
  /** Hides the sticky border/shadow — used on marketing surfaces. */
  variant?: "sticky" | "plain";
  className?: string;
  children?: ReactNode;
}

export function Appbar({
  user,
  onSignOut,
  onSignIn,
  leading,
  brand,
  href = "/",
  variant = "sticky",
  className,
  children,
}: AppbarProps) {
  return (
    <header
      className={cn(
        "z-30 flex h-14 items-center gap-3 bg-surface/85 px-4 backdrop-blur-md sm:px-6",
        variant === "sticky" && "sticky top-0 border-b border-line",
        className,
      )}
    >
      {leading}

      {brand ?? (
        <a
          href={href}
          className="flex items-center rounded-md transition-opacity hover:opacity-75"
        >
          <Logo />
          <span className="sr-only">Payloop home</span>
        </a>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        {user ? (
          <>
            {user.name || user.email ? (
              <span className="hidden max-w-40 truncate text-sm font-medium text-fg sm:block">
                {user.name || user.email}
              </span>
            ) : null}

            {onSignOut ? (
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
              >
                <LogOutIcon size={16} />
                <span className="hidden sm:inline">Sign out</span>
                <span className="sr-only sm:hidden">Sign out</span>
              </button>
            ) : null}
          </>
        ) : onSignIn ? (
          <button
            type="button"
            onClick={onSignIn}
            className="inline-flex h-8 items-center rounded-md bg-fg px-3 text-sm font-medium text-fg-inverse shadow-xs transition-colors hover:bg-fg/90"
          >
            Sign in
          </button>
        ) : null}
      </div>

      {children}
    </header>
  );
}