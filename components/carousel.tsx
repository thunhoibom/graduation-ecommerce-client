/**
 * Carousel — Server Component
 * Fetches products server-side, delegates interactivity to HomeCarousel client component.
 */

import { getProducts } from "@/services/rest-api/products/products";
import { HomeCarousel } from "@/components/carousel/home-carousel";

export async function Carousel() {
  const { items } = await getProducts({ page: 1, pageSize: 12 });

  if (!items?.length) return null;

  return <HomeCarousel products={items} />;
}
