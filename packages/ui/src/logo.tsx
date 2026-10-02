import type { HTMLAttributes } from "react";

import { cn } from "./cn";

const MARK_SIZES = {
  sm: "size-7 rounded-[8px]",
  md: "size-8 rounded-[10px]",
  lg: "size-10 rounded-[13px]",
} as const;

const GLYPH_SIZES = {
  sm: 15,
  md: 17,
  lg: 21,
} as const;

export interface LogoProps extends HTMLAttributes<HTMLSpanElement> {
  size?: keyof typeof MARK_SIZES;
  /** Renders the mark without the wordmark. */
  markOnly?: boolean;
}

/**
 * The loop arrow reads as both the brand name and the recurring motion of
 * money moving through the product.
 */
export function LogoMark({ size = "md", className }: { size?: keyof typeof MARK_SIZES; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-fg text-fg-inverse",
        MARK_SIZES[size],
        className,
      )}
    >
      <svg
        width={GLYPH_SIZES[size]}
        height={GLYPH_SIZES[size]}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.5 12a8.5 8.5 0 1 1-2.49-6.01" />
        <path d="M20.5 3.5v4.75h-4.75" />
      </svg>
    </span>
  );
}

export function Logo({
  size = "md",
  markOnly = false,
  className,
  ...props
}: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-fg",
        markOnly ? "" : "text-[1.0625rem] leading-none font-semibold tracking-[-0.02em]",
        className,
      )}
      {...props}
    >
      <LogoMark size={size} />
      {markOnly ? null : <span>Payloop</span>}
    </span>
  );
}