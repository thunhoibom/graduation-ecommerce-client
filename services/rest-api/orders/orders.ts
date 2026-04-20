/**
 * Order REST API service
 * Connects to Spring Boot backend at http://localhost:8080
 *
 * Admin endpoints (from apidocs.md):
 *   GET  /data/orders                    — list orders (paginated, admin only)
 *   GET  /data/orders/{buyOrder}        — order detail (admin only)
 *   POST /data/orders                    — create order (admin)
 *   POST /data/orders/cancellation        — cancel order (admin)
 *   POST /data/orders/completion          — mark completed (admin)
 *   POST /data/orders/confirmation        — confirm order (admin)
 *
 * Customer endpoints (AccountOrdersController):
 *   GET  /account/orders                 — list logged-in customer's orders
 *   GET  /account/orders/{buyOrder}      — detail of logged-in customer's order
 */

import { api } from "../app-api";
import type { OrderPojo } from "@/types/order";
import type { PaginatedResponse } from "@/types/api";

/** GET /account/orders — list logged-in customer's orders */
export async function getMyOrders(params: { pageIndex?: number; pageSize?: number } = {}): Promise<PaginatedResponse<OrderPojo>> {
  const { data } = await api.get<PaginatedResponse<OrderPojo>>("/api/account/orders", {
    params: {
      pageIndex: params.pageIndex ?? 0,
      pageSize: params.pageSize ?? 20,
    },
  });
  return data;
}

/** GET /account/orders/{buyOrder} — detail of logged-in customer's specific order */
export async function getMyOrder(buyOrder: number): Promise<OrderPojo> {
  const { data } = await api.get<OrderPojo>(`/api/account/orders/${buyOrder}`);
  return data;
}

/** POST /data/orders/cancellation — cancel order */
export async function cancelOrder(
  buyOrder: number
): Promise<OrderPojo> {
  const { data } = await api.post<OrderPojo>(`/api/data/orders/cancellation`, {
    buyOrder,
  });
  return data;
}

/** POST /data/orders/completion — mark order completed */
export async function completeOrder(
  buyOrder: number
): Promise<OrderPojo> {
  const { data } = await api.post<OrderPojo>(`/api/data/orders/completion`, {
    buyOrder,
  });
  return data;
}

/** POST /data/orders/confirmation — confirm order */
export async function confirmOrder(
  buyOrder: number
): Promise<OrderPojo> {
  const { data } = await api.post<OrderPojo>(`/api/data/orders/confirmation`, {
    buyOrder,
  });
  return data;
}
