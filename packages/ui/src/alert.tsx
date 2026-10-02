import type { ComponentType, HTMLAttributes, ReactNode } from "react";

import { cn } from "./cn";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  XIcon,
  type IconProps,
} from "./icons";

export type AlertTone = "info" | "success" | "warning" | "error";

const TONE_CLASSES: Record<AlertTone, string> = {
  info: "bg-accent-soft border-accent-line text-accent",
  success: "bg-positive-soft border-positive-line text-positive-strong",
  warning: "bg-warning-soft border-warning-line text-warning-strong",
  error: "bg-negative-soft border-negative-line text-negative-strong",
};

const TONE_ICONS: Record<AlertTone, ComponentType<IconProps>> = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  error: AlertCircleIcon,
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: AlertTone;
  title?: ReactNode;
  /** Set to `false` to use the tone's default icon. */
  icon?: ReactNode | false;
  onDismiss?: () => void;
}

export function Alert({
  tone = "info",
  title,
  icon,
  onDismiss,
  className,
  children,
  ...props
}: AlertProps) {
  const IconComponent = TONE_ICONS[tone];
  const resolvedIcon =
    icon === false ? null : (icon ?? <IconComponent size={18} className="mt-0.5" />);

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-lg border p-3.5 text-sm animate-rise",
        TONE_CLASSES[tone],
        className,
      )}
      {...props}
    >
      {resolvedIcon ? <span className="shrink-0">{resolvedIcon}</span> : null}

      <div className="min-w-0 flex-1 space-y-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className="text-fg-muted leading-5">{children}</div> : null}
      </div>

      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="-m-1 shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
        >
          <XIcon size={16} />
        </button>
      ) : null}
    </div>
  );
}