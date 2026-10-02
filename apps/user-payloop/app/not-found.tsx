import { Card, CardHeader, CardTitle, CardContent, Container } from "@repo/ui/card";
import { LinkButton } from "@/components/LinkButton";
import { ArrowLeftIcon, ExternalLinkIcon } from "@repo/ui/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-10">
      <Container className="w-full">
        <Card elevated className="mx-auto max-w-md text-center">
          <CardHeader>
            <span className="inline-flex size-12 items-center justify-center rounded-xl border border-line bg-surface-muted text-fg">
              <ArrowLeftIcon size={22} />
            </span>
            <CardTitle className="pt-2 text-lg">
              Page not found
            </CardTitle>
            <p className="text-sm text-fg-muted">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
              have been moved or doesn&apos;t exist.
            </p>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <LinkButton href="/" size="sm" variant="secondary">
                <ArrowLeftIcon size={14} />
                Back home
              </LinkButton>
              <LinkButton href="/dashboard" size="sm">
                Go to dashboard
                <ExternalLinkIcon size={14} />
              </LinkButton>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}