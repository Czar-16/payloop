import NextLink from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { buttonClasses, type ButtonSize, type ButtonVariant } from "@repo/ui/button";

export interface LinkButtonProps
  extends Omit<ComponentProps<typeof NextLink>, "className" | "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Router-aware counterpart to `Button`, so both share one visual language
 * without `packages/ui` needing to depend on Next.js.
 */
export function LinkButton({
  variant = "primary",
  size = "md",
  fullWidth,
  startIcon,
  endIcon,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <NextLink className={buttonClasses({ variant, size, fullWidth, className })} {...props}>
      {startIcon}
      {children}
      {endIcon}
    </NextLink>
  );
}