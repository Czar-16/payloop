import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "db";

import { Card } from "@repo/ui/card";

interface DashboardTransaction {
  id: string;
  type: "onramp" | "sent" | "received";
  title: string;
  amount: number;
  status: string;
  createdAt: Date;
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/api/auth/signin");
  }

  const userId = session.user.id;

  const balance = await db.balance.findUnique({
    where: { userId },
  });

  const available = balance?.available ?? 0;
  const locked = balance?.locked ?? 0;

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
      title: "Money Added",
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
    <div>
      <h2 className="mb-6 text-2xl font-bold">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="text-sm font-medium text-gray-500">
            Available Balance
          </h3>
          <p className="mt-2 text-3xl font-bold">₹{available}</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-500">Locked Balance</h3>
          <p className="mt-2 text-3xl font-bold">₹{locked}</p>
        </Card>
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/dashboard/add-money"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add Money
        </Link>
        <Link
          href="/dashboard/transfer"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
        >
          Transfer Money
        </Link>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-xl font-semibold">Recent Transactions</h3>
        {topRecent.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-500">No recent transactions.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {topRecent.map((tx) => (
              <Card key={tx.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{tx.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
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
    </div>
  );
}
