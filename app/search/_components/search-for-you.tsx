"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrCreateDeviceId } from "@/lib/device-id";
import { getForYouRecommendations } from "@/services/rest-api/products/products";
import type { ProductListItem, ProductSearchItem } from "@/types/product";
import { formatMoney } from "@/lib/utils";

function mapSearchToListItem(si: ProductSearchItem): ProductListItem {
  return {
    id: si.id ? parseInt(si.id, 10) : undefined,
    name: si.name,
    barcode: si.barcode,
    currentPrice: si.price,
    category: {
      name: si.categoryName,
      code: si.categoryCodes?.[0],
    },
    images: si.primaryImageUrl ? [{ url: si.primaryImageUrl }] : [],
    currentStock: 1,
  };
}

interface Props {
  query: string;
  excludeIds: string[];
}

export function SearchForYouSection({ query, excludeIds }: Props) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const q = query.trim();
    if (!q) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const deviceId = getOrCreateDeviceId() ?? undefined;

    getForYouRecommendations({
      query: q,
      excludeIds,
      deviceId,
      pageSize: 12,
    })
      .then((res) => {
        if (cancelled) return;
        const items = (res.items ?? []).map(mapSearchToListItem);
        setProducts(items);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, excludeIds.join(",")]);

  if (!query.trim()) return null;

  if (!loading && products.length === 0) return null;

  return (
    <section className="mt-14 border-t border-neutral-200 pt-10 dark:border-neutral-800">
      <div className="mb-5 flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
          Dành riêng cho bạn
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Gợi ý thêm dựa trên từ khóa và sản phẩm bạn đã xem gần đây
        </p>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-[140px] shrink-0 md:w-[160px]"
              aria-hidden
            >
              <div className="aspect-[3/4] animate-pulse bg-neutral-200 dark:bg-neutral-800" />
              <div className="mt-2 h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          ))}
        </div>
      ) : (
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-thin md:mx-0 md:px-0">
          {products.map((product) => (
            <Link
              key={product.id ?? product.barcode}
              href={`/product/${product.barcode}`}
              className="group w-[140px] shrink-0 md:w-[160px]"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                {product.images?.[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    loading="lazy"
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="160px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-medium text-neutral-300 dark:text-neutral-700">
                    {product.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="mt-2 space-y-1">
                {product.category?.name && (
                  <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                    {product.category.name}
                  </p>
                )}
                <h3 className="line-clamp-2 text-sm font-medium leading-tight text-neutral-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {formatMoney(product.currentPrice)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
