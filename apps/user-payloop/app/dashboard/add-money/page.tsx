"use client";

import { useState } from "react";
import axios from "axios";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { TextInput } from "@repo/ui/text-input";

export default function AddMoneyPage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post("/api/onramp", {
        amount: Number(amount),
      });

      setMessage(
        `Request of adding ₹${response.data.amount} created successfully. Transaction is processing.`,
      );

      setAmount("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error || "Failed to create transaction.",
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
      <h2 className="mb-6 text-2xl font-bold">Add Money</h2>

      <Card>
        <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
          <TextInput
            label="Amount"
            name="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />

          <Select
            label="Bank"
            name="bank"
            options={[
              { value: "hdfc", label: "HDFC Bank" },
              { value: "sbi", label: "State Bank of India" },
              { value: "icici", label: "ICICI Bank" },
            ]}
          />

          <Button type="submit">
            {loading ? "Processing..." : "Add Money"}
          </Button>

          {message && <p className="text-sm text-green-600">{message}</p>}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </Card>
    </div>
  );
}
