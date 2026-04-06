/**
 * Collection / Category REST API service
 */

import { api } from "../app-api";
import type { Collection, CollectionListItem } from "@/types/collection";
import type { PaginatedResponse } from "@/types/api";
import type { ProductListItem } from "@/types/product";

/** GET /product-categories — all top-level collections */
export async function getCollections(): Promise<CollectionListItem[]> {
  const { data } = await api.get<CollectionListItem[]>("/product-categories");
  return data;
}

/** GET /product-categories/{name} — single collection by slug/name */
export async function getCollection(slug: string): Promise<Collection> {
  const { data } = await api.get<Collection>(`/product-categories/${slug}`);
  return data;
}

/** GET /product-categories/{name}/products — products in a collection */
export async function getCollectionProducts(
  slug: string,
  options: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
  } = {}
): Promise<PaginatedResponse<ProductListItem>> {
  const params = new URLSearchParams(
    Object.fromEntries(Object.entries(options).filter(([, v]) => v !== undefined)) as Record<string, string>
  );
  const { data } = await api.get<PaginatedResponse<ProductListItem>>(
    `/product-categories/${slug}/products?${params.toString()}`
  );
  return data;
}

/** GET /product-categories/tree — full category tree */
export async function getCategoryTree(): Promise<Collection[]> {
  const { data } = await api.get<Collection[]>("/product-categories/tree");
  return data;
}
