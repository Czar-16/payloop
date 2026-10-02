"use client";

import { useState, type FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Alert } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageHeader,
  StatusBadge,
} from "@repo/ui/card";
import { TextInput } from "@repo/ui/text-input";
import { cn } from "@repo/ui/cn";
import {
  CheckIcon,
  LockIcon,
  SendIcon,
  ShieldCheckIcon,
  UserIcon,
  WalletIcon,
} from "@repo/ui/icons";

interface TransferSuccess {
  transferId: string;
  amount: number;
  recipient: string;
}

const QUICK_AMOUNTS = [100, 250, 500, 1000];

const SAFETY_TIPS = [
  {
    icon: UserIcon,
    text: "Double-check the identifier — transfers to an unknown account cannot be reversed.",
  },
  {
    icon: ShieldCheckIcon,
    text: "Only send to identifiers you trust. Payloop never asks you to share your password.",
  },
  {
    icon: WalletIcon,
    text: "Funds are deducted from your available balance the moment the transfer succeeds.",
  },
];

export default function TransferPage() {
  const router = useRouter();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<TransferSuccess | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccess(null);
    setError("");

    if (!recipient.trim()) {
      setError("Please enter a recipient email or phone number.");
      return;
    }

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
      const response = await axios.post("/api/transfer", {
        recipient: recipient.trim(),
        amount: parsedAmount,
      });

      setSuccess({
        transferId: response.data.transferId,
        amount: response.data.amount,
        recipient: response.data.recipient,
      });

      setRecipient("");
      setAmount("");
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || "Failed to process money transfer.",
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transfer money"
        description="Send money instantly to any Payloop user using their email or phone number."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        <div className="space-y-4">
          {error ? (
            <Alert tone="error" title={error} onDismiss={() => setError("")} />
          ) : null}

          {success ? (
            <Alert
              tone="success"
              title="Transfer successful"
              onDismiss={() => setSuccess(null)}
            >
              <div className="space-y-3">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-xs text-fg-subtle">Amount sent</dt>
                    <dd className="tabular text-sm font-semibold text-fg">
                      ₹{success.amount}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-fg-subtle">Status</dt>
                    <dd className="mt-0.5">
                      <StatusBadge status="Success" />
                    </dd>
                  </div>
                </dl>

                <dl className="mt-0.5">
                  <dt className="text-xs text-fg-subtle">Recipient</dt>
                  <dd className="mt-0.5 truncate text-sm font-medium text-fg">
                    {success.recipient}
                  </dd>
                </dl>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSuccess(null)}
                  startIcon={<CheckIcon size={14} />}
                >
                  Send another transfer
                </Button>
              </div>
            </Alert>
          ) : null}

          <Card elevated>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="inline-flex size-7 items-center justify-center rounded-md bg-accent-soft text-accent">
                  <SendIcon size={15} />
                </span>
                New transfer
              </CardTitle>
              <p className="text-sm text-fg-muted">
                Transfers settle instantly from your available balance.
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <TextInput
                  label="Recipient"
                  name="recipient"
                  type="text"
                  placeholder="rahul@example.com or 9876543210"
                  autoComplete="off"
                  spellCheck={false}
                  value={recipient}
                  onChange={(event) => setRecipient(event.target.value)}
                />

                <div className="space-y-2.5">
                  <TextInput
                    label="Amount"
                    name="amount"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    placeholder="250"
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

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={loading}
                  loadingText="Sending…"
                >
                  Send money
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card tone="muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <LockIcon size={15} className="text-fg-subtle" />
                Before you send
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {SAFETY_TIPS.map((tip) => (
                  <li key={tip.text} className="flex gap-2.5">
                    <tip.icon
                      size={14}
                      className="mt-0.5 shrink-0 text-fg-subtle"
                    />
                    <p className="text-xs leading-5 text-fg-muted">{tip.text}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}