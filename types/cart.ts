/**
 * Cart domain types
 */

import type { Money, ProductImage } from "./product";

export interface CartProduct {
  id: number;
  name: string;
  slug: string;
  price: Money;
  featuredImage?: ProductImage;
}

export interface CartItemVariant {
  id: number;
  barcode?: string;
  title: string;
  sku?: string;
  price: Money;
  image?: ProductImage;
  selectedOptions: {
    name: string;
    value: string;
  }[];
}

export interface CartItem {
  id: number;
  product: CartProduct;
  variant: CartItemVariant;
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
}

export interface Cart {
  id: number;
  sessionToken?: string;
  items: CartItem[];
  itemCount: number;
  subtotal: Money;
  total: Money;
  discountAmount?: Money;
  discountCode?: string;
  shippingMethodId?: number;
  shippingMethodName?: string;
  shippingCost?: Money;
  taxAmount?: Money;
  checkoutUrl?: string;
}

export interface AddToCartPayload {
  variantId: number;
  quantity: number;
  cartId?: number;
}

export interface UpdateCartItemPayload {
  cartItemId: number;
  quantity: number;
}

export interface RemoveCartItemPayload {
  cartItemId: number;
}

export interface ApplyDiscountPayload {
  cartId: number;
  discountCode: string;
}
