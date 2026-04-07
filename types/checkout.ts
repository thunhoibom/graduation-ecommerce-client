/**
 * Checkout domain types — matches Spring Boot backend ReceiptPojo / CheckoutPojo
 */

import type { ShippingMethod } from "./common";

/** GET /api/public/receipt/{token} — order receipt after payment completion */
export interface Receipt {
  token: string;
  buyOrder: number;
  /** Payment method used */
  paymentType?: string;
  /** Transaction reference from payment gateway */
  transactionToken?: string;
  /** Cart summary */
  subtotal: number;
  shippingFee: number;
  discountAmount?: number;
  total: number;
  /** Customer info */
  customerName?: string;
  customerEmail?: string;
  /** Shipping address */
  shippingAddress?: {
    recipientName?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    district?: string;
    ward?: string;
  };
  /** Items in the order */
  items: ReceiptItem[];
  /** Order status */
  status?: string;
  /** Timestamp */
  createdAt?: string;
}

export interface ReceiptItem {
  productName: string;
  variantSku?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

/** POST /api/public/checkout response */
export interface CheckoutResponse {
  buyOrder: number;
  token: string;
  redirectUrl?: string;
  paymentType?: string;
}

/** Discount code validation response */
export interface DiscountValidation {
  valid: boolean;
  discountAmount?: number;
  message?: string;
  code?: string;
  type?: string;
  value?: number;
}
