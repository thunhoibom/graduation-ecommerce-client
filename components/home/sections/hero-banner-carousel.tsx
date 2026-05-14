"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const AUTO_INTERVAL_MS = 5000;

interface HeroBannerCarouselProps {
  banners: string[];
  brandName: string;
}

export function HeroBannerCarousel({ banners, brandName }: HeroBannerCarouselProps) {
  const count = banners.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (direction: -1 | 1) => {
      if (count <= 0) return;
      setActive((index) => (index + direction + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count <= 1 || paused) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % count);
    }, AUTO_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [count, paused]);

  useEffect(() => {
    setActive((index) => (count > 0 ? Math.min(index, count - 1) : 0));
  }, [count]);

  if (count === 0) return null;

  return (
    <div
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative w-full overflow-hidden bg-neutral-950"
        role="region"
        aria-roledescription="carousel"
        aria-label="Banner khuyến mãi"
      >
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform"
          style={{
            width: `${count * 100}%`,
            transform: `translateX(-${(active * 100) / count}%)`,
          }}
        >
          {banners.map((bannerUrl, index) => (
            <div
              key={`${bannerUrl}-${index}`}
              className="relative aspect-[16/9] w-full shrink-0 sm:aspect-[21/9] lg:aspect-[21/8]"
              style={{ width: `${100 / count}%` }}
              aria-hidden={index !== active}
            >
              <Image
                src={bannerUrl}
                alt={`${brandName} banner ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-black/10"
                aria-hidden
              />
            </div>
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent"
          aria-hidden
        />

        {count > 1 && (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-none border border-white/30 bg-black/35 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/50"
              onClick={() => go(-1)}
              aria-label="Banner trước"
            >
              ←
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-none border border-white/30 bg-black/35 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/50"
              onClick={() => go(1)}
              aria-label="Banner sau"
            >
              →
            </button>
            <div
              className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/45 to-transparent px-4 pb-4 pt-10"
              role="tablist"
              aria-label="Chọn banner"
            >
              {banners.map((bannerUrl, index) => (
                <button
                  key={`dot-${bannerUrl}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Banner ${index + 1}${index === active ? " (đang xem)" : ""}`}
                  className={cn(
                    "h-2 rounded-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
                    index === active
                      ? "w-8 bg-white"
                      : "w-2 bg-white/45 hover:bg-white/70",
                  )}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
