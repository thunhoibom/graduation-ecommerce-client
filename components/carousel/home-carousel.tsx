"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import type { ProductListItem } from "@/types/product";

interface HomeCarouselProps {
  products: ProductListItem[];
}

export function HomeCarousel({ products }: HomeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const itemWidth = scrollRef.current.querySelector("li")?.offsetWidth ?? 280;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -(itemWidth * 4) : itemWidth * 4,
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
        <div className="relative">
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
                <div className="relative aspect-[3/4] overflow-hidden rounded-none border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                  {product.images?.[0]?.url ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 240px, 260px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                      <span className="text-sm">{product.name}</span>
                    </div>
                  )}

                  {/* Out of stock overlay */}
                  {!product.currentStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black">
                        Hết hàng
                      </span>
                    </div>
                  )}
                </div>

                {/* Product info */}
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
                    {formatMoney(product.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}