/**
 * FeaturedCarousel — Server Component
 * Fetches latest products and delegates interactivity to the client component.
 */

import { getProducts } from "@/services/rest-api/products/products";
import { FeaturedCarouselClient } from "./featured-carousel-client";

export async function FeaturedCarousel() {
  let items: Parameters<typeof FeaturedCarouselClient>[0]["products"] = [];
  try {
    const data = await getProducts({ page: 1, pageSize: 12 });
    items = data.items ?? [];
  } catch {
    return null;
  }

  if (!items.length) return null;

  return <FeaturedCarouselClient products={items} />;
}
