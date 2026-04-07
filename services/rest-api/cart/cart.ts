/**
 * Cart REST API service
 * Connects to Spring Boot backend at http://localhost:8080
 *
 * OpenAPI endpoints (from apidocs.md):
 *   GET  /public/cart                  — get current cart (creates session if none)
 *   DELETE /public/cart               — clear entire cart
 *   POST /public/cart/items            — add item (body: { variantSku, quantity })
 *   PATCH /public/cart/items/{variantSku} — update item quantity
 *   DELETE /public/cart/items/{variantSku} — remove item
 *   GET  /public/cart/validate         — validate stock availability (optional)
 *   POST /public/cart/reservations     — reserve stock (optional)
 *   DELETE /public/cart/reservations   — release all reservations
 *   GET  /public/cart/reservations     — list active reservations
 *   PATCH /public/cart/reservations   — update reservation qty
 *   DELETE /public/cart/reservations/{variantSku} — release single reservation
 *   POST /public/cart/reservations/confirm — confirm reservations (payment success)
 */

import { api } from "../app-api";
import type { Cart } from "@/types/cart";

// ─── Internal helpers ─────────────────────────────────────────────────────────

function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("cart_session_token="))
      ?.split("=")[1] ?? null
  );
}

function setSessionToken(token: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `cart_session_token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

function clearSessionToken(): void {
  if (typeof document === "undefined") return;
  document.cookie = "cart_session_token=; path=/; max-age=0";
}

// ─── Core cart operations ─────────────────────────────────────────────────────

/** GET /public/cart — fetch current cart (creates session if none) */
export async function getCart(): Promise<Cart | null> {
  try {
    const token = getSessionToken();
    const headers: Record<string, string> = {};
    if (token) headers["X-Session-Token"] = token;

    const { data } = await api.get<Cart>("/api/public/cart", { headers });
    if (data?.token) setSessionToken(data.token);
    return data;
  } catch {
    return null;
  }
}

/** DELETE /public/cart — clear entire cart */
export async function clearCart(): Promise<void> {
  const token = getSessionToken();
  const headers: Record<string, string> = {};
  if (token) headers["X-Session-Token"] = token;

  await api.delete("/api/public/cart", { headers });
  clearSessionToken();
}

// ─── Cart items ──────────────────────────────────────────────────────────────

/** POST /public/cart/items */
export async function addToCart(payload: {
  variantSku: string;
  quantity: number;
}): Promise<Cart> {
  const token = getSessionToken();
  const headers: Record<string, string> = {};
  if (token) headers["X-Session-Token"] = token;

  const { data } = await api.post<Cart>("/api/public/cart/items", payload, { headers });
  return data;
}

/** PATCH /public/cart/items/{variantSku} */
export async function updateCartItem(
  variantSku: string,
  quantity: number
): Promise<Cart> {
  const token = getSessionToken();
  const headers: Record<string, string> = {};
  if (token) headers["X-Session-Token"] = token;

  const { data } = await api.patch<Cart>(`/api/public/cart/items/${variantSku}`, {
    quantity,
  }, { headers });
  return data;
}

/** DELETE /public/cart/items/{variantSku} */
export async function removeFromCart(variantSku: string): Promise<Cart> {
  const token = getSessionToken();
  const headers: Record<string, string> = {};
  if (token) headers["X-Session-Token"] = token;

  const { data } = await api.delete<Cart>(`/api/public/cart/items/${variantSku}`, {
    headers,
  });
  return data;
}
