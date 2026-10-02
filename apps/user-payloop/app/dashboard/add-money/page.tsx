"use client";

import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Alert } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle, PageHeader } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { TextInput } from "@repo/ui/text-input";
import { Badge, StatusBadge } from "@repo/ui/card";
import { cn } from "@repo/ui/cn";
import {
  ArrowDownToLineIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  LandmarkIcon,
  RefreshCwIcon,
  SendIcon,
  XIcon,
} from "@repo/ui/icons";

interface OnRampResult {
  transactionId: string;
  amount: number;
  token: string;
  status: string;
}

const BANKS = [
  { value: "hdfc", label: "HDFC Bank" },
  { value: "sbi", label: "State Bank of India" },
  { value: "icici", label: "ICICI Bank" },
];

const QUICK_AMOUNTS = [500, 1000, 2500, 5000];

const STEPS = [
  "Choose how much you want to add and pick your bank.",
  "Complete the payment through your bank's transfer flow.",
  "Your balance is credited once the bank confirms.",
];

function CopyTokenButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(token);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
      className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-1.5 py-0.5 text-2xs font-medium text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
    >
      {copied ? <CheckIcon size={11} /> : <CopyIcon size={11} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function AddMoneyPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("hdfc");
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<OnRampResult | null>(null);
  const [simMessage, setSimMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setResult(null);
    setSimMessage("");
    setError("");

    const parsedAmount = Number(amount);
    if (!amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    if (!Number.isInteger(parsedAmount)) {
      setError("Amount must be a whole number of rupees.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/onramp", {
        amount: parsedAmount,
      });

      setResult({
        transactionId: response.data.transactionId,
        amount: response.data.amount,
        token: response.data.token,
        status: response.data.status,
      });

      setAmount("");
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || "Failed to create on-ramp transaction.",
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSimulate(status: "Success" | "Failed") {
    if (!result) return;
    setSimulating(true);
    setSimMessage("");
    try {
      await axios.post("http://localhost:4000/simulate-payment", {
        token: result.token,
        status,
      });

      setResult((prev) => (prev ? { ...prev, status } : null));
      setSimMessage(
        status === "Success"
          ? "Payment approved! Balance credited."
          : "Payment marked as Failed.",
      );
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || "Bank simulation service unavailable.",
        );
      } else {
        setError("Failed to reach bank simulation service.");
      }
    } finally {
      setSimulating(false);
    }
  }

  function reset() {
    setResult(null);
    setSimMessage("");
    setError("");
  }

  const statusCopy =
    result?.status === "Success"
      ? { tone: "success" as const, title: "Payment approved" }
      : result?.status === "Failed"
        ? { tone: "error" as const, title: "Payment declined" }
        : { tone: "warning" as const, title: "Payment pending" };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add money"
        description="Top up your Payloop wallet from your bank account in three quick steps."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        <div className="space-y-4">
          {error ? (
            <Alert tone="error" title={error} onDismiss={() => setError("")} />
          ) : null}

          <Card elevated>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="inline-flex size-7 items-center justify-center rounded-md bg-accent-soft text-accent">
                  <ArrowDownToLineIcon size={15} />
                </span>
                New deposit
              </CardTitle>
              <p className="text-sm text-fg-muted">
                Enter an amount in whole rupees and choose your bank.
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <div className="space-y-2.5">
                  <TextInput
                    label="Amount"
                    name="amount"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    placeholder="500"
                    prefix="₹"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />

                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_AMOUNTS.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAmount(String(value))}
                        className={cn(
                          "tabular h-7 rounded-md border px-2.5 text-xs font-medium transition-colors",
                          amount === String(value)
                            ? "border-accent-line bg-accent-soft text-accent"
                            : "border-line bg-surface text-fg-muted hover:border-line-strong hover:bg-surface-hover hover:text-fg",
                        )}
                      >
                        ₹{value.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>

                <Select
                  label="Bank"
                  name="bank"
                  options={BANKS}
                  hint="Bank selection is used for payment routing simulation."
                  value={bank}
                  onChange={(event) => setBank(event.target.value)}
                />

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={loading}
                  loadingText="Creating transaction…"
                >
                  Add money
                </Button>
              </form>
            </CardContent>
          </Card>

          {result ? (
            <Alert
              tone={statusCopy.tone}
              title={statusCopy.title}
              onDismiss={reset}
            >
              <div className="space-y-3">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-xs text-fg-subtle">Amount</dt>
                    <dd className="tabular text-sm font-semibold text-fg">
                      ₹{result.amount}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-fg-subtle">Status</dt>
                    <dd className="mt-0.5">
                      <StatusBadge status={result.status} />
                    </dd>
                  </div>
                </dl>

                <dl>
                  <dt className="text-xs text-fg-subtle">Payment token</dt>
                  <dd className="mt-1 flex items-center gap-2">
                    <code className="scrollbar-subtle min-w-0 flex-1 overflow-x-auto rounded-md border border-line bg-surface px-2 py-1.5 font-mono text-xs text-fg-muted whitespace-nowrap">
                      {result.token}
                    </code>
                    <CopyTokenButton token={result.token} />
                  </dd>
                </dl>

                {simMessage ? (
                  <p className="flex items-center gap-1.5 text-xs font-medium text-fg">
                    {result.status === "Success" ? (
                      <CheckIcon size={13} className="text-positive" />
                    ) : (
                      <XIcon size={13} className="text-negative" />
                    )}
                    {simMessage}
                  </p>
                ) : null}
              </div>

              {result.status === "Processing" ? (
                <div className="mt-4 rounded-lg border border-line bg-surface/70 p-3.5">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-fg">
                    <LandmarkIcon size={14} className="text-fg-subtle" />
                    Complete payment via bank webhook
                  </p>
                  <p className="mt-1.5 text-xs text-fg-muted">
                    This simulator marks the payment as approved or declined so you
                    can exercise the settlement flow.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSimulate("Success")}
                      disabled={simulating}
                      loading={simulating}
                      loadingText="Simulating…"
                      startIcon={<CheckIcon size={14} />}
                    >
                      Approve payment
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSimulate("Failed")}
                      disabled={simulating}
                      startIcon={<XIcon size={14} />}
                    >
                      Decline payment
                    </Button>
                  </div>

                  <p className="mt-3 flex flex-wrap items-center gap-1 text-xs text-fg-subtle">
                    Or open the bank webhook UI at
                    <a
                      href={`http://localhost:4000/?token=${result.token}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-0.5 rounded font-medium text-accent underline-offset-4 hover:underline"
                    >
                      localhost:4000
                      <ExternalLinkIcon size={11} />
                    </a>
                  </p>
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-line bg-surface/70 px-3.5 py-2.5">
                  <Badge tone="neutral">
                    <RefreshCwIcon size={11} />
                    Settlement complete
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      reset();
                      setAmount(String(result.amount));
                    }}
                  >
                    Start another
                  </Button>
                </div>
              )}
            </Alert>
          ) : null}
        </div>

        <aside className="space-y-4">
          <Card tone="muted">
            <CardHeader>
              <CardTitle className="text-sm">How it works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3.5">
                {STEPS.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-2xs font-semibold text-fg-muted">
                      {index + 1}
                    </span>
                    <p className="text-xs leading-5 text-fg-muted">{step}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card tone="muted">
            <CardHeader>
              <CardTitle className="text-sm">After you add money</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <p className="flex gap-2 text-xs leading-5 text-fg-muted">
                <SendIcon size={14} className="mt-0.5 shrink-0 text-fg-subtle" />
                Send your balance to any Payloop user instantly.
              </p>
              <p className="flex gap-2 text-xs leading-5 text-fg-muted">
                <LandmarkIcon size={14} className="mt-0.5 shrink-0 text-fg-subtle" />
                Bank selection only affects the payment routing simulation.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}