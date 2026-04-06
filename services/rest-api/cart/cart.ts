/**
 * Cart REST API service
 */

import { api } from "../app-api";
import { getCartId, setCartId } from "../app-api";
import type { Cart, AddToCartPayload, UpdateCartItemPayload, RemoveCartItemPayload } from "@/types/cart";

/** GET /carts/{id} — get cart by ID (reads from cookie) */
export async function getCart(): Promise<Cart | null> {
  const cartId = getCartId();
  if (!cartId) return null;

  try {
    const { data } = await api.get<Cart>(`/carts/${cartId}`);
    return data;
  } catch {
    return null;
  }
}

/** POST /carts — create a new cart session */
export async function createCart(): Promise<Cart> {
  const { data } = await api.post<Cart>("/carts");
  setCartId(String(data.id));
  return data;
}

/** POST /carts/{id}/items — add item to cart */
export async function addToCart(
  cartId: number,
  payload: Omit<AddToCartPayload, "cartId">
): Promise<Cart> {
  const { data } = await api.post<Cart>(`/carts/${cartId}/items`, payload);
  return data;
}

/** PUT /carts/{id}/items/{itemId} — update item quantity */
export async function updateCartItem(
  cartId: number,
  itemId: number,
  quantity: number
): Promise<Cart> {
  const { data } = await api.put<Cart>(`/carts/${cartId}/items/${itemId}`, {
    quantity,
  });
  return data;
}

/** DELETE /carts/{id}/items/{itemId} — remove item from cart */
export async function removeFromCart(
  cartId: number,
  itemId: number
): Promise<Cart> {
  const { data } = await api.delete<Cart>(`/carts/${cartId}/items/${itemId}`);
  return data;
}

/** DELETE /carts/{id} — clear entire cart */
export async function clearCart(cartId: number): Promise<void> {
  await api.delete(`/carts/${cartId}`);
}
