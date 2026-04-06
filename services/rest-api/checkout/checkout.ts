/**
 * Checkout REST API service
 */

import { api } from "../app-api";
import type { ShippingMethod, DiscountCode } from "@/types/common";
import type { Order } from "@/types/order";
import type { Cart } from "@/types/cart";

/** GET /checkout/shipping-methods — available shipping options */
export async function getShippingMethods(): Promise<ShippingMethod[]> {
  const { data } = await api.get<ShippingMethod[]>("/checkout/shipping-methods");
  return data;
}

/** POST /checkout/apply-discount — apply discount code to cart */
export async function applyDiscountCode(
  cartId: number,
  code: string
): Promise<Cart> {
  const { data } = await api.post<Cart>("/checkout/apply-discount", {
    cartId,
    code,
  });
  return data;
}

/** DELETE /checkout/remove-discount — remove discount from cart */
export async function removeDiscountCode(cartId: number): Promise<Cart> {
  const { data } = await api.delete<Cart>(`/checkout/remove-discount/${cartId}`);
  return data;
}

/** POST /checkout/validate-discount — check if discount code is valid */
export async function validateDiscountCode(
  code: string
): Promise<DiscountCode | null> {
  try {
    const { data } = await api.get<DiscountCode>(
      `/checkout/validate-discount?code=${code}`
    );
    return data;
  } catch {
    return null;
  }
}

/** POST /checkout/initiate — start checkout session / payment */
export async function initiateCheckout(cartId: number): Promise<{
  checkoutUrl?: string;
  paymentUrl?: string;
  orderId?: number;
  sessionToken?: string;
}> {
  const { data } = await api.post("/checkout/initiate", { cartId });
  return data;
}
