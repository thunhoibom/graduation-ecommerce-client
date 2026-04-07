/**
 * Collection / Category types — mirrors backend ProductCategoryPojo
 *
 * Backend key field is `code` (unique identifier, used in URL segments).
 * Frontend route: /collections/[slug] where slug = code
 */

import type { ProductImage } from "./product";
import type { SEO } from "./product";

export interface ProductCategoryPojo {
  code: string;
  name: string;
  description?: string;
  parent?: ProductCategoryPojo;
  children?: ProductCategoryPojo[];
  imageUrl?: string;
  productCount?: number;
}

// ─── Collection (public-facing, mirrors backend ProductCategoryPojo) ──────────

export interface Collection {
  code: string;
  name: string;
  description?: string;
  descriptionHtml?: string;
  image?: ProductImage;
  imageUrl?: string;
  seo?: SEO;
  productCount?: number;
  parent?: ProductCategoryPojo;
  children?: ProductCategoryPojo[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CollectionListItem {
  code: string;
  name: string;
  description?: string;
  image?: ProductImage;
  imageUrl?: string;
  productCount?: number;
}