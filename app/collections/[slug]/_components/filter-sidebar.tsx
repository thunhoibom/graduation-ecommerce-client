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
    const params = new URLSearchParams();
    params.set("page", "1");
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

        {/* Price Range */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Khoảng giá
          </span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Từ"
              value={minPrice ?? ""}
              onChange={(e) => updateParam("minPrice", e.target.value || null)}
              className="w-full rounded-none border border-neutral-200 bg-white px-2.5 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400"
            />
            <span className="text-neutral-400 dark:text-neutral-600 shrink-0">—</span>
            <input
              type="number"
              placeholder="Đến"
              value={maxPrice ?? ""}
              onChange={(e) => updateParam("maxPrice", e.target.value || null)}
              className="w-full rounded-none border border-neutral-200 bg-white px-2.5 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400"
            />
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
