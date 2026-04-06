/**
 * Order REST API service
 */

import { api } from "../app-api";
import type { Order, OrderSummary } from "@/types/order";
import type { PaginatedResponse } from "@/types/api";

/** POST /orders — create order from cart */
export async function createOrder(payload: {
  cartId: number;
  shippingMethodId?: number;
  shippingAddressId?: number;
  billingAddressId?: number;
  notes?: string;
  paymentMethod?: string;
}): Promise<Order> {
  const { data } = await api.post<Order>("/orders", payload);
  return data;
}

/** GET /orders — list orders for logged-in customer */
export async function getOrders(
  page = 1,
  pageSize = 10
): Promise<PaginatedResponse<OrderSummary>> {
  const { data } = await api.get<PaginatedResponse<OrderSummary>>(
    `/orders?page=${page}&pageSize=${pageSize}`
  );
  return data;
}

/** GET /orders/{id} — get order detail */
export async function getOrder(orderId: number): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${orderId}`);
  return data;
}

/** POST /orders/{id}/cancel — cancel order */
export async function cancelOrder(orderId: number): Promise<Order> {
  const { data } = await api.post<Order>(`/orders/${orderId}/cancel`);
  return data;
}
