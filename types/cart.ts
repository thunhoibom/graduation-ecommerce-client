/**
 * Cart domain types — mirrors Spring Boot backend CartSessionPojo / CartItemPojo
 * Backend base URL: http://localhost:8080
 */

import type { ProductImage } from "./product";

// ─── Cart Session ─────────────────────────────────────────────────────────────

export interface Cart {
  id?: number;
  token: string;
  items: CartItem[];
  subtotal: number;           // VND (integer)
  itemCount: number;
  totalUnits: number;
  appliedDiscountCode?: string;
  discountAmount?: number;    // VND (integer)
  totalAfterDiscount?: number;
  appliedPromotionsJson?: string;
  createdAt?: string;
  updatedAt?: string;
  expiresAt?: string;
  expired?: boolean;
}

export interface AppliedPromotionLine {
  promotionRuleId?: number;
  name?: string;
  discountAmount?: number;
  freeShipping?: boolean;
  couponCode?: string;
}

export interface CartPricingResult {
  subtotal: number;
  discountAmount: number;
  totalAfterDiscount: number;
  freeShipping?: boolean;
  appliedPromotions?: AppliedPromotionLine[];
  appliedDiscountCode?: string;
}

// ─── Cart Item ────────────────────────────────────────────────────────────────

export interface CartItem {
  id?: number;
  sessionToken?: string;
  variantSku: string;
  quantity: number;
  variantSkuResolved?: string;
  variantSize?: string;
  variantColor?: string;
  productName: string;
  productBarcode: string;
  productBasePrice: number;   // VND
  priceModifier?: number;     // VND
  unitPrice: number;          // VND
  lineTotal: number;          // VND
  availableStock?: number;
  inStock?: boolean;
  primaryImageUrl?: string;
  active?: boolean;
  addedAt?: string;
  updatedAt?: string;
}

// ─── Stock Reservation ────────────────────────────────────────────────────────

export interface StockReservation {
  id?: number;
  sessionId: string;
  variantSku: string;
  variantSkuResolved?: string;
  variantSize?: string;
  variantColor?: string;
  productName?: string;
  productBarcode?: string;
  quantity: number;
  status?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Request payloads ─────────────────────────────────────────────────────────

export interface AddToCartPayload {
  variantSku: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}
