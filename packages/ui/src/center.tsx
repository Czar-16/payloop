import type { HTMLAttributes } from "react";

import { cn } from "./cn";

export interface CenterProps extends HTMLAttributes<HTMLDivElement> {
  /** Removes the full-height behaviour for nested centering. */
  contained?: boolean;
}

export function Center({ contained = true, className, children, ...props }: CenterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-4 py-10",
        contained && "min-h-dvh",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}