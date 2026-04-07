import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Metadata } from "next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Base URL ──────────────────────────────────────────────────────────────────

export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

// ─── URL helpers ──────────────────────────────────────────────────────────────

export function createUrl(
  pathname: string,
  params: URLSearchParams | Record<string, string | string[]>
): string {
  const searchParams =
    params instanceof URLSearchParams
      ? params
      : new URLSearchParams(
          Object.entries(params).flatMap(([k, v]) =>
            Array.isArray(v)
              ? v.map((w) => [k, w] as [string, string])
              : [[k, v] as [string, string]]
          )
        );
  return `${pathname}?${searchParams.toString()}`;
}

// ─── Metadata helpers ────────────────────────────────────────────────────────

export function constructMetadata(
  opts: Metadata & { overrideTitle?: string }
): Metadata {
  return {
    ...opts,
    title: opts.overrideTitle ?? opts.title,
  };
}

// ─── Money formatter ──────────────────────────────────────────────────────────

export function formatMoney(amount: number, currency = "VND"): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

// ─── Class name alias ─────────────────────────────────────────────────────────

export { cn as cx };
