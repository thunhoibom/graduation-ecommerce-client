"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ProductVariantPojo } from "@/types/product";

interface VariantSelectorProps {
  variants: ProductVariantPojo[];
  sizeKey?: string;
  colorKey?: string;
  onVariantChange?: (sku: string | null) => void;
}

function variantOnHand(v: ProductVariantPojo): number {
  return v.availableStock ?? v.currentStock ?? 0;
}

export function VariantSelector({
  variants,
  sizeKey = "size",
  colorKey = "color",
  onVariantChange,
}: VariantSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sizes = Array.from(
    new Set(
      variants
        .map((v) => v.size)
        .filter((s): s is string => Boolean(s))
    )
  );
  const colors = Array.from(
    new Set(
      variants
        .map((v) => v.color)
        .filter((c): c is string => Boolean(c))
    )
  );

  if (!sizes.length && !colors.length) return null;

  const sizeParam = searchParams.get(sizeKey.toLowerCase());
  const colorParam = searchParams.get(colorKey.toLowerCase());

  const isSizeAvailable = (size: string) =>
    variants.some(
      (v) =>
        v.size === size &&
        ((colorParam && v.color === colorParam) || !colorParam) &&
        variantOnHand(v) > 0
    );

  const isColorAvailable = (color: string) =>
    variants.some(
      (v) =>
        v.color === color &&
        ((sizeParam && v.size === sizeParam) || !sizeParam) &&
        variantOnHand(v) > 0
    );

  const handleSelect = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(name);
    if (current === value) {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    router.replace(`?${params.toString()}`, { scroll: false });

    if (onVariantChange) {
      const s = params.get(sizeKey.toLowerCase()) ?? undefined;
      const c = params.get(colorKey.toLowerCase()) ?? undefined;
      const matched = variants.find(
        (v) =>
          (s === undefined || v.size === s) &&
          (c === undefined || v.color === c)
      );
      onVariantChange(matched?.sku ?? null);
    }
  };

  return (
    <div className="space-y-6">
      {sizes.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Kích thước
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isActive = sizeParam === size;
              const available = isSizeAvailable(size);
              return (
                <button
                  key={size}
                  onClick={() => handleSelect(sizeKey.toLowerCase(), size)}
                  disabled={!available}
                  className={[
                    "min-w-[48px] rounded-none border px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                      : available
                        ? "border-neutral-200 text-neutral-700 hover:border-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white"
                        : "cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-300 line-through dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-700",
                  ].join(" ")}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Màu sắc
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isActive = colorParam === color;
              const available = isColorAvailable(color);
              return (
                <button
                  key={color}
                  onClick={() => handleSelect(colorKey.toLowerCase(), color)}
                  disabled={!available}
                  className={[
                    "rounded-none border px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                      : available
                        ? "border-neutral-200 text-neutral-700 hover:border-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white"
                        : "cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-300 line-through dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-700",
                  ].join(" ")}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
