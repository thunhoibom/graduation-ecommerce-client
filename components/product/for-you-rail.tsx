"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getOrCreateDeviceId } from "@/lib/device-id";
import { getForYouRecommendations } from "@/services/rest-api/products/products";
import type { ProductListItem } from "@/types/product";
import { cn } from "@/lib/utils";
import { mapSearchItemToListItem, resolveProductCardPricing } from "@/lib/product-pricing";
import { ProductDiscountBadge } from "@/components/product/product-discount-badge";
import { ProductCardPrice } from "@/components/product/product-card-price";

export type ForYouRailVariant = "home" | "search" | "pdp" | "cart" | "checkout_success";

interface Props {
  variant: ForYouRailVariant;
  /** Required for search variant (other placements can omit). */
  query?: string;
  excludeIds?: string[];
}

export function ForYouRail({ variant, query = "", excludeIds }: Props) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(2);

  const q = query.trim();
  const excludeKey = excludeIds?.length ? excludeIds.join(",") : "";

  useEffect(() => {
    let cancelled = false;
    if (variant === "search" && !q) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const deviceId = getOrCreateDeviceId() ?? undefined;

    getForYouRecommendations({
      query: variant === "home" ? undefined : q,
      excludeIds: excludeIds?.length ? excludeIds : undefined,
      deviceId,
      pageSize: 12,
      placement: variant,
    })
      .then((res) => {
        if (cancelled) return;
        const items = (res.items ?? []).map((item) => mapSearchItemToListItem(item));
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
  }, [variant, q, excludeKey]);

  useEffect(() => {
    const computeItemsPerSlide = () => {
      if (window.innerWidth >= 1280) return 6;
      if (window.innerWidth >= 1024) return 5;
      if (window.innerWidth >= 768) return 4;
      if (window.innerWidth >= 640) return 3;
      return 2;
    };

    const apply = () => setItemsPerSlide(computeItemsPerSlide());
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  const totalSlides = useMemo(() => {
    if (!products.length) return 1;
    return Math.ceil(products.length / itemsPerSlide);
  }, [products.length, itemsPerSlide]);

  useEffect(() => {
    if (currentSlide > totalSlides - 1) {
      setCurrentSlide(Math.max(0, totalSlides - 1));
    }
  }, [currentSlide, totalSlides]);

  if (variant === "search" && !q) return null;

  const description =
    variant === "home"
      ? "Gợi ý theo danh mục sản phẩm bạn đã xem gần đây"
      : variant === "search"
      ? "Gợi ý thêm dựa trên từ khóa và sản phẩm bạn đã xem gần đây"
      : variant === "cart"
      ? "Gợi ý mua kèm dựa trên giỏ hàng và hành vi gần đây"
      : variant === "checkout_success"
      ? "Gợi ý tiếp theo dựa trên lịch sử mua gần nhất"
      : "Gợi ý tương tự theo sản phẩm bạn đang xem";

  const emptyMessage =
    variant === "home"
      ? "Chưa có dữ liệu gợi ý cá nhân. Hãy xem vài sản phẩm để chúng tôi học sở thích của bạn."
      : variant === "search"
      ? "Chưa có thêm gợi ý — thường do toàn bộ sản phẩm khớp từ khóa đã nằm trong kết quả phía trên."
      : "Hiện chưa có gợi ý phù hợp. Bạn có thể khám phá thêm trong bộ sưu tập.";

  const inner = (
    <>
      <div
        className={cn(
          "mb-5 flex flex-col gap-1",
          variant === "home" && "sm:flex-row sm:items-end sm:justify-between"
        )}
      >
        <div>
          {variant === "home" ? <p className="section-subtitle">Cá nhân hóa</p> : null}
          <h2
            className={cn(
              "font-semibold tracking-tight text-neutral-900 dark:text-white",
              variant === "home" ? "section-title mt-1" : "text-lg"
            )}
          >
            Dành riêng cho bạn
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[140px] shrink-0 md:w-[160px]" aria-hidden>
              <div className="aspect-[3/4] animate-pulse bg-neutral-200 dark:bg-neutral-800" />
              <div className="mt-2 h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                const start = slideIndex * itemsPerSlide;
                const slice = products.slice(start, start + itemsPerSlide);
                return (
                  <div key={slideIndex} className="grid w-full shrink-0 grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {slice.map((product) => {
                      const pricing = resolveProductCardPricing(product);
                      return (
                      <Link
                        key={product.id ?? product.barcode}
                        href={`/product/${product.barcode}`}
                        className="group min-w-0"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                          {product.images?.[0]?.url ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              loading="lazy"
                              className="object-cover transition duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-lg font-medium text-neutral-300 dark:text-neutral-700">
                              {product.name.charAt(0)}
                            </div>
                          )}
                          {pricing.hasDiscount ? (
                            <ProductDiscountBadge discountPercent={pricing.discountPercent} />
                          ) : null}
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
                          <ProductCardPrice pricing={pricing} />
                        </div>
                      </Link>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            {totalSlides > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                  disabled={currentSlide === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm text-neutral-900 shadow disabled:opacity-40 dark:bg-neutral-900/90 dark:text-white"
                  aria-label="Slide trước"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1))}
                  disabled={currentSlide >= totalSlides - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm text-neutral-900 shadow disabled:opacity-40 dark:bg-neutral-900/90 dark:text-white"
                  aria-label="Slide sau"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {totalSlides > 1 && (
            <div className="flex items-center justify-center gap-1.5">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    idx === currentSlide
                      ? "w-6 bg-neutral-900 dark:bg-white"
                      : "w-2.5 bg-neutral-300 dark:bg-neutral-700"
                  )}
                  aria-label={`Tới slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );

  if (variant === "home") {
    return (
      <section className="home-surface home-section border-t border-neutral-200/80 dark:border-neutral-800">
        <div className="section-shell">{inner}</div>
      </section>
    );
  }

  return (
    <section className="mt-14 border-t border-neutral-200 pt-10 dark:border-neutral-800">{inner}</section>
  );
}
