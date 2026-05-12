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
import type {
  Product,
  ProductListItem,
  ProductVariantPojo,
  ProductReviewPojo,
  ReviewStats,
  ProductSearchItem,
  WeatherCategoryRecommendation,
} from "@/types/product";
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
  /** Matches backend / JPA predicate (case-insensitive); storefront sends canonical labels e.g. Black, M */
  color?: string;
  size?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  /** Comma-separated product ids (Elasticsearch document ids) to exclude from hits */
  excludeIds?: string[];
}

/** Safe parse for URL search params — empty string and NaN yield undefined */
export function parseIntSearchParam(raw: string | undefined): number | undefined {
  if (raw == null || raw === "") return undefined;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : undefined;
}

export function parseOptionalTrimmed(raw: string | undefined): string | undefined {
  if (raw == null) return undefined;
  const t = raw.trim();
  return t === "" ? undefined : t;
}

/** GET /api/public/products — list published products (paginated) */
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
  if (filters.color) params["color"] = filters.color;
  if (filters.size) params["size"] = filters.size;

  // Backend PaginationService expects pageIndex (0-based)
  if (filters.page != null) params["pageIndex"] = String(filters.page - 1);
  if (filters.pageSize != null) params["pageSize"] = String(filters.pageSize);

  if (filters.sortBy) params["sortBy"] = filters.sortBy;
  if (filters.sortDir) params["order"] = filters.sortDir;

  const { data } = await api.get<PaginatedResponse<ProductListItem>>(
    "/api/public/products",
    { params }
  );
  return data;
}

/** GET /api/public/products/search — Full-text search via Elasticsearch */
export async function searchProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<ProductSearchItem>> {
  const params: Record<string, string> = {};

  if (filters.query) params["q"] = filters.query;
  if (filters.page != null) params["pageIndex"] = String(filters.page - 1); // Backend pageIndex is 0-based
  if (filters.pageSize != null) params["pageSize"] = String(filters.pageSize);
  if (filters.sortBy) params["sortBy"] = filters.sortBy;
  if (filters.sortDir) params["order"] = filters.sortDir;
  if (filters.minPrice != null) params["minPrice"] = String(filters.minPrice);
  if (filters.maxPrice != null) params["maxPrice"] = String(filters.maxPrice);
  if (filters.category) params["category"] = filters.category;
  if (filters.inStock !== undefined) params["inStock"] = String(filters.inStock);
  if (filters.color) params["color"] = filters.color;
  if (filters.size) params["size"] = filters.size;
  if (filters.excludeIds?.length) {
    params["excludeIds"] = filters.excludeIds.join(",");
  }

  const { data } = await api.get<PaginatedResponse<ProductSearchItem>>(
    "/api/public/products/search",
    { params }
  );
  return data;
}

/** GET /api/public/products/recommendations/for-you — optional keyword + history boost + excludeIds */
export async function getForYouRecommendations(opts: {
  query?: string;
  excludeIds?: string[];
  deviceId?: string;
  pageSize?: number;
  placement?: "home" | "search" | "pdp" | "cart" | "checkout_success";
}): Promise<PaginatedResponse<ProductSearchItem>> {
  const params: Record<string, string> = {
    q: (opts.query ?? "").trim(),
    pageIndex: "0",
    pageSize: String(opts.pageSize ?? 12),
    sortBy: "price",
    order: "desc",
    placement: opts.placement ?? "home",
  };
  if (opts.excludeIds?.length) {
    params["excludeIds"] = opts.excludeIds.join(",");
  }
  if (opts.deviceId) {
    params["deviceId"] = opts.deviceId;
  }

  const { data } = await api.get<PaginatedResponse<ProductSearchItem>>(
    "/api/public/products/recommendations/for-you",
    { params }
  );
  return data;
}

/** GET /api/public/products/recommendations/weather-category */
export async function getWeatherCategoryRecommendations(params: {
  category: string;
  lat?: number;
  lon?: number;
  limit?: number;
}): Promise<WeatherCategoryRecommendation> {
  const query: Record<string, string> = {
    category: params.category,
  };

  if (params.lat != null) query["lat"] = String(params.lat);
  if (params.lon != null) query["lon"] = String(params.lon);
  if (params.limit != null) query["limit"] = String(params.limit);

  const { data } = await api.get<WeatherCategoryRecommendation>(
    "/api/public/products/recommendations/weather-category",
    { params: query }
  );

  return data;
}

/** GET /api/public/products/recommendations/weather */
export async function getWeatherRecommendations(params?: {
  lat?: number;
  lon?: number;
  limit?: number;
}): Promise<WeatherCategoryRecommendation> {
  const query: Record<string, string> = {};

  if (params?.lat != null) query["lat"] = String(params.lat);
  if (params?.lon != null) query["lon"] = String(params.lon);
  if (params?.limit != null) query["limit"] = String(params.limit);

  const { data } = await api.get<WeatherCategoryRecommendation>(
    "/api/public/products/recommendations/weather",
    { params: query }
  );

  return data;
}

// ─── Single product by barcode ─────────────────────────────────────────────────

/** GET /api/public/products/{barcode} — get published product by barcode */
export async function getProduct(barcode: string): Promise<Product> {
  const { data } = await api.get<Product>(`/api/public/products/${barcode}`);
  return data;
}

// ─── Product variants ─────────────────────────────────────────────────────────

/** Prefer GET /api/public/products/{barcode}/variants; falls back to admin list when no barcode. */
export async function getProductVariants(
  params: {
    productBarcode?: string;
    page?: number;
    pageSize?: number;
    allRequestParams?: Record<string, string>;
  } = {}
): Promise<PaginatedResponse<ProductVariantPojo>> {
  if (params.allRequestParams) {
    const { data } = await api.get<PaginatedResponse<ProductVariantPojo>>(
      "/api/data/product-variants",
      { params: params.allRequestParams }
    );
    return data;
  }

  const barcode = params.productBarcode?.trim();
  if (barcode) {
    try {
      const { data } = await api.get<PaginatedResponse<ProductVariantPojo>>(
        `/api/public/products/${encodeURIComponent(barcode)}/variants`,
        {
          params: {
            pageIndex: String(Math.max(0, (params.page ?? 1) - 1)),
            pageSize: String(params.pageSize ?? 100),
          },
        }
      );
      return data;
    } catch {
      // Older backends without the public variants route — same data as before
      const { data } = await api.get<PaginatedResponse<ProductVariantPojo>>(
        "/api/data/product-variants",
        {
          params: {
            productBarcode: barcode,
            page: String(params.page ?? 1),
            pageSize: String(params.pageSize ?? 100),
          },
        }
      );
      return data;
    }
  }

  const { data } = await api.get<PaginatedResponse<ProductVariantPojo>>("/api/data/product-variants", {
    params: {
      page: String(params.page ?? 1),
      pageSize: String(params.pageSize ?? 50),
    },
  });
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
    {
      params: params.allRequestParams ?? {
        ...(params.productBarcode ? { productBarcode: params.productBarcode } : {}),
        page: String(params.page ?? 1),
        pageSize: String(params.pageSize ?? 10),
      }
    }
  );
  return data;
}

/** GET /api/public/products/{barcode}/reviews/stats — rating stats for a product */
export async function getReviewStats(barcode: string): Promise<ReviewStats> {
  const { data } = await api.get<ReviewStats>(
    `/api/public/products/${barcode}/reviews/stats`
  );
  return data;
}

/** GET /api/public/products/{barcode}/reviews — approved reviews for a product */
export async function getProductReviewsPublic(
  barcode: string,
  options: { page?: number; pageSize?: number } = {}
): Promise<PaginatedResponse<ProductReviewPojo>> {
  const { data } = await api.get<PaginatedResponse<ProductReviewPojo>>(
    `/api/public/products/${barcode}/reviews`,
    {
      params: {
        page: String(options.page ?? 1),
        pageSize: String(options.pageSize ?? 6),
      }
    }
  );
  return data;
}
/** POST /api/account/reviews — submit a new review (authenticated) */
export async function submitProductReview(review: ProductReviewPojo): Promise<ProductReviewPojo> {
  const { data } = await api.post<ProductReviewPojo>("/api/account/reviews", review);
  return data;
}
