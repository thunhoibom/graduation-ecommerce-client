import Link from "next/link";
import Image from "next/image";
import type { ProductListItem } from "@/types/product";
import type { WeatherContext } from "@/types/product";
import { formatMoney } from "@/lib/utils";

interface WeatherRecommendationsProps {
  items: ProductListItem[];
  weatherContext?: WeatherContext;
}

export function WeatherRecommendations({
  items,
  weatherContext,
}: WeatherRecommendationsProps) {
  if (!items.length) return null;

  const title = weatherContext?.temperature != null
    ? `Goi y theo thoi tiet hom nay (${Math.round(weatherContext.temperature)} do C)`
    : "Goi y theo thoi tiet hom nay";

  return (
    <section className="mt-8 border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/40 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
          {title}
        </h2>
        {weatherContext?.condition && (
          <span className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {weatherContext.condition}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <Link key={item.barcode} href={`/product/${item.barcode}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
              {item.images?.[0]?.url ? (
                <Image
                  src={item.images[0].url}
                  alt={item.name}
                  fill
                  loading="lazy"
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-neutral-300 dark:text-neutral-700">
                  {item.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="mt-2 space-y-0.5">
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                {item.category?.name}
              </p>
              <p className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-white">
                {item.name}
              </p>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                {formatMoney(item.currentPrice)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
