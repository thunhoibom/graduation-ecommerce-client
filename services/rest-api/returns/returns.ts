/**
 * Return Request REST API service
 *
 * OpenAPI endpoints (from apidocs.md):
 *   GET  /api/data/return-requests                   — list return requests
 *   POST /api/data/return-requests                   — create new return request
 *   GET  /api/data/return-requests/{id}             — get single return request
 *   POST /api/data/return-requests/tracking/{id}     — add tracking number
 *   POST /api/data/return-requests/cancel/{id}        — cancel return request
 */

import { api } from "../app-api";
import type { ReturnRequestPojo, ReturnRequestItemPojo } from "@/types/order";
import type { PaginatedResponse } from "@/types/api";

/** GET /api/data/return-requests — list return requests */
export async function getReturnRequests(
  params: {
    page?: number;
    pageSize?: number;
    status?: string;
    allRequestParams?: Record<string, string>;
  } = {}
): Promise<PaginatedResponse<ReturnRequestPojo>> {
  const { data } = await api.get<PaginatedResponse<ReturnRequestPojo>>(
    "/api/data/return-requests",
    { params: params.allRequestParams ?? {
      page: String(params.page ?? 1),
      pageSize: String(params.pageSize ?? 10),
      ...(params.status ? { status: params.status } : {}),
    }}
  );
  return data;
}

/** POST /api/data/return-requests — create new return request */
export async function createReturnRequest(payload: {
  orderId: number;
  reason: string;
  status?: string;
  refundMethod?: string;
  refundBankName?: string;
  refundBankAccountNumber?: string;
  refundBankAccountHolder?: string;
  items: Pick<ReturnRequestItemPojo, "productId" | "variantId" | "quantity" | "reason">[];
}): Promise<ReturnRequestPojo> {
  const { data } = await api.post<ReturnRequestPojo>("/api/data/return-requests", payload);
  return data;
}

/** POST /api/data/return-requests/cancel/{id} — cancel a pending return request */
export async function cancelReturnRequest(id: number): Promise<ReturnRequestPojo> {
  const { data } = await api.post<ReturnRequestPojo>(`/api/data/return-requests/cancel/${id}`);
  return data;
}

export interface MockReturnRequestOption {
  id: number;
  orderId?: number;
  status?: string;
  trackingNumber?: string;
  refundAmount?: number;
  refundMethod?: string;
  date?: string;
  lastModified?: string;
}

export interface MockReturnActionPayload {
  action:
    | "APPROVE"
    | "SET_TRACKING"
    | "RECEIVE"
    | "START_REFUND"
    | "COMPLETE_REFUND"
    | "CANCEL"
    | "REJECT";
  trackingNumber?: string;
  refundAmount?: number;
  adminNotes?: string;
}

export interface MockReturnActionResponse {
  message: string;
  returnRequestId: number;
  orderId?: number;
  status?: string;
  trackingNumber?: string;
  refundAmount?: number;
  refundMethod?: string;
  lastModified?: string;
}

export async function listMockReturnRequests(limit = 20): Promise<MockReturnRequestOption[]> {
  const { data } = await api.get<MockReturnRequestOption[]>("/api/public/mock/returns/requests", {
    params: { limit },
  });
  return data ?? [];
}

export async function simulateMockReturnAction(
  id: number,
  payload: MockReturnActionPayload
): Promise<MockReturnActionResponse> {
  const { data } = await api.post<MockReturnActionResponse>(
    `/api/public/mock/returns/requests/${id}/simulate`,
    payload
  );
  return data;
}
