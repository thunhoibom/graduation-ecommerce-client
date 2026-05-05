"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { Funnel, X } from "@phosphor-icons/react";
import { useState } from "react";

interface FilterSidebarProps {
  isMobile?: boolean;
}

function FilterContent({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const inStock = searchParams.get("inStock");
  const hasFilters = !!(minPrice || maxPrice || inStock);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.replace(`?${params.toString()}`);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["minPrice", "maxPrice", "inStock", "color", "size", "page"].forEach((k) =>
      params.delete(k)
    );
    router.replace(`?${params.toString()}`);
    onClose?.();
  };

  return (
    <>
      <SheetHeader className="flex flex-row items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <Funnel className="size-4 text-neutral-500" />
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
            Bộ lọc
          </span>
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline underline-offset-2"
          >
            Xóa tất cả
          </button>
        )}
      </SheetHeader>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* In Stock */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Tình trạng
          </span>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
            <input
              type="checkbox"
              checked={inStock === "true"}
              onChange={(e) => updateParam("inStock", e.target.checked ? "true" : null)}
              className="accent-neutral-900 dark:accent-white size-4 rounded-none"
            />
            Chỉ còn hàng
          </label>
        </div>

        {/* Color Filter */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Màu sắc
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { name: "Black", color: "#000000" },
              { name: "White", color: "#ffffff" },
              { name: "Navy", color: "#000080" },
              { name: "Beige", color: "#f5f5dc" },
              { name: "Grey", color: "#808080" },
            ].map((c) => (
              <button
                key={c.name}
                onClick={() => updateParam("color", searchParams.get("color") === c.name ? null : c.name)}
                title={c.name}
                className={`group relative flex size-7 items-center justify-center rounded-full border transition-all ${
                  searchParams.get("color") === c.name
                    ? "border-neutral-900 ring-1 ring-neutral-900 dark:border-white dark:ring-white"
                    : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-800"
                }`}
              >
                <span
                  className="size-5 rounded-full border border-neutral-100"
                  style={{ backgroundColor: c.color }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Size Filter */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Kích cỡ
          </span>
          <div className="grid grid-cols-4 gap-2">
            {["S", "M", "L", "XL", "30", "31", "32"].map((s) => (
              <button
                key={s}
                onClick={() => updateParam("size", searchParams.get("size") === s ? null : s)}
                className={`flex h-9 items-center justify-center border text-xs transition-all ${
                  searchParams.get("size") === s
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-neutral-200 hover:border-neutral-900 dark:border-neutral-800 dark:hover:border-white text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Khoảng giá
          </span>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 group-focus-within:text-neutral-900">đ</span>
              <input
                type="number"
                placeholder="Từ"
                value={minPrice ?? ""}
                onChange={(e) => updateParam("minPrice", e.target.value || null)}
                className="w-full rounded-none border border-neutral-200 bg-white pl-6 pr-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none transition-colors"
              />
            </div>
            <span className="text-neutral-400 dark:text-neutral-600 shrink-0">—</span>
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400">đ</span>
              <input
                type="number"
                placeholder="Đến"
                value={maxPrice ?? ""}
                onChange={(e) => updateParam("maxPrice", e.target.value || null)}
                className="w-full rounded-none border border-neutral-200 bg-white pl-6 pr-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Apply button (mobile) */}
      <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
        <Button
          onClick={onClose}
          className="w-full rounded-none"
          size="lg"
        >
          Áp dụng ({hasFilters ? "có lọc" : "mặc định"})
        </Button>
      </div>
    </>
  );
}

export function FilterSidebar({ isMobile }: FilterSidebarProps) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const inStock = searchParams.get("inStock");
  const hasFilters = !!(minPrice || maxPrice || inStock);

  // Desktop: inline sidebar
  if (!isMobile) {
    return (
      <aside className="w-52 shrink-0">
        <FilterContent />
      </aside>
    );
  }

  // Mobile: Sheet trigger + content
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-none"
        >
          <Funnel className="size-4" />
          Bộ lọc
          {hasFilters && (
            <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-medium text-white dark:bg-white dark:text-black">
              !
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="flex h-[70vh] flex-col bg-white dark:bg-neutral-950">
        <FilterContent onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
