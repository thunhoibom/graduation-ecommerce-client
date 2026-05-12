import { api } from "./app-api";

export type BehaviorEventType =
  | "SEARCH_SUBMIT"
  | "PRODUCT_VIEW"
  | "ADD_TO_CART"
  | "BEGIN_CHECKOUT"
  | "PURCHASE";

export interface BehaviorEventPayload {
  query?: string;
  productId?: number;
  barcode?: string;
  categoryCode?: string;
  categoryCodes?: string[];
  orderId?: string;
  total?: number;
  quantity?: number;
  placement?: string;
}

/** POST /api/public/behavior/events */
export async function postBehaviorEvent(opts: {
  deviceId: string;
  eventType: BehaviorEventType;
  payload?: BehaviorEventPayload;
  customerId?: number;
}): Promise<void> {
  await api.post("/api/public/behavior/events", {
    deviceId: opts.deviceId,
    customerId: opts.customerId ?? null,
    eventType: opts.eventType,
    payload: opts.payload ?? {},
  });
}
