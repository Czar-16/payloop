import { useId, type ReactNode } from "react";

import { cn } from "./cn";

export interface FieldProps {
  label: ReactNode;
  /** Unique id for the control. Prefer `useId()` when not set explicitly. */
  htmlFor?: string;
  hint?: ReactNode;
  error?: string | null;
  required?: boolean;
  /** Small trailing affordance aligned with the label row, e.g. a toggle. */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Wires label, hint and error text to a control through `aria-describedby`
 * and `aria-invalid`, and renders the error in a live region.
 */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  action,
  className,
  children,
}: FieldProps) {
  const generatedId = useId();
  const controlId = htmlFor ?? generatedId;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={controlId}
          className="text-sm font-medium text-fg select-none"
        >
          {label}
          {required ? (
            <span className="ml-0.5 text-negative" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
        {action}
      </div>

      {children}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-xs font-medium text-negative"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-fg-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Focus + error treatment shared by every form control. */
export const controlClasses = (invalid?: boolean): string =>
  cn(
    "w-full rounded-lg border bg-surface text-sm text-fg shadow-xs",
    "placeholder:text-fg-subtle",
    "transition-[border-color,box-shadow] duration-150",
    "focus:outline-none focus-visible:outline-none",
    "focus-visible:ring-[3px]",
    "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-subtle disabled:shadow-none",
    invalid
      ? "border-negative focus:border-negative focus-visible:ring-negative/15"
      : "border-line-strong hover:border-line-strong/80 focus:border-accent focus-visible:ring-accent/15",
  );