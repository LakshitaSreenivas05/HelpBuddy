import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs);
}

export function formatCurrency(
  value: number | null | undefined,
  locales: string | string[] = "en-US",
  currency = "USD",
) {
  if (value === null || value === undefined) return "N/A";

  return new Intl.NumberFormat(locales, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateTime(
  value: Date | string | null | undefined,
  locales: string | string[] = "en-US",
  withTime = true,
) {
  if (!value) return "N/A";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat(locales, {
    dateStyle: "medium",
    timeStyle: withTime ? "short" : undefined,
  }).format(date);
}

export function splitCommaSeparated(value: string | undefined | null) {
  if (!value?.length) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

