/**
 * Order domain types
 */

import type { Money } from "./product";
import type { CartItem } from "./cart";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURN_APPROVED"
  | "REFUNDED";

export interface OrderAddress {
  id?: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  variantId?: number;
  variantTitle?: string;
  sku?: string;
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
  imageUrl?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: Money;
  shippingCost?: Money;
  taxAmount?: Money;
  discountAmount?: Money;
  discountCode?: string;
  total: Money;
  shippingMethod?: string;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  paymentMethod?: string;
  paymentStatus?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  estimatedDelivery?: string;
}

export interface OrderSummary {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  total: Money;
  itemCount: number;
  createdAt: string;
}
