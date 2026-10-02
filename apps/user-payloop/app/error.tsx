"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { AlertTriangleIcon } from "@repo/ui/icons";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-10">
      <Card elevated className="mx-auto max-w-md text-center">
        <CardHeader>
          <span className="inline-flex size-11 items-center justify-center rounded-xl border border-negative-line bg-negative-soft text-negative-strong">
            <AlertTriangleIcon size={20} />
          </span>
          <CardTitle className="pt-2 text-lg">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-fg-muted">
            An unexpected error occurred. Your money is safe — please try again
            or refresh the page.
          </p>
          {error.message ? (
            <p className="rounded-md border border-line bg-surface-muted px-3 py-2 font-mono text-xs break-all text-fg-muted">
              {error.message}
            </p>
          ) : null}
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={reset}>Try again</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}