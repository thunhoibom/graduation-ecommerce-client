"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CaretLeft, CaretRight, ShoppingBag } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import type { ProductListItem } from "@/types/product";

interface Props {
  products: ProductListItem[];
}

export function FeaturedCarouselClient({ products }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const item = scrollRef.current.querySelector("li");
    const itemWidth = item?.offsetWidth ?? 272;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -(itemWidth * 2) : itemWidth * 2,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Đáng chú ý
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              aria-label="Cuộn sang trái"
              className="size-9"
            >
              <CaretLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              aria-label="Cuộn sang phải"
              className="size-9"
            >
              <CaretRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 pl-1 pr-1 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <Link
              key={product.barcode}
              href={`/product/${product.barcode}`}
              className="group flex-none w-[240px] md:w-[260px]"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                {product.images?.[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    loading="lazy"
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 240px, 260px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="size-8 text-neutral-400" />
                  </div>
                )}

                {/* Out-of-stock overlay */}
                {product.currentStock === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black">
                      Hết hàng
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="mt-3 space-y-1">
                {product.category?.name && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {product.category.name}
                  </p>
                )}
                <h3 className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                  {product.name}
                </h3>
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {formatMoney(product.currentPrice)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
