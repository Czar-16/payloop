"use client";

import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { AlertTriangleIcon } from "@repo/ui/icons";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-6 animate-rise">
      <Card elevated className="mx-auto max-w-lg">
        <CardHeader>
          <span className="inline-flex size-10 items-center justify-center rounded-xl border border-negative-line bg-negative-soft text-negative-strong">
            <AlertTriangleIcon size={20} />
          </span>
          <CardTitle className="pt-2 text-lg">
            Couldn&apos;t load this section
          </CardTitle>
          <p className="text-sm text-fg-muted">
            Something went wrong while fetching your wallet data. Your money
            is safe — this is usually a temporary hiccup.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {error.message ? (
            <p
              role="alert"
              className="rounded-md border border-line bg-surface-muted px-3 py-2 font-mono text-xs break-all text-fg-muted"
            >
              {error.message}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button onClick={reset} size="sm">
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}