"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { CollectionListItem } from "@/types/collection";
import { cn } from "@/lib/utils";

const AUTO_INTERVAL_MS = 4500;

function collectionImageUrl(col: CollectionListItem): string | undefined {
  return col.imageUrl ?? col.image?.url;
}

function CollectionTile({
  col,
  variant,
}: {
  col: CollectionListItem;
  variant: "featured" | "compact";
}) {
  const imageUrl = collectionImageUrl(col);
  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/collections/${col.code}`}
      className={
        isFeatured
          ? "group relative block h-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-200 shadow-sm ring-1 ring-black/5 transition hover:border-neutral-900/20 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-800 dark:ring-white/10 dark:hover:border-neutral-500"
          : "group relative aspect-square overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-200 shadow-sm ring-1 ring-black/5 transition hover:border-neutral-900/20 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-800 dark:ring-white/10 dark:hover:border-neutral-500"
      }
    >
      <div
        className={
          isFeatured
            ? "relative aspect-[5/3] min-h-[200px] w-full sm:aspect-[2.2/1] sm:min-h-[240px] md:min-h-[280px]"
            : "absolute inset-0"
        }
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={col.name}
            fill
            className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
            sizes={
              isFeatured
                ? "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
                : "(max-width: 768px) 50vw, 25vw"
            }
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-300 dark:bg-neutral-700">
            <span className="text-4xl font-bold tracking-tight text-neutral-500 dark:text-neutral-400 md:text-5xl">
              {col.name.charAt(0)}
            </span>
          </div>
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent transition duration-300 group-hover:from-black/80"
          aria-hidden
        />
        <div
          className={
            isFeatured
              ? "absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-6 md:p-8 md:flex-row md:items-end md:justify-between"
              : "absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3 sm:p-4"
          }
        >
          <div className="min-w-0">
            <h3
              className={
                isFeatured
                  ? "text-2xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-3xl md:text-4xl"
                  : "line-clamp-2 text-base font-semibold leading-snug tracking-tight text-white drop-shadow-sm sm:text-lg"
              }
            >
              {col.name}
            </h3>
            {col.productCount !== undefined && (
              <p
                className={
                  isFeatured ? "mt-1 text-sm text-white/85" : "mt-0.5 text-xs text-white/80"
                }
              >
                {col.productCount} sản phẩm
              </p>
            )}
          </div>
          <span
            className={
              isFeatured
                ? "inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition group-hover:border-white/40 group-hover:bg-white/15 md:self-end"
                : "mt-1 inline-flex w-max items-center gap-1 text-xs font-medium text-white/90 opacity-90 transition group-hover:opacity-100"
            }
          >
            Khám phá
            <svg
              className={isFeatured ? "size-4" : "size-3.5"}
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M4 12l8-8M5 4h7v7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CollectionsShowcaseClient({ collections }: { collections: CollectionListItem[] }) {
  const n = collections.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (n <= 0) return;
      setActive((i) => (i + dir + n) % n);
    },
    [n]
  );

  useEffect(() => {
    if (n <= 1 || paused) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % n);
    }, AUTO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [n, paused]);

  useEffect(() => {
    setActive((a) => (n > 0 ? Math.min(a, n - 1) : 0));
  }, [n]);

  if (n === 0) return null;

  return (
    <div
      className="flex flex-col gap-4 sm:gap-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative rounded-2xl outline-none ring-offset-2 ring-offset-neutral-100 focus-within:ring-2 focus-within:ring-neutral-400 dark:ring-offset-neutral-900 dark:focus-within:ring-neutral-600"
        role="region"
        aria-roledescription="carousel"
        aria-label="Bộ sưu tập nổi bật"
      >
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform"
            style={{
              width: `${n * 100}%`,
              transform: `translateX(-${(active * 100) / n}%)`,
            }}
          >
            {collections.map((col, i) => (
              <div
                key={col.code}
                style={{ width: `${100 / n}%` }}
                className="shrink-0"
                aria-hidden={i !== active}
              >
                <CollectionTile col={col} variant="featured" />
              </div>
            ))}
          </div>
        </div>

        {n > 1 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Chọn bộ sưu tập">
              {collections.map((col, i) => (
                <button
                  key={col.code}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`${col.name}${i === active ? " (đang xem)" : ""}`}
                  className={cn(
                    "h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
                    i === active ? "w-8 bg-neutral-900 dark:bg-white" : "w-2 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500"
                  )}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
                onClick={() => go(-1)}
                aria-label="Bộ sưu tập trước"
              >
                ←
              </button>
              <button
                type="button"
                className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
                onClick={() => go(1)}
                aria-label="Bộ sưu tập sau"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {n > 1 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {collections.map((col) => (
            <li key={`grid-${col.code}`}>
              <CollectionTile col={col} variant="compact" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
