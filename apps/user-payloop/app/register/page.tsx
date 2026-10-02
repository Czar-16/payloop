"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Logo } from "@repo/ui/logo";

const inputClass =
  "h-12 w-full rounded-xl border border-black bg-white px-4 text-base text-black placeholder:text-neutral-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50";

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-black">
        {label}
        {hint ? (
          <span className="ml-1.5 font-normal text-neutral-500">{hint}</span>
        ) : null}
      </label>
      {children}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    <div className="grid min-h-dvh bg-white text-black lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Brand panel */}
      <aside className="hidden flex-col justify-between bg-black p-12 text-white lg:flex">
        <Link href="/" className="inline-flex w-fit items-center rounded-md">
          <Logo />
          <span className="sr-only">Payloop home</span>
        </Link>

        <div>
          <h2 className="max-w-md text-5xl font-semibold tracking-[-0.04em] text-balance">
            Your money, moving at your speed.
          </h2>
          <p className="mt-5 max-w-sm text-base text-white/60 text-pretty">
            Add money from your bank, send it to anyone with an email or phone
            number, and see every transaction in one place.
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
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-black underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pt-6 pb-16 sm:px-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Create your account
            </h1>
            <p className="mt-3 text-sm text-neutral-600">
              Set up a Payloop wallet in under a minute.
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

              <Field label="Full name" htmlFor="name">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Rahul Kumar"
                  autoComplete="name"
                  className={inputClass}
                  disabled={loading}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>

              <Field label="Email" htmlFor="email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="rahul@example.com"
                  autoComplete="email"
                  spellCheck={false}
                  className={inputClass}
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field label="Phone number" htmlFor="phone">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                  autoComplete="tel"
                  inputMode="numeric"
                  className={inputClass}
                  disabled={loading}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>

              <p className="-mt-2 text-xs text-neutral-500">
                An email or a phone number is required. The other is optional.
              </p>

              <Field label="Password" htmlFor="password">
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 4 characters"
                    autoComplete="new-password"
                    minLength={4}
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
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
