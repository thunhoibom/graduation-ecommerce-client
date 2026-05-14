/**
 * Checkout REST API service
 * Connects to Spring Boot backend at http://localhost:8080
 *
 * OpenAPI endpoints:
 *   GET  /api/public/shipping/methods    — active shipping methods
 *   GET  /api/public/discount/validate  — validate a discount code
 *   POST /api/public/checkout/initiate  — create order → send OTP email
 *   POST /api/public/checkout/verify-otp — verify OTP → get payment redirect URL
 *   POST /api/public/checkout            — (legacy) create order without OTP
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
  CheckoutOtpInitiateResponse,
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

export interface MockShippingTrackingPayload {
  shipper_code?: string;
  tracking_number: string;
  order_id: number;
  status: string;
  location?: string;
  description?: string;
  event_time: string;
}

export interface MockShippingTrackingResponse {
  message: string;
  trackingId: number;
  orderId: number;
  trackingNumber: string;
  rawStatus: string;
  mappedAction: string;
  eventTime: string;
  location?: string;
  description?: string;
}

export interface MockShippingOrderOption {
  id: number;
  date?: string;
  fulfillmentStatus?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  totalValue?: number;
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

export async function sendMockShippingTrackingWebhook(
  payload: MockShippingTrackingPayload
): Promise<MockShippingTrackingResponse> {
  const { data } = await api.post<MockShippingTrackingResponse>(
    "/api/public/mock/shipping/tracking",
    payload
  );
  return data;
}

export async function listMockShippingOrders(limit = 20): Promise<MockShippingOrderOption[]> {
  const { data } = await api.get<MockShippingOrderOption[]>("/api/public/mock/shipping/orders", {
    params: { limit },
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

/** Create order and email OTP — session token via X-Session-Token cookie header. */
export async function initiateCheckoutOtp(
  payload: CheckoutStartPayload
): Promise<CheckoutOtpInitiateResponse> {
  const { data } = await api.post<CheckoutOtpInitiateResponse>(
    "/api/public/checkout/initiate",
    payload
  );
  return data;
}

export async function verifyCheckoutOtp(
  orderId: number,
  otpCode: string
): Promise<PaymentRedirectionDetails> {
  const { data } = await api.post<PaymentRedirectionDetails>(
    "/api/public/checkout/verify-otp",
    { orderId, otpCode }
  );
  return data;
}

export async function resendCheckoutOtp(
  orderId: number,
  email: string
): Promise<CheckoutOtpInitiateResponse> {
  const { data } = await api.post<CheckoutOtpInitiateResponse>(
    "/api/public/checkout/resend-otp",
    { orderId, email }
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