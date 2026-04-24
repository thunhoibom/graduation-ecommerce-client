"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ShoppingBag } from "@phosphor-icons/react";
import { formatMoney, cn } from "@/lib/utils";
import type { ProductListItem } from "@/types/product";

interface SearchResultsProps {
  products: ProductListItem[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export function SearchResults({
  products,
  totalCount,
  page,
  totalPages,
}: SearchResultsProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";

  if (!products.length) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag className="mx-auto mb-4 size-12 text-neutral-200 dark:text-neutral-800" />
        <p className="text-base font-medium text-neutral-500">
          Không tìm thấy sản phẩm nào
        </p>
        <p className="mt-1 text-sm text-neutral-400">
          Thử từ khóa khác hoặc kiểm tra lại chính tả
        </p>
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
            key={product.id ?? product.barcode}
            href={`/product/${product.barcode}`}
            className="group block"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
              {product.images?.[0]?.url ? (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  loading="lazy"
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-300 dark:text-neutral-700 text-lg font-medium">
                  {product.name.charAt(0)}
                </div>
              )}
              {!product.currentStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black">
                    Hết hàng
                  </span>
                </div>
              )}
            </div>
            <div className="mt-3 space-y-1">
              {product.category?.name && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={buildPageUrl(page - 1)}
              className="rounded-none border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
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
                  "flex h-9 w-9 items-center justify-center border text-sm",
                  p === page
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-neutral-200 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                )}
              >
                {p}
              </Link>
            ))}
          {page < totalPages && (
            <Link
              href={buildPageUrl(page + 1)}
              className="rounded-none border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Sau →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
