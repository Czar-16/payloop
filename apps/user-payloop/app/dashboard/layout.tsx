import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppbarWrapper } from "@/components/AppbarWrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <AppbarWrapper user={session.user} />

      <div className="flex">
        <aside className="w-56 border-r p-4 min-h-[calc(100vh-65px)]">
          <nav className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/add-money"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Add Money
            </Link>

            <Link
              href="/dashboard/transfer"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Transfer
            </Link>

            <Link
              href="/dashboard/transactions"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Transactions
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
