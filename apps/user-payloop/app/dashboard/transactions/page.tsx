import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "db";

import { Card } from "@repo/ui/card";

interface CombinedTransaction {
  id: string;
  type: "onramp" | "sent" | "received";
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
      title: "Money Added",
      subtitle: "Bank On-ramp",
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

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Transaction History</h2>

      {transactions.length === 0 ? (
        <Card>
          <p className="text-sm text-gray-500">No transactions yet.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {transactions.map((tx) => (
            <Card key={tx.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{tx.title}</p>
                  {tx.subtitle && (
                    <p className="text-xs text-gray-500">{tx.subtitle}</p>
                  )}
                  {tx.reference && (
                    <p className="mt-0.5 text-xs font-mono text-gray-400">
                      Ref: {tx.reference}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      tx.type === "sent" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {tx.type === "sent" ? "-" : "+"}₹{tx.amount}
                  </p>
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${
                      tx.status === "Success"
                        ? "bg-green-100 text-green-800"
                        : tx.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
