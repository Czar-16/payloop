import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <h1 className="text-xl font-bold">Payloop</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Register
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Modern Digital Wallet & Payment System
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Add money securely via bank transfer, send instant peer-to-peer payments, and track your wallet transactions with ease.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/register"
              className="rounded-md bg-black px-6 py-3 text-base font-semibold text-white hover:bg-gray-800"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-100"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white py-4 text-center text-xs text-gray-500">
        Payloop &copy; {new Date().getFullYear()} — Built with Next.js, Prisma, & Turborepo.
      </footer>
    </div>
  );
}
