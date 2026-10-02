const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeZone: "Asia/Kolkata",
});

/** `₹1,25,000` — Indian digit grouping, no decimals since amounts are rupees. */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/** Splits a formatted amount into sign + body so the sign can be styled apart. */
export function formatSignedAmount(value: number, direction: "in" | "out"): {
  prefix: string;
  amount: string;
} {
  return {
    prefix: direction === "out" ? "−" : "+",
    amount: currencyFormatter.format(Math.abs(value)),
  };
}

export function formatDateTime(value: Date | string): string {
  return dateTimeFormatter.format(new Date(value));
}

export function formatDate(value: Date | string): string {
  return dateFormatter.format(new Date(value));
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["second", 60],
  ["minute", 60],
  ["hour", 24],
  ["day", 7],
  ["week", 4.348],
  ["month", 12],
  ["year", Number.POSITIVE_INFINITY],
];

const relativeFormatter = new Intl.RelativeTimeFormat("en-IN", {
  numeric: "auto",
  style: "short",
});

/**
 * Server-rendered only — the result depends on the current time, so it must
 * not be used in a client component that would hydrate against a stale value.
 */
export function formatRelative(value: Date | string): string {
  const deltaSeconds = (new Date(value).getTime() - Date.now()) / 1000;
  const absolute = Math.abs(deltaSeconds);

  if (absolute < 45) return "Just now";

  let unit: Intl.RelativeTimeFormatUnit = "second";
  let amount = deltaSeconds;

  for (const [candidateUnit, size] of RELATIVE_UNITS) {
    unit = candidateUnit;
    if (absolute < size) break;
    amount = deltaSeconds / size;
  }

  return relativeFormatter.format(Math.round(amount), unit);
}