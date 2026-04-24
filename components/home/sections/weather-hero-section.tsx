import Link from "next/link";
import Image from "next/image";
import { getWeatherRecommendations } from "@/services/rest-api/products/products";
import type { ProductSearchItem, WeatherContext } from "@/types/product";
import { formatMoney } from "@/lib/utils";

interface WeatherHeroPayload {
  items?: ProductSearchItem[];
  weatherContext?: WeatherContext;
}

export async function WeatherHeroSection() {
  let payload: WeatherHeroPayload | null = null;

  try {
    payload = await getWeatherRecommendations({ limit: 4 });
  } catch {
    return null;
  }

  const items = payload?.items ?? [];
  const weather = payload?.weatherContext;

  if (!items.length) return null;

  const title =
    weather?.temperature != null
      ? `Gợi ý hôm nay (${Math.round(weather.temperature)}°C)`
      : "Gợi ý hôm nay";

  const weatherLabel = weather?.weatherTag ?? weather?.condition ?? "Trạng thái ổn định";
  const weatherTone =
    weather?.temperature != null
      ? weather.temperature >= 31
        ? "Nóng"
        : weather.temperature <= 21
          ? "Mát/Lạnh"
          : "Dễ chịu"
      : "Theo mùa";

  return (
    <section className="border-b border-neutral-200 bg-neutral-100/70 py-8 dark:border-neutral-800 dark:bg-neutral-900/40">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              Theo thời tiết
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white md:text-3xl">
              {title}
            </h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
              Chọn nhanh item phù hợp với nhiệt độ hiện tại để mặc đẹp và thoải mái hơn.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs uppercase tracking-wide text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
              {weatherTone}
            </span>
            <span className="rounded-full border border-neutral-300 px-3 py-1 text-xs uppercase tracking-wide text-neutral-700 dark:border-neutral-700 dark:text-neutral-300">
              {weatherLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.barcode}
              href={`/product/${item.barcode}`}
              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-500"
            >
              <div className="relative aspect-[3/4] bg-neutral-100 dark:bg-neutral-900">
                {item.primaryImageUrl ? (
                  <Image
                    src={item.primaryImageUrl}
                    alt={item.name}
                    fill
                    loading="lazy"
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl font-semibold text-neutral-300 dark:text-neutral-700">
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="space-y-1 p-3">
                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {item.categoryName}
                </p>
                <p className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-white">
                  {item.name}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {formatMoney(item.price)}
                  </p>
                  <span className="text-[11px] uppercase tracking-wide text-neutral-500 transition-colors group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-white">
                    Xem
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Dữ liệu được cập nhật theo thời tiết hiện tại.
          </p>
          <Link
            href="/collections/all"
            className="text-sm font-medium text-neutral-600 underline-offset-4 transition-colors hover:text-neutral-900 hover:underline dark:text-neutral-300 dark:hover:text-white"
          >
            Xem them goi y
          </Link>
        </div>
      </div>
    </section>
  );
}
