import type { HTMLAttributes } from "react";

import { cn } from "./cn";

const SIZES = {
  xs: "size-6 text-[0.625rem]",
  sm: "size-7 text-xs",
  md: "size-9 text-sm",
  lg: "size-11 text-base",
} as const;

function initialsOf(name: string | null | undefined): string {
  const cleaned = (name ?? "").trim();
  if (!cleaned) return "?";

  const parts = cleaned.split(/\s+/).slice(0, 2);
  const letters = parts
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return letters || cleaned.charAt(0).toUpperCase();
}

/** Stable hue per person so the same user keeps the same colour across renders. */
function hueOf(name: string | null | undefined): number {
  const source = (name ?? "").trim() || "payloop";
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) % 360;
  }

  return hash;
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  name?: string | null;
  size?: keyof typeof SIZES;
}

export function Avatar({ name, size = "md", className, ...props }: AvatarProps) {
  const hue = hueOf(name);

  return (
    <span
      role="img"
      aria-label={name ? `${name}'s avatar` : "Account avatar"}
      style={{
        backgroundColor: `oklch(0.94 0.035 ${hue})`,
        color: `oklch(0.42 0.11 ${hue})`,
      }}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold tracking-tight",
        SIZES[size],
        className,
      )}
      {...props}
    >
      {initialsOf(name)}
    </span>
  );
}