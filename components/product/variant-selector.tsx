"use client";

import clsx from "clsx";
import type { ProductVariantPojo } from "@/types/product";
import { useRouter, useSearchParams } from "next/navigation";

type Combination = {
  id: number;
  availableStock?: number;
  [key: string]: string | number | boolean | undefined;
};

interface VariantSelectorProps {
  variants: ProductVariantPojo[];
  sizeKey?: string;
  colorKey?: string;
}

export function VariantSelector({ variants, sizeKey = "size", colorKey = "color" }: VariantSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id ?? 0,
    availableStock: variant.availableStock,
    [sizeKey.toLowerCase()]: variant.size,
    [colorKey.toLowerCase()]: variant.color ?? "",
  }));

  const updateOption = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const sizes = Array.from(new Set(variants.map((v) => v.size).filter((s): s is string => Boolean(s))));
  const colors = Array.from(new Set(variants.map((v) => v.color).filter((c): c is string => Boolean(c))));

  if (!sizes.length && !colors.length) return null;

  return (
    <div className="space-y-6">
      {sizes.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-wide">{sizeKey}</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const optionKey = sizeKey.toLowerCase();
              const isActive = searchParams.get(optionKey) === size;
              const isAvailable = combinations.some((c) => {
                const sizeMatch = c[optionKey] === size;
                const colorParam = searchParams.get(colorKey.toLowerCase());
                const colorMatch = !colorParam || !colorKey || c[colorKey.toLowerCase()] === colorParam;
                return sizeMatch && colorMatch && (c.availableStock ?? 0) > 0;
              });

              return (
                <button
                  key={size}
                  onClick={() => updateOption(optionKey, size)}
                  aria-disabled={!isAvailable}
                  className={clsx(
                    "min-w-[48px] rounded-full border px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : !isAvailable
                        ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 line-through dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-600"
                        : "border-neutral-300 hover:border-black dark:border-neutral-700 dark:hover:border-white"
                  )}
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
          <p className="mb-3 text-sm font-medium uppercase tracking-wide">{colorKey}</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const optionKey = colorKey.toLowerCase();
              const isActive = searchParams.get(optionKey) === color;
              const isAvailable = combinations.some((c) => {
                const colorMatch = c[optionKey] === color;
                const sizeParam = searchParams.get(sizeKey.toLowerCase());
                const sizeMatch = !sizeParam || !sizeKey || c[sizeKey.toLowerCase()] === sizeParam;
                return colorMatch && sizeMatch && (c.availableStock ?? 0) > 0;
              });

              return (
                <button
                  key={color}
                  onClick={() => updateOption(optionKey, color)}
                  aria-disabled={!isAvailable}
                  className={clsx(
                    "rounded-full border px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : !isAvailable
                        ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 line-through dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-600"
                        : "border-neutral-300 hover:border-black dark:border-neutral-700 dark:hover:border-white"
                  )}
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
