import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "./cn";

/* -------------------------------------------------------------------- */
/* Card                                                                  */
/* -------------------------------------------------------------------- */

export type CardTone = "default" | "muted" | "accent";

const CARD_TONES: Record<CardTone, string> = {
  default: "bg-surface border-line",
  muted: "bg-surface-muted border-line",
  accent: "bg-accent-soft border-accent-line",
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  /** Raises the card with a soft shadow — use for the primary object on a page. */
  elevated?: boolean;
  /** Removes the default padding for cards that manage their own spacing. */
  flush?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { tone = "default", elevated = false, flush = false, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border",
        CARD_TONES[tone],
        elevated && "shadow-sm",
        !flush && "p-5 sm:p-6",
        className,
      )}
      {...props}
    />
  );
});

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold tracking-[-0.01em] text-fg", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-fg-muted", className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-5 flex items-center gap-3 border-t border-line pt-4",
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------- */
/* Section — vertical rhythm + page width                                */
/* -------------------------------------------------------------------- */

export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />
  );
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <h1 className="text-xl font-semibold tracking-[-0.015em] text-fg sm:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-fg-muted text-pretty">{description}</p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Badge                                                                 */
/* -------------------------------------------------------------------- */

export type BadgeTone =
  | "neutral"
  | "accent"
  | "positive"
  | "negative"
  | "warning";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "bg-surface-hover text-fg-muted border-line",
  accent: "bg-accent-soft text-accent border-accent-line",
  positive: "bg-positive-soft text-positive-strong border-positive-line",
  negative: "bg-negative-soft text-negative-strong border-negative-line",
  warning: "bg-warning-soft text-warning-strong border-warning-line",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Renders a small leading dot — useful for live/persistent statuses. */
  dot?: boolean;
}

export function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-2xs font-medium leading-4",
        BADGE_TONES[tone],
        className,
      )}
      {...props}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-current opacity-70"
        />
      ) : null}
      {children}
    </span>
  );
}

/**
 * Maps a domain status string onto a badge tone. Unknown statuses degrade to
 * neutral rather than rendering as errors.
 */
export function statusTone(status: string): BadgeTone {
  switch (status) {
    case "Success":
      return "positive";
    case "Processing":
      return "warning";
    case "Failed":
      return "negative";
    default:
      return "neutral";
  }
}

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <Badge tone={statusTone(status)} dot className={className}>
      {status}
    </Badge>
  );
}

/* -------------------------------------------------------------------- */
/* Divider                                                               */
/* -------------------------------------------------------------------- */

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "bg-line",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}