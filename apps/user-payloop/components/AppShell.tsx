"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

import { Appbar } from "@repo/ui/appbar";
import { cn } from "@repo/ui/cn";
import { Logo } from "@repo/ui/logo";
import {
  ArrowDownToLineIcon,
  LayoutDashboardIcon,
  MenuIcon,
  ReceiptIcon,
  SendIcon,
  XIcon,
  type IconProps,
} from "@repo/ui/icons";

import { LinkButton } from "./LinkButton";

interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: ComponentType<IconProps>;
  /** Matches only when the pathname is exactly `href`. */
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    description: "Balance and recent activity",
    icon: LayoutDashboardIcon,
    exact: true,
  },
  {
    href: "/dashboard/add-money",
    label: "Add money",
    description: "Top up from your bank",
    icon: ArrowDownToLineIcon,
  },
  {
    href: "/dashboard/transfer",
    label: "Transfer",
    description: "Send money to anyone",
    icon: SendIcon,
  },
  {
    href: "/dashboard/transactions",
    label: "Transactions",
    description: "Full history",
    icon: ReceiptIcon,
  },
];

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Main" className="flex flex-col gap-0.5">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "group relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm",
              "transition-colors duration-150",
              isActive
                ? "bg-surface-hover font-medium text-fg"
                : "text-fg-muted hover:bg-surface-hover/70 hover:text-fg",
            )}
          >
            {isActive ? (
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent"
              />
            ) : null}
            <item.icon
              size={17}
              className={cn(
                "shrink-0 transition-colors",
                isActive ? "text-fg" : "text-fg-subtle group-hover:text-fg-muted",
              )}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div>
        <p className="px-2.5 pb-2 text-2xs font-semibold tracking-[0.08em] text-fg-subtle uppercase">
          Wallet
        </p>
        <NavLinks pathname={pathname} onNavigate={onNavigate} />
      </div>

      <div className="mt-auto space-y-3">
        <LinkButton
          href="/dashboard/add-money"
          onClick={onNavigate}
          fullWidth
          startIcon={<ArrowDownToLineIcon size={16} />}
        >
          Add money
        </LinkButton>
        <p className="px-1 text-xs text-fg-subtle text-pretty">
          Top up via bank transfer, then send instantly to any Payloop user.
        </p>
      </div>
    </div>
  );
}

export interface AppShellProps {
  user?: { name?: string | null; email?: string | null } | null;
  children: ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Any navigation dismisses the mobile drawer. State reset is now done in
  // SidebarBody via onNavigate callbacks, so we track the pathname only for
  // route-aware styling. No state mutation inside this effect.
  useEffect(() => {
    if (!drawerOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <div className="min-h-dvh">
      <Appbar
        user={user}
        onSignOut={() => signOut({ callbackUrl: "/login" })}
        brand={
          <Link
            href="/dashboard"
            className="flex items-center rounded-md transition-opacity hover:opacity-75"
          >
            <Logo />
            <span className="sr-only">Payloop dashboard</span>
          </Link>
        }
        leading={
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
            aria-controls="app-navigation"
            className="-ml-1 inline-flex size-8 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg lg:hidden"
          >
            <MenuIcon size={18} />
          </button>
        }
      />

      <div className="flex">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 border-r border-line bg-surface lg:block">
          <div className="scrollbar-subtle h-full overflow-y-auto">
            <SidebarBody pathname={pathname} />
          </div>
        </aside>

        {drawerOpen ? (
          <>
            <div
              className="fixed inset-0 z-40 animate-fade-in bg-fg/25 backdrop-blur-[2px] lg:hidden"
              onClick={closeDrawer}
              aria-hidden="true"
            />
            <aside
              id="app-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              className="fixed inset-y-0 left-0 z-50 w-64 animate-drawer-in border-r border-line bg-surface shadow-lg lg:hidden"
            >
              <div className="flex h-14 items-center justify-between border-b border-line px-4">
                <Link
                  href="/dashboard"
                  onClick={closeDrawer}
                  className="flex items-center rounded-md"
                >
                  <Logo />
                </Link>
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close navigation"
                  autoFocus
                  className="-mr-1 inline-flex size-8 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
                >
                  <XIcon size={18} />
                </button>
              </div>
              <div className="scrollbar-subtle h-[calc(100dvh-3.5rem)] overflow-y-auto">
                <SidebarBody pathname={pathname} onNavigate={closeDrawer} />
              </div>
            </aside>
          </>
        ) : null}

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}