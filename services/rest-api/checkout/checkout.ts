/**
 * Checkout REST API service
 * Connects to Spring Boot backend at http://localhost:8080
 *
 * OpenAPI endpoints (from apidocs.md):
 *   GET  /public/shipping/methods         — active shipping methods
 *   GET  /public/discount/validate        — validate a discount code
 *   POST /public/checkout                 — submit cart → create order → get payment redirect
 *   GET  /public/checkout/validate        — validate successful payment (TBK_TOKEN)
 *   POST /public/checkout/validate        — submit failed/aborted checkout
 *   GET  /public/receipt/{token}          — order receipt after completion
 */

import { api } from "../app-api";
import type { ShippingMethod, DiscountValidationResult } from "@/types/common";
import type { Receipt } from "@/types/checkout";

// ─── Shipping Methods ─────────────────────────────────────────────────────────

/** GET /public/shipping/methods — active shipping methods */
export async function getShippingMethods(): Promise<ShippingMethod[]> {
  const { data } = await api.get<ShippingMethod[]>("/api/public/shipping/methods");
  return data ?? [];
}

// ─── Discount Validation ──────────────────────────────────────────────────────

/** GET /public/discount/validate?code=xxx */
export async function validateDiscountCode(
  code: string
): Promise<DiscountValidationResult> {
  const { data } = await api.get<DiscountValidationResult>(
    "/api/public/discount/validate",
    { params: { code } }
  );
  return data;
}

// ─── Checkout / Payment ───────────────────────────────────────────────────────

/**
 * POST /public/checkout
 * Submit cart to create order and get payment redirect URL.
 * Cart token is sent automatically via X-Session-Token cookie or header.
 */
export async function initiateCheckout(payload?: {
  cartSessionToken?: string;
  shippingMethodId?: number;
  discountCode?: string;
}): Promise<PaymentRedirectionDetails> {
  const { data } = await api.post<PaymentRedirectionDetails>(
    "/api/public/checkout",
    payload ?? {}
  );
  return data;
}

/** GET /public/checkout/validate?transactionData — verify successful payment */
export async function validateSuccessfulPayment(
  transactionData: Record<string, string>
): Promise<void> {
  await api.get("/api/public/checkout/validate", { params: { transactionData } });
}

/** POST /public/checkout/validate — submit failed/aborted payment state */
export async function validateAbortedPayment(
  transactionData: Record<string, string>
): Promise<void> {
  await api.post("/api/public/checkout/validate", null, {
    params: { transactionData },
  });
}

// ─── Receipt ──────────────────────────────────────────────────────────────────

/** GET /public/receipt/{token} */
export async function getReceipt(token: string): Promise<Receipt> {
  const { data } = await api.get<Receipt>(`/api/public/receipt/${token}`);
  return data;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaymentRedirectionDetails {
  url?: string;
  token?: string;
  buyOrder?: number;
}
