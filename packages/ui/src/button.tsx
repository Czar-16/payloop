import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "./cn";
import { Spinner } from "./spinner";

export type ButtonVariant =
  | "primary"
  | "accent"
  | "secondary"
  | "subtle"
  | "ghost"
  | "danger"
  | "dangerGhost"
  | "link";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-fg text-fg-inverse shadow-xs hover:bg-fg/90 active:bg-fg disabled:bg-fg/50",
  accent:
    "bg-accent text-accent-fg shadow-xs hover:bg-accent-hover active:bg-accent-hover",
  secondary:
    "bg-surface text-fg border border-line-strong shadow-xs hover:bg-surface-hover active:bg-surface-hover",
  subtle:
    "bg-accent-soft text-accent border border-accent-line hover:bg-accent-soft/60",
  ghost:
    "text-fg-muted hover:bg-surface-hover hover:text-fg active:bg-surface-hover",
  danger:
    "bg-negative text-white shadow-xs hover:bg-negative-strong active:bg-negative-strong",
  dangerGhost: "text-negative hover:bg-negative-soft",
  link: "text-accent hover:text-accent-hover underline-offset-4 hover:underline",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 rounded-md px-2.5 text-xs",
  md: "h-9.5 gap-2 rounded-lg px-3.5 text-sm",
  lg: "h-11 gap-2 rounded-lg px-5 text-sm",
  icon: "size-9.5 rounded-lg",
};

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, blocks interaction and marks the control busy. */
  loading?: boolean;
  /** Accessible name announced while `loading` is true. */
  loadingText?: string;
  fullWidth?: boolean;
  /** Rendered before the label. Hidden while loading. */
  startIcon?: ReactNode;
  /** Rendered after the label. */
  endIcon?: ReactNode;
  children?: ReactNode;
  /** @deprecated Use the standard `onClick` prop. */
  onclick?: () => void;
}

/**
 * Resolves the class list for a button look so router-aware links and other
 * non-`button` elements can reuse the exact same visual language.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}): string {
  const isLink = variant === "link";

  return cn(
    "relative inline-flex select-none items-center justify-center whitespace-nowrap font-medium",
    "transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-150 ease-out-soft",
    "disabled:pointer-events-none disabled:opacity-55",
    VARIANTS[variant],
    SIZES[size],
    !isLink && "active:scale-[0.98] motion-reduce:active:scale-100",
    fullWidth && "w-full",
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      fullWidth = false,
      startIcon,
      endIcon,
      disabled = false,
      className,
      type = "button",
      children,
      onclick,
      onClick,
      ...props
    },
    ref,
  ) {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        onClick={onClick ?? onclick}
          className={buttonClasses({ variant, size, fullWidth, className })}
          {...props}
        >
        {loading ? (
          <>
            <Spinner size={size === "lg" ? 18 : 15} label={null} />
            {loadingText ? (
              <span>{loadingText}</span>
            ) : (
              children && <span className="sr-only">{children}</span>
            )}
          </>
        ) : (
          <>
            {startIcon}
            {children}
            {endIcon}
          </>
        )}
      </button>
    );
  },
);