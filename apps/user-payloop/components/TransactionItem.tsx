import type { ComponentType } from "react";

import {
  ArrowDownLeftIcon,
  ArrowDownToLineIcon,
  SendIcon,
  type IconProps,
} from "@repo/ui/icons";
import { StatusBadge } from "@repo/ui/card";
import { cn } from "@repo/ui/cn";

import { formatDateTime, formatSignedAmount } from "@/lib/format";

export type TransactionType = "onramp" | "sent" | "received";

const TYPE_ICON: Record<TransactionType, ComponentType<IconProps>> = {
  onramp: ArrowDownToLineIcon,
  received: ArrowDownLeftIcon,
  sent: SendIcon,
};

const TYPE_TINT: Record<TransactionType, string> = {
  onramp: "bg-positive-soft text-positive-strong border-positive-line",
  received: "bg-positive-soft text-positive-strong border-positive-line",
  sent: "bg-surface-hover text-fg-muted border-line",
};

export interface TransactionItemProps {
  type: TransactionType;
  title: string;
  subtitle?: string;
  amount: number;
  status: string;
  createdAt: Date | string;
  /** On-ramp token or transfer reference, shown as monospaced metadata. */
  reference?: string;
}

export function TransactionItem({
  type,
  title,
  subtitle,
  amount,
  status,
  createdAt,
  reference,
}: TransactionItemProps) {
  const IconComponent = TYPE_ICON[type];
  const { prefix, amount: formatted } = formatSignedAmount(
    amount,
    type === "sent" ? "out" : "in",
  );

  return (
    <li className="group flex items-center gap-3 rounded-xl border border-line bg-surface p-3.5 transition-colors hover:border-line-strong sm:gap-4 sm:p-4">
      <span
        aria-hidden="true"
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full border",
          TYPE_TINT[type],
        )}
      >
        <IconComponent size={17} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-fg">{title}</p>

        {subtitle ? (
          <p className="truncate text-xs text-fg-subtle">{subtitle}</p>
        ) : null}

        {reference ? (
          <p className="mt-1 truncate font-mono text-2xs text-fg-subtle">
            Ref {reference}
          </p>
        ) : null}
      </div>

      <div className="flex max-w-[11rem] shrink-0 flex-col items-end gap-1 sm:max-w-[14rem]">
        <p
          className={cn(
            "tabular text-sm font-bold sm:text-base",
            type === "sent" ? "text-fg" : "text-positive-strong",
          )}
        >
          <span className={type === "sent" ? "text-fg-subtle" : undefined}>
            {prefix}
          </span>
          {formatted}
        </p>

        <div className="flex items-end gap-2 sm:items-center">
          <StatusBadge status={status} />
          <time
            dateTime={new Date(createdAt).toISOString()}
            title={formatDateTime(createdAt)}
            className="hidden whitespace-nowrap text-right text-xs leading-3 text-fg-subtle tabular sm:block"
          >
            {formatDateTime(createdAt)}
          </time>
        </div>
        <time
          dateTime={new Date(createdAt).toISOString()}
          className="whitespace-nowrap text-right text-2xs leading-3 text-fg-subtle tabular sm:hidden"
        >
          {formatDateTime(createdAt)}
        </time>
      </div>
    </li>
  );
}