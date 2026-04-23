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

export interface GhnProvince {
  provinceId: number;
  provinceName: string;
}

export interface GhnDistrict {
  districtId: number;
  provinceId: number;
  districtName: string;
}

export interface GhnWard {
  wardCode: string;
  districtId: number;
  wardName: string;
}

// ─── Shipping Methods ─────────────────────────────────────────────────────────

/** GET /api/public/shipping/methods — active shipping methods */
export async function getShippingMethods(
  subtotal?: number,
  latitude?: number,
  longitude?: number,
  toDistrictId?: number,
  toWardCode?: string
): Promise<ShippingMethod[]> {
  const { data } = await api.get<ShippingMethod[]>("/api/public/shipping/methods", {
    params: { subtotal, latitude, longitude, toDistrictId, toWardCode }
  });
  return data ?? [];
}

export async function getGhnProvinces(): Promise<GhnProvince[]> {
  const { data } = await api.get<GhnProvince[]>("/api/public/shipping/ghn/provinces");
  return data ?? [];
}

export async function getGhnDistricts(provinceId: number): Promise<GhnDistrict[]> {
  const { data } = await api.get<GhnDistrict[]>("/api/public/shipping/ghn/districts", {
    params: { provinceId },
  });
  return data ?? [];
}

export async function getGhnWards(districtId: number): Promise<GhnWard[]> {
  const { data } = await api.get<GhnWard[]>("/api/public/shipping/ghn/wards", {
    params: { districtId },
  });
  return data ?? [];
}

// ─── Discount Validation ──────────────────────────────────────────────────────

/** GET /api/public/discount/validate?code=xxx&subtotal=123000 */
export async function validateDiscountCode(
  code: string,
  subtotal: number
): Promise<DiscountValidationResult> {
  const { data } = await api.get<DiscountValidationResult>(
    "/api/public/discount/validate",
    { params: { code, subtotal } }
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