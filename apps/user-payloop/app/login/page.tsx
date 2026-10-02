"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Logo } from "@repo/ui/logo";

const inputClass =
  "h-12 w-full rounded-xl border border-black bg-white px-4 text-base text-black placeholder:text-neutral-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-black">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    <div className="grid min-h-dvh bg-white text-black lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Brand panel */}
      <aside className="hidden flex-col justify-between bg-black p-12 text-white lg:flex">
        <Link href="/" className="inline-flex w-fit items-center rounded-md">
          <Logo />
          <span className="sr-only">Payloop home</span>
        </Link>

        <div>
          <h2 className="max-w-md text-5xl font-semibold tracking-[-0.04em] text-balance">
            Good to see you again.
          </h2>
          <p className="mt-5 max-w-sm text-base text-white/60 text-pretty">
            Pick up where you left off. Your balance and transaction history are
            waiting.
          </p>
        </div>

        <p className="text-xs text-white/40">
          Payloop © {new Date().getFullYear()}
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col">
        <div className="flex h-16 items-center justify-between px-4 sm:px-8 lg:justify-end">
          <Link
            href="/"
            className="inline-flex items-center rounded-md lg:hidden"
          >
            <Logo />
            <span className="sr-only">Payloop home</span>
          </Link>
          <p className="text-sm text-neutral-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-black underline underline-offset-4"
            >
              Create one
            </Link>
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pt-6 pb-16 sm:px-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Welcome back
            </h1>
            <p className="mt-3 text-sm text-neutral-600">
              Sign in to your Payloop wallet to continue.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-5"
              noValidate
            >
              {error ? (
                <div
                  role="alert"
                  className="flex items-start justify-between gap-3 rounded-xl border border-black bg-black px-4 py-3 text-sm text-white"
                >
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => setError("")}
                    aria-label="Dismiss error"
                    className="shrink-0 text-white/70 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              ) : null}

              <Field label="Email or phone number" htmlFor="identifier">
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="user@example.com or 9876543210"
                  autoComplete="username"
                  spellCheck={false}
                  className={inputClass}
                  disabled={loading}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </Field>

              <Field label="Password" htmlFor="password">
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`${inputClass} pr-16`}
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-4 text-sm font-medium text-neutral-600 hover:text-black"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-black text-base font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
