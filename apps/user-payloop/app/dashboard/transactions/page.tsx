import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "db";

import { Badge, Card, PageHeader } from "@repo/ui/card";
import { EmptyState } from "@repo/ui/empty-state";
import { ArrowDownToLineIcon, ReceiptIcon, SendIcon } from "@repo/ui/icons";

import { LinkButton } from "@/components/LinkButton";
import { TransactionItem, type TransactionType } from "@/components/TransactionItem";
import { formatCurrency } from "@/lib/format";

interface CombinedTransaction {
  id: string;
  type: TransactionType;
  title: string;
  subtitle?: string;
  amount: number;
  status: string;
  createdAt: Date;
  reference?: string;
}

export default async function TransactionsPage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/api/auth/signin");
  }

  const userId = session.user.id;

  const [onRamps, sentTransfers, receivedTransfers] = await Promise.all([
    db.onRampTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    db.transferTransaction.findMany({
      where: { senderId: userId },
      include: {
        receiver: {
          select: { name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.transferTransaction.findMany({
      where: { receiverId: userId },
      include: {
        sender: {
          select: { name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const transactions: CombinedTransaction[] = [];

  for (const item of onRamps) {
    transactions.push({
      id: item.id,
      type: "onramp",
      title: "Money added",
      subtitle: "Bank on-ramp",
      amount: item.amount,
      status: item.status,
      createdAt: item.createdAt,
      reference: item.token,
    });
  }

  for (const item of sentTransfers) {
    transactions.push({
      id: item.id,
      type: "sent",
      title: `Sent to ${item.receiver.name}`,
      subtitle: item.receiver.email || item.receiver.phone || undefined,
      amount: item.amount,
      status: item.status,
      createdAt: item.createdAt,
    });
  }

  for (const item of receivedTransfers) {
    transactions.push({
      id: item.id,
      type: "received",
      title: `Received from ${item.sender.name}`,
      subtitle: item.sender.email || item.sender.phone || undefined,
      amount: item.amount,
      status: item.status,
      createdAt: item.createdAt,
    });
  }

  transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const moneyIn = transactions
    .filter((tx) => tx.type !== "sent" && tx.status === "Success")
    .reduce((total, tx) => total + tx.amount, 0);
  const moneyOut = transactions
    .filter((tx) => tx.type === "sent" && tx.status === "Success")
    .reduce((total, tx) => total + tx.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Every deposit, transfer in and transfer out — in one place."
        actions={
          <LinkButton
            href="/dashboard/add-money"
            startIcon={<ArrowDownToLineIcon size={16} />}
          >
            Add money
          </LinkButton>
        }
      />

      {transactions.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-surface px-4 py-3.5">
            <p className="text-xs font-medium text-fg-muted">Total entries</p>
            <p className="tabular mt-1 text-xl font-semibold tracking-[-0.01em] text-fg">
              {transactions.length}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface px-4 py-3.5">
            <p className="text-xs font-medium text-fg-muted">Money in</p>
            <p className="tabular mt-1 text-xl font-semibold tracking-[-0.01em] text-positive-strong">
              {formatCurrency(moneyIn)}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface px-4 py-3.5">
            <p className="text-xs font-medium text-fg-muted">Money out</p>
            <p className="tabular mt-1 text-xl font-semibold tracking-[-0.01em] text-fg">
              {formatCurrency(moneyOut)}
            </p>
          </div>
        </div>
      ) : null}

      {transactions.length === 0 ? (
        <EmptyState
          icon={ReceiptIcon}
          title="No transactions yet"
          description="Add money or send your first transfer and your full history will appear here."
          action={
            <LinkButton href="/dashboard/add-money" size="sm">
              Add money
            </LinkButton>
          }
          secondaryAction={
            <LinkButton href="/dashboard/transfer" variant="secondary" size="sm">
              Send to someone
            </LinkButton>
          }
        />
      ) : (
        <Card flush>
          <div className="flex items-center gap-4 border-b border-line px-4 py-3 sm:px-5">
            <Badge tone="neutral">{transactions.length} total</Badge>
            <span className="flex items-center gap-1.5 text-xs text-fg-subtle">
              <SendIcon size={13} />
              Newest first
            </span>
          </div>

          <ul className="space-y-2.5 p-4 sm:p-5">
            {transactions.map((tx) => (
              <TransactionItem key={tx.id} {...tx} />
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}