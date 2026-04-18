"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CaretDownIcon } from "@phosphor-icons/react";
import { FilterSidebar } from "@/app/collections/[slug]/_components/filter-sidebar";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { label: "Tên A–Z", value: "name,asc" },
  { label: "Tên Z–A", value: "name,desc" },
  { label: "Giá thấp → cao", value: "price,asc" },
  { label: "Giá cao → thấp", value: "price,desc" },
  { label: "Mới nhất", value: "createdAt,desc" },
];

interface SearchHeaderProps {
  totalCount: number;
  sortBy: string;
  sortDir: "asc" | "desc";
}

export function SearchHeader({ totalCount, sortBy, sortDir }: SearchHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";

  const currentSort = `${sortBy},${sortDir}`;
  const activeOption = SORT_OPTIONS.find((o) => o.value === currentSort);

  const updateSort = (value: string) => {
    const [by, dir] = value.split(",");
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", by!);
    params.set("sortDir", dir!);
    params.delete("page");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Count */}
      <p className="text-sm text-neutral-500">
        Tìm thấy{" "}
        <span className="font-medium text-neutral-900 dark:text-white">{totalCount}</span>{" "}
        sản phẩm cho &ldquo;<span className="font-medium">{query}</span>&rdquo;
      </p>

      {/* Desktop: sort + filter */}
      <div className="hidden sm:flex items-center gap-3">
        <span className="text-sm text-neutral-500">Sắp xếp:</span>
        <div className="relative">
          <label className="sr-only" htmlFor="search-sort">
            Sắp xếp
          </label>
          <select
            id="search-sort"
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

        <FilterSidebar />
      </div>

      {/* Mobile: filter + sort row */}
      <div className="flex items-center gap-2 sm:hidden">
        <FilterSidebar isMobile />
        <div className="relative flex-1">
          <label className="sr-only" htmlFor="search-sort-mobile">
            Sắp xếp
          </label>
          <select
            id="search-sort-mobile"
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
