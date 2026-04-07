/**
 * Product REST API service
 * Connects to Spring Boot backend at http://localhost:8080
 *
 * OpenAPI endpoints (from apidocs.md):
 *   GET  /data/products                    — list products (admin, paginated)
 *   GET  /data/products/{barcode}         — single product by barcode (admin)
 *   GET  /public/products/{barcode}/reviews       — product reviews
 *   GET  /public/products/{barcode}/reviews/stats — review stats
 */

import { api } from "../app-api";
import type { Product, ProductListItem, ProductReviewPojo, ReviewStats } from "@/types/product";
import type { PaginatedResponse } from "@/types/api";

// ─── List products ─────────────────────────────────────────────────────────────

export interface ProductFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

/** GET /data/products — list products (admin, paginated) */
export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<ProductListItem>> {
  const params: Record<string, string> = {};

  if (filters.query) params["query"] = filters.query;
  if (filters.category) params["category"] = filters.category;
  if (filters.minPrice != null) params["minPrice"] = String(filters.minPrice);
  if (filters.maxPrice != null) params["maxPrice"] = String(filters.maxPrice);
  if (filters.inStock !== undefined) params["inStock"] = String(filters.inStock);
  if (filters.page != null) params["page"] = String(filters.page);
  if (filters.pageSize != null) params["pageSize"] = String(filters.pageSize);
  if (filters.sortBy) params["sortBy"] = filters.sortBy;
  if (filters.sortDir) params["sortDir"] = filters.sortDir;

  const { data } = await api.get<PaginatedResponse<ProductListItem>>(
    "/api/data/products",
    { params }
  );
  return data;
}

// ─── Single product ────────────────────────────────────────────────────────────

/** GET /data/products/{barcode} — get product by barcode */
export async function getProduct(barcode: string): Promise<Product> {
  const { data } = await api.get<Product>(`/api/data/products/${barcode}`);
  return data;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

/** GET /public/products/{barcode}/reviews */
export async function getProductReviews(
  barcode: string
): Promise<ProductReviewPojo[]> {
  const { data } = await api.get<ProductReviewPojo[]>(
    `/api/public/products/${barcode}/reviews`
  );
  return data ?? [];
}

/** GET /public/products/{barcode}/reviews/stats */
export async function getProductReviewStats(
  barcode: string
): Promise<ReviewStats> {
  const { data } = await api.get<ReviewStats>(
    `/api/public/products/${barcode}/reviews/stats`
  );
  return data;
}
