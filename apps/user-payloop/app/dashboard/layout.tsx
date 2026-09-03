import { Appbar } from "@repo/ui/appbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Appbar user={{ name: "Czar16" }} />

      <div className="flex">
        <aside className="w-56 border-r p-4">
          <nav className="flex flex-col gap-2">
            <a
              href="/dashboard"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Dashboard
            </a>

            <a
              href="/dashboard/add-money"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Add Money
            </a>

            <a
              href="/dashboard/transfer"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Transfer
            </a>

            <a
              href="/dashboard/transactions"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Transactions
            </a>
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
