"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { ProductImage } from "@/types/product";

interface GalleryProps {
  images: ProductImage[];
  productName: string;
}

export function Gallery({ images, productName }: GalleryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageIndex = searchParams.has("image")
    ? parseInt(searchParams.get("image")!)
    : 0;

  const goToImage = (index: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("image", String(index));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  if (!images.length) {
    return (
      <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
        <span className="text-neutral-400">{productName}</span>
      </div>
    );
  }

  const current = imageIndex < images.length ? images[imageIndex]! : images[0]!;
  const prevIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;
  const nextIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <Image
          src={current.url}
          alt={`${productName} - ảnh ${imageIndex + 1}`}
          fill
          priority={imageIndex === 0}
          className="object-contain"
          sizes="(min-width: 1024px) 60vw, 100vw"
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => goToImage(prevIndex)}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm hover:bg-white dark:bg-black/60 dark:hover:bg-black"
              aria-label="Ảnh trước"
            >
              <CaretLeft className="size-5" />
            </button>
            <button
              onClick={() => goToImage(nextIndex)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm hover:bg-white dark:bg-black/60 dark:hover:bg-black"
              aria-label="Ảnh sau"
            >
              <CaretRight className="size-5" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goToImage(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === imageIndex
                    ? "w-6 bg-black dark:bg-white"
                    : "w-1.5 bg-black/30 dark:bg-white/30"
                }`}
                aria-label={`Đến ảnh ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goToImage(i)}
              className={`relative flex-shrink-0 h-16 w-16 overflow-hidden rounded border-2 transition-colors ${
                i === imageIndex
                  ? "border-black dark:border-white"
                  : "border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
              }`}
              aria-label={`Xem ảnh ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
