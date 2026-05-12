/**
 * Collection / Category REST API service
 *
 * Public endpoints (no auth required — for customer browsing):
 *   GET  /api/public/categories              — full category tree
 *   GET  /api/public/categories/{code}       — single category subtree
 *
 * Admin endpoints (auth required — kept for compatibility):
 *   GET  /api/data/product_categories              — list top-level categories
 *   GET  /api/data/product_categories/{code}      — single category by code
 *   GET  /api/data/product_categories/{code}/products — products in category
 */

import { api } from "../app-api";
import type { Collection, CollectionListItem } from "@/types/collection";
import type { PaginatedResponse } from "@/types/api";
import type { ProductListItem } from "@/types/product";

/**
 * GET /api/public/categories — full category tree (public, no auth).
 * Returns root categories with nested children arrays and productCount on every node.
 * Powers the /collections browse page with one round-trip.
 */
export async function getCategoryTree(): Promise<Collection[]> {
  try {
    console.log("[DEBUG] Fetching full category tree");
    const { data } = await api.get<Collection[]>("/api/public/categories");
    console.log(`[DEBUG] Category tree fetched: ${data.length} root nodes`);
    return data;
  } catch (error: any) {
    console.error("[DEBUG] Error fetching category tree", error.message);
    return [];
  }
}

/**
 * GET /api/public/categories/{code} — single category subtree (public, no auth).
 * Returns a CategoryTreePojo node: id, code, name, parent, children[], productCount.
 */
export async function getCollection(code: string): Promise<Collection> {
  try {
    console.log(`[DEBUG] Fetching collection for code: ${code}`);
    const { data } = await api.get<Collection>(`/api/public/categories/${code}`);
    console.log(`[DEBUG] Collection fetched successfully:`, data.name);
    return data;
  } catch (error: any) {
    console.error(`[DEBUG] Error fetching collection for code: ${code}`, {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });
    throw error;
  }
}

/** GET /api/data/product_categories — all categories (admin, auth required) */
export async function getCollections(): Promise<CollectionListItem[]> {
  // NOTE: This endpoint is paginated by default
  const { data } = await api.get<PaginatedResponse<CollectionListItem>>("/api/data/product_categories");
  return data.items || [];
}

import { getProducts } from "../products/products";

/** GET products in a category (public) */
export async function getCollectionProducts(
  code: string,
  options: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    color?: string;
    size?: string;
    query?: string;
  } = {}
): Promise<PaginatedResponse<ProductListItem>> {
  // Leverage the public getProducts service with the category filter
  return getProducts({
    ...options,
    category: code
  });
}
