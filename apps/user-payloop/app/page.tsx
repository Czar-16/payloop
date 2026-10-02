import Link from "next/link";
import { redirect } from "next/navigation";
import type { ComponentType } from "react";

import { auth } from "@/lib/auth";

import { Logo } from "@repo/ui/logo";
import {
  ArrowDownToLineIcon,
  BanknoteIcon,
  ClockIcon,
  LandmarkIcon,
  ReceiptIcon,
  SendIcon,
  ShieldCheckIcon,
  SparklesIcon,
  type IconProps,
} from "@repo/ui/icons";

type Item = {
  icon: ComponentType<IconProps>;
  title: string;
  description: string;
};

const FEATURES: Item[] = [
  {
    icon: LandmarkIcon,
    title: "Top up from your bank",
    description:
      "Pick a bank, get a payment token and complete the transfer. Your balance is credited as soon as the bank confirms.",
  },
  {
    icon: SendIcon,
    title: "Send money instantly",
    description:
      "Transfer to any Payloop user with just their email or phone number. Funds land in their wallet right away.",
  },
  {
    icon: ReceiptIcon,
    title: "Track every rupee",
    description:
      "A single history of deposits, outgoing and incoming transfers, with status and reference tokens.",
  },
];

const STEPS: Item[] = [
  {
    icon: SparklesIcon,
    title: "Create your wallet",
    description:
      "Register with an email or phone number. No card details required.",
  },
  {
    icon: BanknoteIcon,
    title: "Add money",
    description:
      "Start a bank transfer and complete the payment to credit your balance.",
  },
  {
    icon: ArrowDownToLineIcon,
    title: "Send it on",
    description: "Pay friends or family and watch both balances update.",
  },
];

const TRANSACTIONS = [
  { name: "Aarav Mehta", note: "Sent", amount: "− ₹1,200.00" },
  { name: "HDFC Bank", note: "Deposit", amount: "+ ₹10,000.00" },
  { name: "Riya Kapoor", note: "Received", amount: "+ ₹450.00" },
];

const btnBase =
  "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";
const btnSolid = `${btnBase} bg-black text-white hover:bg-neutral-800`;
const btnOutline = `${btnBase} border border-black text-black hover:bg-black hover:text-white`;
const btnGhost = `${btnBase} text-black hover:bg-neutral-100`;

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-black bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center rounded-md">
          <Logo />
          <span className="sr-only">Payloop home</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/login" className={`${btnGhost} h-9 px-4 text-sm`}>
            Sign in
          </Link>
          <Link href="/register" className={`${btnSolid} h-9 px-4 text-sm`}>
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function WalletPreview() {
  return (
    <div className="w-full max-w-104 rounded-3xl bg-black p-6 text-white shadow-[10px_10px_0_0_#d4d4d4] sm:w-104 sm:p-7">
      <div className="flex items-center justify-between text-sm text-white/60">
        <span>Wallet balance</span>
        <ShieldCheckIcon size={18} className="text-white" />
      </div>
      <p className="mt-3 text-4xl font-semibold tracking-tight tabular-nums">
        ₹24,850.00
      </p>

      <div className="mt-6 flex gap-3">
        <span className="inline-flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-4 text-sm font-medium text-black">
          <BanknoteIcon size={16} className="shrink-0" />
          Add money
        </span>
        <span className="inline-flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/40 px-4 text-sm font-medium">
          <SendIcon size={16} className="shrink-0" />
          Send
        </span>
      </div>

      <ul className="mt-6 divide-y divide-white/15 border-t border-white/15">
        {TRANSACTIONS.map((t) => (
          <li key={t.name} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-xs text-white/50">{t.note}</p>
            </div>
            <p className="text-sm tabular-nums">{t.amount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white text-black">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black px-3 py-1 text-xs font-medium">
              <ShieldCheckIcon size={14} />
              Bank-grade settlement, zero fees
            </span>

            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
              A wallet that keeps up with how you actually move money.
            </h1>

            <p className="mt-6 max-w-xl text-base text-neutral-600 text-pretty sm:text-lg">
              Add money securely via bank transfer, send instant peer-to-peer
              payments, and track every transaction from one place.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className={`${btnSolid} h-12 px-7 text-base`}
              >
                Create free account
              </Link>
              <Link
                href="/login"
                className={`${btnOutline} h-12 px-7 text-base`}
              >
                Sign in
              </Link>
            </div>

            <p className="mt-5 flex items-center gap-1.5 text-xs text-neutral-500">
              <ClockIcon size={14} />
              Set up in under a minute.
            </p>
          </div>

          <div className="lg:justify-self-end">
            <WalletPreview />
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-black">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16 lg:px-8">
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
                Everything a wallet needs, nothing it doesn&apos;t.
              </h2>
              <p className="mt-4 text-sm text-neutral-600">
                Three focused capabilities, each designed to get out of your
                way.
              </p>
            </div>

            <ul className="divide-y divide-neutral-300 border-y border-neutral-300">
              {FEATURES.map((feature) => (
                <li
                  key={feature.title}
                  className="grid grid-cols-[auto_1fr] gap-x-5 py-6"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-full border border-black">
                    <feature.icon size={18} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold">{feature.title}</h3>
                    <p className="mt-1.5 max-w-lg text-sm leading-6 text-neutral-600 text-pretty">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
              Three steps to your first transfer.
            </h2>
            <p className="mt-4 text-sm text-neutral-600 text-pretty">
              No paperwork, no onboarding queue. Just a wallet and a bank
              account you already trust.
            </p>
          </div>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-black bg-black sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="text-5xl font-semibold tracking-tight tabular-nums">
                    {index + 1}
                  </span>
                  <step.icon size={20} />
                </div>
                <h3 className="mt-10 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600 text-pretty">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Closing CTA */}
        <section className="bg-black text-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-20 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Ready when you are.
              </h2>
              <p className="mt-3 text-sm text-white/60 text-pretty">
                Open a wallet, add money, and send your first transfer today.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className={`${btnBase} h-12 bg-white px-7 text-base text-black hover:bg-neutral-200 focus-visible:outline-white`}
              >
                Create free account
              </Link>
              <Link
                href="/login"
                className={`${btnBase} h-12 border border-white px-7 text-base text-white hover:bg-white hover:text-black focus-visible:outline-white`}
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
