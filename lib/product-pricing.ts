import type { ProductListItem, ProductSearchItem } from "@/types/product";

export type ProductPricingSource = Pick<
  ProductListItem,
  "currentPrice" | "originalPrice" | "hasDiscount" | "discountPercent" | "price"
>;

export interface ResolvedProductCardPricing {
  currentPrice: number;
  originalPrice: number;
  hasDiscount: boolean;
  discountPercent: number;
}

export function resolveProductCardPricing(
  product: ProductPricingSource
): ResolvedProductCardPricing {
  const currentPrice = product.currentPrice ?? product.price ?? 0;
  const originalPrice = product.originalPrice ?? currentPrice;
  const hasDiscount = Boolean(
    product.hasDiscount && currentPrice < originalPrice
  );
  const discountPercent = hasDiscount
    ? Math.max(
        0,
        Math.min(
          100,
          product.discountPercent ??
            Math.round(((originalPrice - currentPrice) * 100) / originalPrice)
        )
      )
    : 0;

  return {
    currentPrice,
    originalPrice,
    hasDiscount,
    discountPercent,
  };
}

export function mapSearchItemToListItem(
  item: ProductSearchItem,
  fallbackCategory?: string
): ProductListItem {
  const currentPrice = item.currentPrice ?? item.price ?? 0;
  const originalPrice = item.originalPrice ?? item.price ?? currentPrice;

  return {
    id: item.id ? parseInt(item.id, 10) : undefined,
    name: item.name,
    barcode: item.barcode,
    price: item.price,
    currentPrice,
    originalPrice,
    hasDiscount: item.hasDiscount,
    discountPercent: item.discountPercent,
    category: {
      name: item.categoryName,
      code:
        item.categoryCodes && item.categoryCodes.length > 0
          ? item.categoryCodes[0]
          : fallbackCategory,
    },
    images: item.primaryImageUrl ? [{ url: item.primaryImageUrl }] : [],
    currentStock: 1,
  };
}
