"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { ProductImage, ProductVariantPojo } from "@/types/product";

interface GalleryProps {
  images: ProductImage[];
  productName: string;
  variants?: ProductVariantPojo[];
  /** When set with hasDiscount, shows discount badge */
  discountPercent?: number;
  hasDiscount?: boolean;
  /** Fallback label on image when no discount */
  categoryName?: string;
}

export function Gallery({
  images,
  productName,
  variants = [],
  discountPercent,
  hasDiscount,
  categoryName,
}: GalleryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sizeParam = searchParams.get("size");
  const colorParam = searchParams.get("color");

  const selectedVariant = variants.find(
    (variant) =>
      (sizeParam == null || variant.size === sizeParam) &&
      (colorParam == null || variant.color === colorParam)
  );

  const variantImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : selectedVariant?.primaryImageUrl
      ? [{ url: selectedVariant.primaryImageUrl }]
      : [];

  const displayImages = variantImages.length ? variantImages : images;

  const imageIndex = searchParams.has("image") ? parseInt(searchParams.get("image")!, 10) : 0;

  const goToImage = (index: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("image", String(index));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const badgeText =
    hasDiscount && discountPercent != null && discountPercent > 0
      ? `-${discountPercent}%`
      : categoryName?.trim() || null;

  if (!displayImages.length) {
    return (
      <div className="relative flex aspect-square w-full items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <span className="text-neutral-400">{productName}</span>
      </div>
    );
  }

  const current =
    imageIndex < displayImages.length ? displayImages[imageIndex]! : displayImages[0]!;
  const prevIndex = imageIndex === 0 ? displayImages.length - 1 : imageIndex - 1;
  const nextIndex = imageIndex + 1 < displayImages.length ? imageIndex + 1 : 0;

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row lg:gap-6">
      {displayImages.length > 1 && (
        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1 lg:h-[600px] lg:w-20 lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:pb-0">
          {displayImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToImage(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden transition-all lg:h-24 lg:w-20 ${
                i === imageIndex
                  ? "ring-1 ring-black ring-offset-2 dark:ring-white dark:ring-offset-black"
                  : "opacity-60 hover:opacity-100"
              }`}
              aria-label={`Xem ảnh ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 80px, 64px"
              />
            </button>
          ))}
        </div>
      )}

      <div className="group relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden bg-neutral-50 dark:bg-neutral-900">
        <Image
          src={current.url}
          alt={`${productName} - ảnh ${imageIndex + 1}`}
          fill
          priority={imageIndex === 0}
          className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
          sizes="(min-width: 1024px) 40vw, 100vw"
        />

        <div className="absolute inset-0 hidden items-center justify-between p-4 opacity-0 transition-opacity group-hover:opacity-100 md:flex">
          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(prevIndex);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-xl backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
                aria-label="Ảnh trước"
              >
                <CaretLeft className="size-6 text-black" weight="bold" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(nextIndex);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-xl backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
                aria-label="Ảnh sau"
              >
                <CaretRight className="size-6 text-black" weight="bold" />
              </button>
            </>
          )}
        </div>

        {displayImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5 md:hidden">
            {displayImages.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === imageIndex ? "w-6 bg-black" : "w-1.5 bg-black/20"
                }`}
              />
            ))}
          </div>
        )}

        {badgeText ? (
          <div className="absolute left-4 top-4 max-w-[85%]">
            <span className="inline-block bg-black/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-black/80 backdrop-blur-md dark:text-white/80">
              {badgeText}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
