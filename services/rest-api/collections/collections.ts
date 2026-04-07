/**
 * Collection / Category REST API service
 *
 * OpenAPI endpoints (from apidocs.md):
 *   GET  /api/data/product_categories              — list top-level categories
 *   GET  /api/data/product_categories/tree         — full category tree
 *   GET  /api/data/product_categories/{code}      — single category by code
 *   GET  /api/data/product_categories/{code}/products — products in category
 */

import { api } from "../app-api";
import type { Collection, CollectionListItem } from "@/types/collection";
import type { PaginatedResponse } from "@/types/api";
import type { ProductListItem } from "@/types/product";

/** GET /api/data/product_categories — all categories */
export async function getCollections(): Promise<CollectionListItem[]> {
  const { data } = await api.get<CollectionListItem[]>("/api/data/product_categories");
  return data;
}

/** GET /api/data/product_categories/tree — full category tree */
export async function getCategoryTree(): Promise<Collection[]> {
  const { data } = await api.get<Collection[]>("/api/data/product_categories/tree");
  return data;
}

/** GET /api/data/product_categories/{code} — single category by code */
export async function getCollection(code: string): Promise<Collection> {
  const { data } = await api.get<Collection>(`/api/data/product_categories/${code}`);
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
