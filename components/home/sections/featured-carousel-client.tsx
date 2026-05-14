"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CaretLeft, CaretRight, ShoppingBag } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { HomeSectionHeader } from "@/components/home/sections/home-section-header";
import type { ProductListItem } from "@/types/product";
import { resolveProductCardPricing } from "@/lib/product-pricing";
import { ProductDiscountBadge } from "@/components/product/product-discount-badge";
import { ProductCardPrice } from "@/components/product/product-card-price";

interface Props {
  products: ProductListItem[];
}

export function FeaturedCarouselClient({ products }: Props) {
  const scrollRef = useRef<HTMLUListElement>(null);

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
    <section className="home-surface-muted home-section">
      <div className="section-shell">
        <HomeSectionHeader
          eyebrow="Nổi bật"
          title="Đáng chú ý"
          action={
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("left")}
                aria-label="Cuộn sang trái"
                className="size-9 rounded-none"
              >
                <CaretLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("right")}
                aria-label="Cuộn sang phải"
                className="size-9 rounded-none"
              >
                <CaretRight className="size-4" />
              </Button>
            </>
          }
        />

        <ul
          ref={scrollRef}
          className="flex snap-x snap-proximity gap-5 overflow-x-auto scroll-smooth pb-2 pl-1 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => {
            const pricing = resolveProductCardPricing(product);
            return (
              <li key={product.barcode} className="snap-start">
                <Link
                  href={`/product/${product.barcode}`}
                  className="group flex w-[240px] flex-none flex-col md:w-[260px]"
                >
                  <div className="home-product-media">
                    {product.images?.[0]?.url ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        loading="lazy"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 240px, 260px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag className="size-8 text-neutral-400" />
                      </div>
                    )}

                    {pricing.hasDiscount ? (
                      <ProductDiscountBadge discountPercent={pricing.discountPercent} />
                    ) : null}

                    {product.currentStock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="rounded-none bg-white/90 px-3 py-1 text-xs font-medium text-black">
                          Hết hàng
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 w-full space-y-1.5">
                    {product.category?.name && (
                      <p className="text-xs uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                        {product.category.name}
                      </p>
                    )}
                    <h3 className="truncate text-base font-medium text-neutral-900 dark:text-white">
                      {product.name}
                    </h3>
                    <ProductCardPrice pricing={pricing} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
