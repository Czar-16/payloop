import Link from "next/link";
import { redirect } from "next/navigation";
import type { ComponentType } from "react";

import { auth } from "@/lib/auth";
import { db } from "db";

import { Card, PageHeader } from "@repo/ui/card";
import { EmptyState } from "@repo/ui/empty-state";
import {
  ArrowDownToLineIcon,
  BanknoteIcon,
  LockIcon,
  ReceiptIcon,
  SendIcon,
  TrendingUpIcon,
  type IconProps,
} from "@repo/ui/icons";
import { cn } from "@repo/ui/cn";

import { LinkButton } from "@/components/LinkButton";
import { TransactionItem, type TransactionType } from "@/components/TransactionItem";
import { formatCurrency } from "@/lib/format";

interface DashboardTransaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  status: string;
  createdAt: Date;
}

function StatCard({
  label,
  value,
  icon: IconComponent,
  hint,
  emphasis = false,
}: {
  label: string;
  value: string;
  icon: ComponentType<IconProps>;
  hint: string;
  emphasis?: boolean;
}) {
  return (
    <Card
      elevated
      className={cn(
        "flex flex-col justify-between gap-6",
        emphasis && "sm:col-span-2",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-fg-muted">{label}</p>
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-muted text-fg-subtle">
          <IconComponent size={16} />
        </span>
      </div>

      <div>
        <p className="tabular text-3xl font-semibold tracking-[-0.02em] text-fg sm:text-4xl">
          {value}
        </p>
        <p className="mt-1.5 text-xs text-fg-subtle">{hint}</p>
      </div>
    </Card>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/api/auth/signin");
  }

  const userId = session.user.id;

  const [balance, lockedAggregate] = await Promise.all([
    db.balance.findUnique({ where: { userId } }),
    db.onRampTransaction.aggregate({
      where: { userId, status: "Processing" },
      _sum: { amount: true },
    }),
  ]);

  const available = balance?.available ?? 0;
  const locked = lockedAggregate._sum.amount ?? 0;

  const [onRamps, sentTransfers, receivedTransfers] = await Promise.all([
    db.onRampTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.transferTransaction.findMany({
      where: { senderId: userId },
      include: { receiver: { select: { name: true, email: true, phone: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.transferTransaction.findMany({
      where: { receiverId: userId },
      include: { sender: { select: { name: true, email: true, phone: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const recentList: DashboardTransaction[] = [];

  for (const item of onRamps) {
    recentList.push({
      id: item.id,
      type: "onramp",
      title: "Money added",
      amount: item.amount,
      status: item.status,
      createdAt: item.createdAt,
    });
  }

  for (const item of sentTransfers) {
    recentList.push({
      id: item.id,
      type: "sent",
      title: `Sent to ${item.receiver.name}`,
      amount: item.amount,
      status: item.status,
      createdAt: item.createdAt,
    });
  }

  for (const item of receivedTransfers) {
    recentList.push({
      id: item.id,
      type: "received",
      title: `Received from ${item.sender.name}`,
      amount: item.amount,
      status: item.status,
      createdAt: item.createdAt,
    });
  }

  recentList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const topRecent = recentList.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description={`Welcome back, ${session.user.name || "there"}. Here is where your wallet stands.`}
        actions={
          <>
            <LinkButton
              href="/dashboard/transfer"
              variant="secondary"
              startIcon={<SendIcon size={16} />}
            >
              Transfer
            </LinkButton>
            <LinkButton
              href="/dashboard/add-money"
              startIcon={<ArrowDownToLineIcon size={16} />}
            >
              Add money
            </LinkButton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Available balance"
          value={formatCurrency(available)}
          icon={TrendingUpIcon}
          hint="Ready to send right away"
          emphasis
        />
        <StatCard
          label="Locked balance"
          value={formatCurrency(locked)}
          icon={LockIcon}
          hint="Held until pending payments settle"
        />
      </div>

      <Card flush className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-semibold text-fg">Recent activity</h2>
            {topRecent.length > 0 ? (
              <span className="tabular rounded-full border border-line bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
                {topRecent.length}
              </span>
            ) : null}
          </div>

          <Link
            href="/dashboard/transactions"
            className="rounded text-sm font-medium text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline"
          >
            View all
          </Link>
        </div>

        {topRecent.length === 0 ? (
          <EmptyState
            className="m-5 border-0 bg-transparent px-0 py-12 sm:m-6 sm:px-0"
            icon={ReceiptIcon}
            title="No activity yet"
            description="Once you add money or send your first transfer, it will show up here."
            action={
              <LinkButton href="/dashboard/add-money" size="sm">
                Add money
              </LinkButton>
            }
          />
        ) : (
          <ul className="space-y-2.5 p-4 sm:p-5">
            {topRecent.map((tx) => (
              <TransactionItem key={tx.id} {...tx} />
            ))}
          </ul>
        )}
      </Card>

      <p className="flex items-center gap-1.5 text-xs text-fg-subtle">
        <BanknoteIcon size={14} />
        Amounts are stored in whole rupees — no decimals, no rounding surprises.
      </p>
    </div>
  );
}