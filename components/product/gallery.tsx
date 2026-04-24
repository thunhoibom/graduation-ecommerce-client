"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { ProductImage, ProductVariantPojo } from "@/types/product";

interface GalleryProps {
  images: ProductImage[];
  productName: string;
  variants?: ProductVariantPojo[];
}

export function Gallery({ images, productName, variants = [] }: GalleryProps) {
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

  const imageIndex = searchParams.has("image")
    ? parseInt(searchParams.get("image")!)
    : 0;

  const goToImage = (index: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("image", String(index));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  if (!displayImages.length) {
    return (
      <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
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
      {/* Thumbnails list (Desktop: Left/Vertical, Mobile: Bottom/Horizontal) */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-y-auto lg:h-[600px] lg:w-20 lg:shrink-0 lg:pb-0 hide-scrollbar">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => goToImage(i)}
              className={`relative flex-shrink-0 h-16 w-16 lg:h-24 lg:w-20 overflow-hidden transition-all ${i === imageIndex
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

      {/* Main Focus Area */}
      <div className="group relative flex-1 aspect-[4/5] bg-neutral-50 dark:bg-neutral-900 overflow-hidden cursor-zoom-in">
        <Image
          src={current.url}
          alt={`${productName} - ảnh ${imageIndex + 1}`}
          fill
          priority={imageIndex === 0}
          className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
          sizes="(min-width: 1024px) 40vw, 100vw"
        />

        {/* Floating Controls */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 transition-opacity group-hover:opacity-100 hidden md:flex">
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToImage(prevIndex); }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-xl backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
                aria-label="Ảnh trước"
              >
                <CaretLeft className="size-6 text-black" weight="bold" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToImage(nextIndex); }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-xl backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
                aria-label="Ảnh sau"
              >
                <CaretRight className="size-6 text-black" weight="bold" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Indicator */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5 md:hidden">
            {displayImages.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${i === imageIndex ? "w-6 bg-black" : "w-1.5 bg-black/20"
                  }`}
              />
            ))}
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-black/10 backdrop-blur-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
            Collection 2026
          </span>
        </div>
      </div>
    </div>
  );
}
