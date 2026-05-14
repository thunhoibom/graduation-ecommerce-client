import { getWeatherCategoryRecommendations } from "@/services/rest-api/products/products";
import type { ProductListItem } from "@/types/product";
import type { ProductSearchItem } from "@/types/product";
import { WeatherRecommendations } from "./weather-recommendations";

function mapSearchItemToListItem(item: ProductSearchItem, categoryCode: string): ProductListItem {
  return {
    id: item.id ? parseInt(item.id, 10) : undefined,
    name: item.name,
    barcode: item.barcode,
    currentPrice: item.price,
    category: {
      name: item.categoryName,
      code:
        item.categoryCodes && item.categoryCodes.length > 0
          ? item.categoryCodes[0]
          : categoryCode,
    },
    images: item.primaryImageUrl ? [{ url: item.primaryImageUrl }] : [],
    currentStock: 1,
  };
}

export async function CollectionWeatherRail({ categoryCode }: { categoryCode: string }) {
  try {
    const rec = await getWeatherCategoryRecommendations({
      category: categoryCode,
      limit: 8,
    });
    const raw = rec.items ?? [];
    const items = raw.map((si) => mapSearchItemToListItem(si, categoryCode));
    if (!items.length) return null;
    return <WeatherRecommendations items={items} weatherContext={rec.weatherContext} />;
  } catch {
    return null;
  }
}
