import { Card } from "@repo/ui/card";

export default function DashboardPage() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="text-sm font-medium text-gray-500">
            Available Balance
          </h3>

          <p className="mt-2 text-3xl font-bold">₹0</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-500">Locked Balance</h3>

          <p className="mt-2 text-3xl font-bold">₹0</p>
        </Card>
      </div>
    </div>
  );
}
