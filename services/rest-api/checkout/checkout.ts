/**
 * Checkout REST API service
 * Connects to Spring Boot backend at http://localhost:8080
 *
 * OpenAPI endpoints:
 *   GET  /api/public/shipping/methods    — active shipping methods
 *   GET  /api/public/discount/validate  — validate a discount code
 *   POST /api/public/checkout            — create order → get payment redirect URL
 *   GET  /api/public/checkout/validate  — payment success callback (Webpay)
 *   POST /api/public/checkout/validate  — payment failed/aborted callback
 *   GET  /api/public/receipt/{token}    — order receipt after completion
 */

import { api } from "../app-api";
import type { ShippingMethod, DiscountValidationResult } from "@/types/common";
import type {
  Receipt,
  CheckoutStartPayload,
  PaymentRedirectionDetails,
} from "@/types/checkout";

// ─── Shipping Methods ─────────────────────────────────────────────────────────

/** GET /api/public/shipping/methods — active shipping methods */
export async function getShippingMethods(): Promise<ShippingMethod[]> {
  const { data } = await api.get<ShippingMethod[]>("/api/public/shipping/methods");
  return data ?? [];
}

// ─── Discount Validation ──────────────────────────────────────────────────────

/** GET /api/public/discount/validate?code=xxx */
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
 * POST /api/public/checkout
 * Submit cart → create order → get Webpay redirect URL.
 * Cart token is sent via X-Session-Token header (managed by cookie in cart.ts).
 */
export async function initiateCheckout(
  payload: CheckoutStartPayload
): Promise<PaymentRedirectionDetails> {
  const { data } = await api.post<PaymentRedirectionDetails>(
    "/api/public/checkout",
    payload
  );
  return data;
}

/** GET /api/public/checkout/validate?transactionData — verify successful payment */
export async function validateSuccessfulPayment(
  transactionData: Record<string, string>
): Promise<void> {
  await api.get("/api/public/checkout/validate", { params: { transactionData } });
}

/** POST /api/public/checkout/validate — submit failed/aborted checkout state */
export async function validateAbortedPayment(
  transactionData: Record<string, string>
): Promise<void> {
  await api.post("/api/public/checkout/validate", null, {
    params: { transactionData },
  });
}

// ─── Receipt ──────────────────────────────────────────────────────────────────

/** GET /api/public/receipt/{token} */
export async function getReceipt(token: string): Promise<Receipt> {
  const { data } = await api.get<Receipt>(`/api/public/receipt/${token}`);
  return data;
}