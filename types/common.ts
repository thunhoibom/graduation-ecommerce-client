/**
 * Shared common types — Menu, Page, SEO, Shipping, Discount, etc.
 */

import type { ProductImage, SEO } from "./product";

// ─── Menu ─────────────────────────────────────────────────────────────────────

export interface MenuItem {
  id: number;
  title: string;
  path: string;
  children?: MenuItem[];
  description?: string;
  external?: boolean;
  imageUrl?: string;
}

export interface Menu {
  id: string;
  title: string;
  items: MenuItem[];
}

// ─── CMS Pages ───────────────────────────────────────────────────────────────

export interface Page {
  id: number;
  title: string;
  slug: string;
  content?: string;
  contentHtml?: string;
  seo?: SEO;
  image?: ProductImage;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Shipping Method — mirrors backend ShippingMethodPojo ─────────────────────

export interface ShippingMethod {
  id?: number;
  name: string;
  baseFee: number; // VND (integer)
  freeShippingThreshold?: number; // VND
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  active: boolean;
  pricePerKm?: number;
  carrierCode?: "LOCAL" | "GHN" | string;
  rateMode?: "STATIC" | "DISTANCE" | "LIVE_API" | string;
  carrierServiceCode?: string;
  carrierShopId?: number;
  fee?: number;
  freeShipping?: boolean;
  providerFeeSource?: string;
  estimated?: boolean;
}

// ─── Discount Code — mirrors backend DiscountCodePojo ────────────────────────

export interface DiscountCode {
  id?: number;
  code: string;
  description?: string;
  type: string;
  value: number;
  maxUses?: number;
  useCount?: number;
  maxUsesPerCustomer?: number;
  minCartValue?: number;
  validFrom?: string;
  validUntil?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  currentlyValid?: boolean;
  remainingUses?: number;
}

// ─── Discount Validation ──────────────────────────────────────────────────────

export interface DiscountValidationResult {
  valid: boolean;
  discountAmount?: number;
  message?: string;
  code?: string;
  type?: string;
  value?: number;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  slug: string;
  price: number;   // VND (integer)
  featuredImage?: ProductImage;
  addedAt?: string;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface Review {
  id: number;
  productId: number;
  authorName: string;
  rating: number;
  title?: string;
  content: string;
  isVerifiedPurchase?: boolean;
  helpfulCount?: number;
  createdAt: string;
  replies?: ReviewReply[];
}

export interface ReviewReply {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  siteName: string;
  siteDescription?: string;
  logo?: ProductImage;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  currencies?: string[];
  defaultCurrency?: string;
}
