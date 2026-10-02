import type { ComponentType, HTMLAttributes, ReactNode } from "react";

import { cn } from "./cn";
import { InboxIcon, type IconProps } from "./icons";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ComponentType<IconProps>;
  title: ReactNode;
  description?: ReactNode;
  /** Primary call to action, usually a link or button. */
  action?: ReactNode;
  secondaryAction?: ReactNode;
}

export function EmptyState({
  icon: IconComponent = InboxIcon,
  title,
  description,
  action,
  secondaryAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center",
        className,
      )}
      {...props}
    >
      <span className="flex size-11 items-center justify-center rounded-full border border-line bg-surface-muted text-fg-subtle">
        <IconComponent size={20} />
      </span>

      <p className="mt-4 text-sm font-semibold text-fg">{title}</p>

      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-fg-muted text-pretty">
          {description}
        </p>
      ) : null}

      {action || secondaryAction ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}