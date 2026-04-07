/**
 * Order REST API service
 * Connects to Spring Boot backend at http://localhost:8080
 *
 * Admin endpoints (from apidocs.md):
 *   GET  /data/orders                    — list orders (paginated)
 *   GET  /data/orders/{buyOrder}        — order detail
 *   POST /data/orders                    — create order (admin)
 *   POST /data/orders/cancellation        — cancel order
 *   POST /data/orders/completion          — mark completed
 *   POST /data/orders/confirmation        — confirm order
 *
 * NOTE: No public customer order endpoints in current spec.
 * Customer order history may require a new backend endpoint.
 */

import { api } from "../app-api";
import type { OrderPojo } from "@/types/order";
import type { PaginatedResponse } from "@/types/api";

/** GET /data/orders — list orders (admin, paginated) */
export async function getOrders(
  params: {
    page?: number;
    pageSize?: number;
    status?: string;
    allRequestParams?: Record<string, string>;
  } = {}
): Promise<PaginatedResponse<OrderPojo>> {
  const { data } = await api.get<PaginatedResponse<OrderPojo>>("/api/data/orders", {
    params: params.allRequestParams ?? {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      ...(params.status ? { status: params.status } : {}),
    },
  });
  return data;
}

/** GET /data/orders/{buyOrder} — order detail */
export async function getOrder(buyOrder: number): Promise<OrderPojo> {
  const { data } = await api.get<OrderPojo>(`/api/data/orders/${buyOrder}`);
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
