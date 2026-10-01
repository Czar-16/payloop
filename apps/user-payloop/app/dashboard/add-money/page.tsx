"use client";

import { useState } from "react";
import axios from "axios";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { TextInput } from "@repo/ui/text-input";

interface OnRampResult {
  transactionId: string;
  amount: number;
  token: string;
  status: string;
}

export default function AddMoneyPage() {
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("hdfc");
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<OnRampResult | null>(null);
  const [simMessage, setSimMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Add Money</h2>

      <Card>
        <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
          <TextInput
            label="Amount (in ₹)"
            name="amount"
            type="number"
            placeholder="Enter amount (e.g. 500)"
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
            value={bank}
            onChange={(event) => setBank(event.target.value)}
          />

          <p className="text-xs text-gray-500">
            Note: Bank selection is used for payment routing simulation.
          </p>

          <Button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Add Money"}
          </Button>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          {result && (
            <div className="mt-2 rounded-md border border-green-200 bg-green-50 p-4">
              <p className="font-semibold text-green-800">
                On-ramp transaction created successfully!
              </p>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  <strong>Amount:</strong> ₹{result.amount}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`rounded px-1.5 py-0.5 font-medium ${
                      result.status === "Success"
                        ? "bg-green-200 text-green-800"
                        : result.status === "Failed"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {result.status}
                  </span>
                </p>
                <p className="mt-1 break-all text-xs font-mono text-gray-600">
                  <strong>Token:</strong> {result.token}
                </p>
              </div>

              {result.status === "Processing" && (
                <div className="mt-4 border-t border-green-200 pt-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    🏦 Complete Payment via Bank Webhook:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSimulate("Success")}
                      disabled={simulating}
                      className="rounded bg-green-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-800 disabled:opacity-50 cursor-pointer"
                    >
                      {simulating ? "Processing..." : "Simulate Success (Approve)"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulate("Failed")}
                      disabled={simulating}
                      className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                    >
                      Simulate Failure (Decline)
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Or open Bank Webhook Web UI at{" "}
                    <a
                      href={`http://localhost:4000/?token=${result.token}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium underline text-blue-600"
                    >
                      http://localhost:4000
                    </a>
                  </p>
                </div>
              )}

              {simMessage && (
                <p className="mt-2 text-xs font-semibold text-green-800">
                  {simMessage}
                </p>
              )}
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
