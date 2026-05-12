import { baseUrl } from "@/lib/utils";
import type { Product, ProductVariantPojo } from "@/types/product";

function absoluteUrl(maybeRelative: string): string {
  if (maybeRelative.startsWith("http://") || maybeRelative.startsWith("https://")) {
    return maybeRelative;
  }
  const base = baseUrl.replace(/\/$/, "");
  const path = maybeRelative.startsWith("/") ? maybeRelative : `/${maybeRelative}`;
  return `${base}${path}`;
}

interface ProductJsonLdProps {
  product: Product;
  variants?: ProductVariantPojo[];
}

export function ProductJsonLd({ product, variants = [] }: ProductJsonLdProps) {
  const inStock =
    (product.currentStock != null && product.currentStock > 0) ||
    variants.some((v) => (v.availableStock ?? 0) > 0);

  const imageUrls = (product.images ?? [])
    .map((img) => img.url)
    .filter(Boolean)
    .map(absoluteUrl);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.barcode,
    description: product.description?.slice(0, 5000) || undefined,
    image: imageUrls.length ? imageUrls : undefined,
    offers: {
      "@type": "Offer",
      url: `${baseUrl.replace(/\/$/, "")}/product/${encodeURIComponent(product.barcode)}`,
      priceCurrency: "VND",
      price: String(product.currentPrice ?? 0),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  if (product.averageRating != null && product.averageRating > 0 && (product.totalReviews ?? 0) > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(product.averageRating),
      reviewCount: String(product.totalReviews ?? 0),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
