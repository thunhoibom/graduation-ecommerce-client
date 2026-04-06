/**
 * Product REST API service
 */

import { api } from "../app-api";
import type {
  Product,
  ProductListItem,
  ProductRecommendation,
} from "@/types/product";
import type { PaginatedResponse, SearchParams } from "@/types/api";

export interface ProductFilters extends SearchParams {
  category?: string;
  categorySlug?: string;
  collections?: string[];
  tags?: string[];
  brand?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

/** GET /products — list products with filters */
export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<ProductListItem>> {
  const params = new URLSearchParams();

  if (filters.query) params.set("query", filters.query);
  if (filters.category) params.set("category", filters.category);
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.inStock !== undefined)
    params.set("inStock", String(filters.inStock));
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDir) params.set("sortDir", filters.sortDir);

  const { data } = await api.get<PaginatedResponse<ProductListItem>>(
    `/products?${params.toString()}`
  );
  return data;
}

/** GET /products/{barcode} — single product by slug/barcode */
export async function getProduct(slug: string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${slug}`);
  return data;
}

/** GET /products/{id}/recommendations — related products */
export async function getProductRecommendations(
  productId: number
): Promise<ProductRecommendation[]> {
  const { data } = await api.get<ProductRecommendation[]>(
    `/products/${productId}/recommendations`
  );
  return data;
}

/** GET /products/featured — featured products for homepage */
export async function getFeaturedProducts(
  limit = 6
): Promise<ProductListItem[]> {
  const { data } = await api.get<ProductListItem[]>(
    `/products/featured?limit=${limit}`
  );
  return data;
}

/** GET /products/search — full-text search */
export async function searchProducts(
  query: string,
  filters: Partial<ProductFilters> = {}
): Promise<PaginatedResponse<ProductListItem>> {
  const params = new URLSearchParams({ query, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined)) });

  const { data } = await api.get<PaginatedResponse<ProductListItem>>(
    `/products/search?${params.toString()}`
  );
  return data;
}
