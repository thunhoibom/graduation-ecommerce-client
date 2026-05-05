"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type { ProductListItem } from "@/types/product";
import { formatMoney } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "@phosphor-icons/react";

interface ProductGridProps {
  products: ProductListItem[];
  page: number;
  totalPages: number;
  sortBy: string;
  sortDir: string;
  collectionSlug: string;
  /** Overrides default empty-state copy (e.g. search page) */
  emptyTitle?: string;
  emptySubtitle?: string;
}

export function ProductGrid({
  products,
  page,
  totalPages,
  sortBy,
  sortDir,
  collectionSlug,
  emptyTitle,
  emptySubtitle,
}: ProductGridProps) {
  const searchParams = useSearchParams();

  if (!products.length) {
    return (
      <div className="py-16 text-center">
        <ShoppingBag className="mx-auto mb-4 size-12 text-neutral-300 dark:text-neutral-800" />
        <p className="text-base font-medium text-neutral-500">
          {emptyTitle ?? "Không có sản phẩm nào."}
        </p>
        {emptySubtitle ? (
          <p className="mt-1 text-sm text-neutral-400">{emptySubtitle}</p>
        ) : null}
      </div>
    );
  }

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    return `?${params.toString()}`;
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.barcode}
            href={`/product/${product.barcode}`}
            className="group block"
          >
            {(() => {
              const currentPrice = product.currentPrice;
              const originalPrice = product.originalPrice ?? product.currentPrice;
              const hasDiscount = Boolean(product.hasDiscount && currentPrice < originalPrice);
              const discountPercent = Math.max(0, Math.min(100, product.discountPercent ?? 0));
              return (
                <>
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
              {product.images?.[0]?.url ? (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                  {product.name.charAt(0)}
                </div>
              )}

              {/* Out of stock overlay */}
              {!product.currentStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="rounded-none bg-white/90 px-3 py-1 text-xs font-medium text-black">
                    Hết hàng
                  </span>
                </div>
              )}
              {hasDiscount && (
                <span className="absolute left-2 top-2 rounded-none bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Info */}
            <div className="mt-3 space-y-1">
              {product.category && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{product.category.name}</p>
              )}
              <h3 className="line-clamp-2 text-sm font-medium leading-tight">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{formatMoney(currentPrice)}</p>
                {hasDiscount && (
                  <p className="text-xs text-neutral-500 line-through">
                    {formatMoney(originalPrice)}
                  </p>
                )}
              </div>
            </div>
                </>
              );
            })()}
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={buildPageUrl(page - 1)}
              className="border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              ← Trước
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - page) <= 2)
            .map((p) => (
              <Link
                key={p}
                href={buildPageUrl(p)}
                className={cn(
                  "min-w-[36px] border border-neutral-200 px-3 py-1.5 text-center text-sm",
                  p === page
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-neutral-200 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                )}
              >
                {p}
              </Link>
            ))}

          {page < totalPages && (
            <Link
              href={buildPageUrl(page + 1)}
              className="border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Sau →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
