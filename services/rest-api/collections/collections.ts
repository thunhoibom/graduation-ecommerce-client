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
  const { data } = await api.get<Collection[]>("/api/public/categories");
  return data;
}

/**
 * GET /api/public/categories/{code} — single category subtree (public, no auth).
 * Returns a CategoryTreePojo node: id, code, name, parent, children[], productCount.
 */
export async function getCollection(code: string): Promise<Collection> {
  const { data } = await api.get<Collection>(`/api/public/categories/${code}`);
  return data;
}

/** GET /api/data/product_categories — all categories (admin, auth required) */
export async function getCollections(): Promise<CollectionListItem[]> {
  const { data } = await api.get<CollectionListItem[]>("/api/data/product_categories");
  return data;
}

/** GET /api/data/product_categories/{code}/products — products in a category */
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
    query?: string;
  } = {}
): Promise<PaginatedResponse<ProductListItem>> {
  const params = new URLSearchParams(
    Object.fromEntries(
      Object.entries(options).filter(([, v]) => v !== undefined)
    ) as Record<string, string>
  );
  const { data } = await api.get<PaginatedResponse<ProductListItem>>(
    `/api/data/product_categories/${code}/products?${params.toString()}`
  );
  return data;
}
