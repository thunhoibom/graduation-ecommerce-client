/**
 * Collection / Category domain types
 */

import type { ProductImage, SEO } from "./product";

export interface Collection {
  id: number;
  name: string;
  slug: string; // maps to backend `name` field
  description?: string;
  descriptionHtml?: string;
  image?: ProductImage;
  seo?: SEO;
  productCount?: number;
  parentId?: number;
  parentName?: string;
  children?: Collection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CollectionListItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: ProductImage;
  productCount?: number;
}
