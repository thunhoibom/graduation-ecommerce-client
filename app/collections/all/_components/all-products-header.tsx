"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CaretDownIcon } from "@phosphor-icons/react";

const SORT_OPTIONS = [
  { label: "Tên A–Z", value: "name,asc" },
  { label: "Tên Z–A", value: "name,desc" },
  { label: "Giá thấp → cao", value: "price,asc" },
  { label: "Giá cao → thấp", value: "price,desc" },
  { label: "Mới nhất", value: "createdAt,desc" },
];

interface AllProductsHeaderProps {
  totalCount: number;
  sortBy: string;
  sortDir: string;
}

export function AllProductsHeader({ totalCount, sortBy, sortDir }: AllProductsHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = `${sortBy},${sortDir}`;

  const updateSort = (value: string) => {
    const [by, dir] = value.split(",");
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", by!);
    params.set("sortDir", dir!);
    params.delete("page");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Tất cả sản phẩm
        </h1>
        <p className="mt-0.5 text-sm text-neutral-500">{totalCount} sản phẩm</p>
      </div>

      {/* Desktop: sort */}
      <div className="hidden sm:flex items-center gap-3">
        <span className="text-sm text-neutral-500">Sắp xếp:</span>
        <div className="relative">
          <label className="sr-only" htmlFor="all-sort">Sắp xếp</label>
          <select
            id="all-sort"
            value={currentSort}
            onChange={(e) => updateSort(e.target.value)}
            className="appearance-none rounded-none border border-neutral-200 bg-white pl-4 pr-10 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 text-neutral-900 dark:text-white cursor-pointer focus:border-neutral-900 focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <CaretDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
        </div>
      </div>

      {/* Mobile: sort only */}
      <div className="flex items-center gap-2 sm:hidden">
        <div className="relative flex-1">
          <label className="sr-only" htmlFor="all-sort-mobile">Sắp xếp</label>
          <select
            id="all-sort-mobile"
            value={currentSort}
            onChange={(e) => updateSort(e.target.value)}
            className="w-full appearance-none rounded-none border border-neutral-200 bg-white pl-4 pr-10 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-950 text-neutral-900 dark:text-white cursor-pointer focus:border-neutral-900 focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <CaretDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
        </div>
      </div>
    </div>
  );
}
