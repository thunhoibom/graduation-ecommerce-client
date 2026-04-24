/**
 * Product domain types — aligned with Spring Boot backend ProductPojo / ProductVariantPojo
 * Backend base URL: http://localhost:8080
 */

import type { ProductCategoryPojo } from "./person";

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id?: number;
  name: string;
  barcode: string;
  description?: string;
  /** @deprecated legacy alias; use currentPrice */
  price?: number;
  originalPrice?: number;
  currentPrice: number;
  discountPercent?: number;
  hasDiscount?: boolean;
  discountActiveFrom?: string;
  discountActiveUntil?: string;
  currentStock?: number;
  criticalStock?: number;
  category?: ProductCategoryPojo;
  images?: ProductImage[];
  averageRating?: number;
  totalReviews?: number;
}

// ─── Product Variant ──────────────────────────────────────────────────────────

export interface ProductVariantPojo {
  id?: number;
  sku: string;
  size: string;
  color?: string;
  attributes?: string;
  priceModifier?: number;      // VND
  currentStock?: number;
  criticalStock?: number;
  reservedStock?: number;
  availableStock?: number;
  active?: boolean;
  barcode?: string;
  productBarcode: string;
  productName?: string;
  productBasePrice?: number;   // VND
  finalPrice?: number;         // VND
  createdAt?: string;
  images?: ProductImage[];
  primaryImageUrl?: string;
}

// ─── Product Image ────────────────────────────────────────────────────────────

export interface ProductImage {
  id?: number;
  code?: string;
  filename?: string;
  url: string;
}

// ─── Product Option (backward compat) ────────────────────────────────────────

export interface ProductOption {
  name: string;
  values: string[];
}

/** @deprecated use ProductVariantPojo */
export type ProductVariant = ProductVariantPojo;

/** @deprecated use Product */
export type ProductPojo = Product;

// ─── SEO ──────────────────────────────────────────────────────────────────────

export interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
}

// ─── Product List Item (grid / search results) ───────────────────────────────

export interface ProductListItem {
  id?: number;
  name: string;
  barcode: string;
  /** @deprecated legacy alias; use currentPrice */
  price?: number;
  originalPrice?: number;
  currentPrice: number;
  discountPercent?: number;
  hasDiscount?: boolean;
  discountActiveFrom?: string;
  discountActiveUntil?: string;
  currentStock?: number;
  category?: ProductCategoryPojo;
  images?: ProductImage[];
  averageRating?: number;
  totalReviews?: number;
}

export interface ProductSearchItem {
  id: string;
  name: string;
  barcode: string;
  description: string;
  price: number;
  categoryName: string;
  categoryCodes?: string[];
  status: string;
  primaryImageUrl?: string;
}

export interface WeatherContext {
  temperature?: number;
  condition?: string;
  weatherTag?: string;
}

export interface WeatherCategoryRecommendation {
  sectionTitle?: string;
  category?: string;
  weatherContext?: WeatherContext;
  items?: ProductSearchItem[];
}

/** Normalise product price to VND integer for display */
export function getDisplayPrice(product: ProductListItem | Product): string {
  return String(product.currentPrice ?? 0);
}

// ─── Product Review ──────────────────────────────────────────────────────────

export interface ProductReviewReplyPojo {
  id?: number;
  body: string;
  authorName: string;
  isStaff?: boolean;
  createdAt?: string;
}

export interface ProductReviewPojo {
  id?: number;
  rating: number;       // 1–5
  title?: string;
  body?: string;
  approved?: boolean;
  verifiedPurchase?: boolean;
  productBarcode: string;
  productName?: string;
  reviewerName?: string;
  imageUrls?: string[];
  imageIds?: number[];
  replies?: ProductReviewReplyPojo[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution?: number[];
}
