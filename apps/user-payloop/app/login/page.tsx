"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/text-input";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        identifier: identifier.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email/phone or password.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b bg-white px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          Payloop
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Center>
          <Card>
            <div className="w-80 sm:w-96">
              <h2 className="mb-6 text-center text-2xl font-bold">Sign In</h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <TextInput
                  label="Email or Phone Number"
                  name="identifier"
                  type="text"
                  placeholder="user@example.com or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />

                <TextInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                {error && (
                  <p className="text-center text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}

                <p className="mt-4 text-center text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="font-semibold underline">
                    Register
                  </Link>
                </p>
              </form>
            </div>
          </Card>
        </Center>
      </div>
    </div>
  );
}
