/**
 * Product REST API service
 * Connects to Spring Boot backend at http://localhost:8080
 *
 * OpenAPI endpoints (from apidocs.md):
 *   GET  /api/data/products           — list products (admin, paginated)
 *   GET  /api/data/product-variants — list product variants (admin, paginated)
 *   GET  /api/data/product-reviews  — list reviews (admin)
 *
 * ASSUMED (not in spec):
 *   GET  /api/data/products?barcode=xxx — get single product by barcode filter
 */

import { api } from "../app-api";
import type { Product, ProductListItem, ProductVariantPojo, ProductReviewPojo } from "@/types/product";
import type { PaginatedResponse } from "@/types/api";

// ─── List products ─────────────────────────────────────────────────────────────

export interface ProductFilters {
  query?: string;
  barcode?: string;
  category?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

/** GET /api/data/products — list products (paginated) */
export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<ProductListItem>> {
  const params: Record<string, string> = {};

  if (filters.query) params["query"] = filters.query;
  if (filters.barcode) params["barcode"] = filters.barcode;
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

// ─── Single product by barcode ─────────────────────────────────────────────────

/** GET /api/data/products?barcode=xxx — get product by barcode */
export async function getProduct(barcode: string): Promise<Product> {
  const { data } = await api.get<PaginatedResponse<Product>>("/api/data/products", {
    params: { barcode, pageSize: 1 },
  });
  if (!data?.items?.length) {
    throw new Error(`Product not found: ${barcode}`);
  }
  return data.items[0]!;
}

// ─── Product variants ─────────────────────────────────────────────────────────

/** GET /api/data/product-variants — list variants (admin) */
export async function getProductVariants(
  params: {
    productBarcode?: string;
    page?: number;
    pageSize?: number;
    allRequestParams?: Record<string, string>;
  } = {}
): Promise<PaginatedResponse<ProductVariantPojo>> {
  const { data } = await api.get<PaginatedResponse<ProductVariantPojo>>(
    "/api/data/product-variants",
    { params: params.allRequestParams ?? {
      ...(params.productBarcode ? { productBarcode: params.productBarcode } : {}),
      page: String(params.page ?? 1),
      pageSize: String(params.pageSize ?? 50),
    }}
  );
  return data;
}

// ─── Product reviews (public + admin) ─────────────────────────────────────────

/** GET /api/data/product-reviews — list reviews (admin, all including unapproved) */
export async function getProductReviews(
  params: {
    productBarcode?: string;
    page?: number;
    pageSize?: number;
    allRequestParams?: Record<string, string>;
  } = {}
): Promise<PaginatedResponse<ProductReviewPojo>> {
  const { data } = await api.get<PaginatedResponse<ProductReviewPojo>>(
    "/api/data/product-reviews",
    { params: params.allRequestParams ?? {
      ...(params.productBarcode ? { productBarcode: params.productBarcode } : {}),
      page: String(params.page ?? 1),
      pageSize: String(params.pageSize ?? 10),
    }}
  );
  return data;
}
