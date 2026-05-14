"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type { ProductListItem } from "@/types/product";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "@phosphor-icons/react";
import { resolveProductCardPricing } from "@/lib/product-pricing";
import { ProductDiscountBadge } from "@/components/product/product-discount-badge";
import { ProductCardPrice } from "@/components/product/product-card-price";

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

  const hasListingFilters =
    searchParams.get("inStock") === "true" ||
    Boolean(searchParams.get("minPrice")) ||
    Boolean(searchParams.get("maxPrice")) ||
    Boolean(searchParams.get("color")?.trim()) ||
    Boolean(searchParams.get("size")?.trim()) ||
    Boolean((searchParams.get("query") ?? searchParams.get("q") ?? "").trim());

  const buildClearFiltersUrl = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("inStock");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("color");
    params.delete("size");
    params.delete("query");
    params.delete("q");
    params.delete("page");
    const qs = params.toString();
    return qs ? `?${qs}` : "?";
  };

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
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {hasListingFilters ? (
            <Link
              href={buildClearFiltersUrl()}
              className="inline-flex items-center justify-center border border-neutral-900 bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Xóa bộ lọc
            </Link>
          ) : null}
          <Link
            href="/collections/all"
            className="inline-flex items-center justify-center border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800/80"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
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
              const pricing = resolveProductCardPricing(product);
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
              {pricing.hasDiscount ? (
                <ProductDiscountBadge discountPercent={pricing.discountPercent} />
              ) : null}
            </div>

            {/* Info */}
            <div className="mt-3 space-y-1">
              {product.category && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{product.category.name}</p>
              )}
              <h3 className="line-clamp-2 text-sm font-medium leading-tight">
                {product.name}
              </h3>
              <ProductCardPrice pricing={pricing} />
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
