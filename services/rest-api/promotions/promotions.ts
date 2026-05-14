import { api } from "../app-api";
import type { PublicPromotionSummary } from "@/types/promotion";

const BASE =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081"
    : "http://localhost:8081";

/** Client / hooks — axios instance */
export async function getPublicPromotions(opts?: {
  productBarcode?: string;
}): Promise<PublicPromotionSummary[]> {
  try {
    const params =
      opts?.productBarcode != null && opts.productBarcode.trim() !== ""
        ? { productBarcode: opts.productBarcode.trim() }
        : undefined;
    const { data } = await api.get<PublicPromotionSummary[]>("/api/public/promotions", {
      params,
    });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** Server Components — không gắn cookie giỏ */
export async function fetchPublicPromotions(opts?: {
  productBarcode?: string;
  revalidateSeconds?: number;
}): Promise<PublicPromotionSummary[]> {
  const q =
    opts?.productBarcode != null && opts.productBarcode.trim() !== ""
      ? `?productBarcode=${encodeURIComponent(opts.productBarcode.trim())}`
      : "";
  try {
    const res = await fetch(`${BASE.replace(/\/$/, "")}/api/public/promotions${q}`, {
      next: { revalidate: opts?.revalidateSeconds ?? 120 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
