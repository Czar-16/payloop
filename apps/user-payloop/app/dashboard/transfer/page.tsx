"use client";

import { useState } from "react";
import axios from "axios";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/text-input";

interface TransferSuccess {
  transferId: string;
  amount: number;
  recipient: string;
}

export default function TransferPage() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<TransferSuccess | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
    <div>
      <h2 className="mb-6 text-2xl font-bold">Transfer Money</h2>

      <Card>
        <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
          <TextInput
            label="Recipient (Email or Phone)"
            name="recipient"
            type="text"
            placeholder="Enter recipient email or phone"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
          />

          <TextInput
            label="Amount (in ₹)"
            name="amount"
            type="number"
            placeholder="Enter amount (e.g. 250)"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Money"}
          </Button>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          {success && (
            <div className="mt-2 rounded-md border border-green-200 bg-green-50 p-4">
              <p className="font-semibold text-green-800">
                Transfer successful!
              </p>
              <p className="mt-1 text-sm text-green-700">
                Sent <strong>₹{success.amount}</strong> to{" "}
                <strong>{success.recipient}</strong>.
              </p>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
