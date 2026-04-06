/**
 * Shared common types — Menu, Page, SEO, etc.
 */

import type { ProductImage, SEO } from "./product";

// ─── Menu ─────────────────────────────────────────────────────────────────────

export interface MenuItem {
  id: number;
  title: string;
  path: string;
  children?: MenuItem[];
  external?: boolean;
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
  slug: string; // maps to backend `name`
  content?: string;
  contentHtml?: string;
  seo?: SEO;
  image?: ProductImage;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Customer / Auth ─────────────────────────────────────────────────────────

export interface Customer {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthday?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  isGuest?: boolean;
  createdAt?: string;
}

export interface Address {
  id: number;
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

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

// ─── Shipping & Discount ──────────────────────────────────────────────────────

export interface ShippingMethod {
  id: number;
  name: string;
  description?: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  estimatedDays?: string;
}

export interface DiscountCode {
  id: number;
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount?: number;
  startsAt?: string;
  expiresAt?: string;
  active: boolean;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  slug: string;
  price: {
    amount: string;
    currencyCode: string;
  };
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
