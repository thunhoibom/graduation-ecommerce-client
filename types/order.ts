/**
 * Order domain types — aligned with Spring Boot backend OrderPojo / OrderDetailPojo
 * All monetary values are integers in VND
 */

import type { PersonPojo, AddressPojo } from "./person";
import type { ProductPojo } from "./product";

// Re-export for convenience
export type { ProductPojo };

// ─── Order ────────────────────────────────────────────────────────────────────

export interface OrderPojo {
  buyOrder?: number;
  cartSessionToken?: string;
  date?: string;
  details: OrderDetailPojo[];
  netValue?: number;           // VND subtotal
  taxValue?: number;            // VND
  transportValue?: number;      // VND shipping
  totalValue?: number;          // VND grand total
  totalItems?: number;
  totalRefundedAmount?: number; // VND
  discountCode?: string;
  discountValue?: number;      // VND
  status?: string;
  fulfillmentStatus?: string;
  paymentStatus?: string;
  billingType?: string;
  paymentType: string;
  customer?: PersonPojo;
  salesperson?: PersonPojo;
  shipper?: string;
  billingCompany?: BillingCompanyPojo;
  billingAddress?: AddressPojo;
  shippingAddress?: AddressPojo;
}

// ─── Order Detail ─────────────────────────────────────────────────────────────

export interface OrderDetailPojo {
  id?: number;
  units: number;
  unitValue: number;     // VND per unit
  description?: string;
  product?: ProductPojo;
  variantId?: number;
}

// ─── Billing ──────────────────────────────────────────────────────────────────

export interface BillingCompanyPojo {
  idNumber?: string;
  name?: string;
}

// ─── Order Status ─────────────────────────────────────────────────────────────

export type OrderStatusCode =
  | "PENDING"
  | "CONFIRMED"
  | "DELIVERY_ON_ROUTE"
  | "DELIVERY_COMPLETE"
  | "DELIVERY_FAILED"
  | "DELIVERY_CANCELLED"
  | "REJECTED"
  | "RETURNED";

export interface OrderStatusPojo {
  code: number;
  name: string;
}

// ─── Return Request ───────────────────────────────────────────────────────────

export interface ReturnRequestPojo {
  id?: number;
  date?: string;
  lastModified?: string;
  reason: string;
  adminNotes?: string;
  status: string;
  refundMethod: string;
  refundAmount?: number;  // VND
  trackingNumber?: string;
  orderId?: number;
  items: ReturnRequestItemPojo[];
}

export interface ReturnRequestItemPojo {
  id?: number;
  quantity: number;
  reason?: string;
  productId?: number;
  product?: ProductPojo;
  variantId?: number;
  active?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format VND number to locale string */
export function formatVND(amount: number | undefined): string {
  if (amount == null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
}
