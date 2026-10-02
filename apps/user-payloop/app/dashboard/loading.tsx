import { Alert } from "@repo/ui/alert";
import { PageHeader, Card } from "@repo/ui/card";
import { StatSkeleton, TransactionSkeleton } from "@repo/ui/skeleton";

/**
 * Mirrors the real overview layout so the skeleton swap is imperceptible —
 * no layout shift, no blank white flash.
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-fade-in" aria-hidden="true">
      <PageHeader
        title="Overview"
        description="Loading your wallet…"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2">
          <StatSkeleton />
        </div>
        <StatSkeleton />
      </div>

      <Card flush className="overflow-hidden">
        <div className="border-b border-line px-5 py-4 sm:px-6">
          <Alert tone="info" title="Loading" icon={false}>
            Fetching your latest balances and transactions.
          </Alert>
        </div>

        <div className="space-y-2.5 p-4 sm:p-5">
          <TransactionSkeleton />
          <TransactionSkeleton />
          <TransactionSkeleton />
        </div>
      </Card>
    </div>
  );
}