/** Mirrors backend PublicPromotionSummaryPojo / PromotionScope */
export type PromotionScope = "PRODUCT" | "CATEGORY" | "CART" | "SHIPPING";

export interface PublicPromotionSummary {
  id?: number;
  name?: string;
  scope?: PromotionScope;
  effectsSummary?: string;
  conditionsSummary?: string;
  reflectedInProductPrice?: boolean;
  /** ISO-8601 string when Jackson serializes LocalDateTime */
  activeUntil?: string;
}
