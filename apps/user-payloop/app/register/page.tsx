"use client";

import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/text-input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setError("Please provide either an email or a phone number.");
      return;
    }

    if (!password || password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/register", {
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        password,
      });

      const identifier = email.trim() || phone.trim();
      const res = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (res?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || "Registration failed. Please try again.",
        );
      } else {
        setError("Something went wrong.");
      }
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
              <h2 className="mb-6 text-center text-2xl font-bold">Create Account</h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <TextInput
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="Rahul Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <TextInput
                  label="Email (Optional if Phone provided)"
                  name="email"
                  type="email"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <TextInput
                  label="Phone Number (Optional if Email provided)"
                  name="phone"
                  type="text"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <TextInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="At least 4 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button type="submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Register"}
                </Button>

                {error && (
                  <p className="text-center text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}

                <p className="mt-4 text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold underline">
                    Sign In
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
