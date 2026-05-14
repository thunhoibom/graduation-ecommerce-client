import { getWeatherCategoryRecommendations } from "@/services/rest-api/products/products";
import { mapSearchItemToListItem } from "@/lib/product-pricing";
import { WeatherRecommendations } from "./weather-recommendations";

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
