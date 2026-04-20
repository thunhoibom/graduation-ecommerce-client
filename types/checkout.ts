/**
 * Checkout domain types — matches Spring Boot backend ReceiptPojo / CheckoutPojo
 */

import type { ShippingMethod } from "./common";

// ─── Person / Address (matches backend PersonPojo / AddressPojo) ────────────────

export interface PersonPojo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface AddressPojo {
  firstLine: string;
  secondLine?: string;
  municipality: string;
  city: string;
  postalCode?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
}

// ─── Checkout Start Request ────────────────────────────────────────────────────

export interface CheckoutStartPayload {
  /** Cart session token (sent via X-Session-Token header, optional here) */
  cartSessionToken?: string;
  shippingMethodId: number;
  discountCode?: string;
  /** Customer info — firstName + lastName + email + phone */
  customer: PersonPojo;
  shippingAddress: AddressPojo;
  /** Payment type: VNPAY | COD */
  paymentType: "VNPAY" | "COD";
  billingType: "individual" | "enterprise";
  billingCompany?: {
    companyName: string;
    taxCode: string;
    email: string;
    address: AddressPojo;
  };
}

// ─── Checkout Start Response ────────────────────────────────────────────────────

export interface PaymentRedirectionDetails {
  url?: string;
  token?: string;
  buyOrder?: number;
}

// ─── Receipt (mirrors backend ReceiptPojo) ─────────────────────────────────────

export interface Receipt {
  token?: string;
  buyOrder: number;
  date?: string;
  status?: string;
  totalValue?: number;
  taxValue?: number;
  transportValue?: number;
  totalItems?: number;
  details?: ReceiptItem[];
  // Extended fields from frontend's own processing
  paymentType?: string;
  transactionToken?: string;
  subtotal?: number;
  shippingFee?: number;
  discountAmount?: number;
  total?: number;
  customerName?: string;
  customerEmail?: string;
  shippingAddress?: {
    recipientName?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    district?: string;
    ward?: string;
  };
  items: ReceiptItem[];
  createdAt?: string;
}

export interface ReceiptItem {
  productName: string;
  variantSku?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl?: string;
}

// ─── Discount Validation ────────────────────────────────────────────────────────

export interface DiscountValidation {
  valid: boolean;
  discountAmount?: number;
  message?: string;
  code?: string;
  type?: string;
  value?: number;
}
