import type { AppliedPromotionLine } from "@/types/cart";

export function parseAppliedPromotions(raw?: string): AppliedPromotionLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((line): line is AppliedPromotionLine => !!line && typeof line === "object");
  } catch {
    return [];
  }
}

export function getPromotionReason(line: AppliedPromotionLine): string {
  if (line.couponCode) {
    return `Mã giảm giá: ${line.couponCode}`;
  }
  if (line.name?.trim()) {
    return line.name.trim();
  }
  return "Ưu đãi tự động";
}
