/**
 * Product domain types — matches Spring Boot backend entity shape
 */

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ProductImage {
  id?: number;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
  position?: number;
}

export interface ProductOption {
  id?: number;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id?: number;
  barcode?: string;
  sku?: string;
  title: string;
  availableForSale: boolean;
  currentStock?: number;
  price: Money;
  compareAtPrice?: Money;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: ProductImage;
}

export interface Product {
  id: number;
  name: string;
  slug: string; // maps to backend `barcode`
  description: string;
  descriptionHtml?: string;
  shortDescription?: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice?: Money;
  categoryId?: number;
  categoryName?: string;
  categorySlug?: string;
  tags?: string[];
  brand?: string;
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  variantsOptions?: {
    name: string;
    values: string[];
  }[];
  seo?: SEO;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  price: Money;
  compareAtPrice?: Money;
  availableForSale: boolean;
  featuredImage?: ProductImage;
  categoryName?: string;
  tags?: string[];
}

export interface ProductRecommendation {
  id: number;
  name: string;
  slug: string;
  price: Money;
  availableForSale: boolean;
  featuredImage?: ProductImage;
}

export interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
}
