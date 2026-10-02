import type { HTMLAttributes } from "react";

import { cn } from "./cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-surface-hover motion-reduce:animate-none", className)}
      {...props}
    />
  );
}

/** Card-shaped placeholder matching the dashboard transaction layout. */
export function TransactionSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4">
      <Skeleton className="size-9 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
    </div>
  );
}

/** Placeholder for the balance tiles on the dashboard overview. */
export function StatSkeleton() {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-8 w-36" />
      <Skeleton className="mt-3 h-3 w-16" />
    </div>
  );
}