"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CaretDownIcon } from "@phosphor-icons/react";
import { SearchBox } from "./search-box";

const SORT_OPTIONS = [
  { label: "Liên quan nhất", value: "relevance,desc" },
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
  hasQuery: boolean;
}

/** Layout aligned with `AllProductsHeader` (collection “all” page) plus search field row */
export function SearchHeader({ totalCount, sortBy, sortDir, hasQuery }: SearchHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? searchParams.get("q") ?? "";

  const currentSort = `${sortBy},${sortDir}`;

  const updateSort = (value: string) => {
    const [by, dir] = value.split(",");
    const params = new URLSearchParams(searchParams.toString());
    if (by === "relevance") {
      params.delete("sortBy");
      params.delete("sortDir");
    } else {
      params.set("sortBy", by!);
      params.set("sortDir", dir!);
    }
    params.delete("page");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-6 border-b border-neutral-200 pb-4 dark:border-neutral-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Tìm kiếm
          </h1>
          {hasQuery && (
            <p className="mt-0.5 text-sm text-neutral-500">
              {totalCount} sản phẩm
              {query ? (
                <>
                  {" "}
                  cho &ldquo;
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{query}</span>
                  &rdquo;
                </>
              ) : null}
            </p>
          )}
        </div>

        {hasQuery && (
          <div className="hidden items-center gap-3 sm:flex">
            <span className="text-sm text-neutral-500">Sắp xếp:</span>
            <div className="relative">
              <label className="sr-only" htmlFor="search-sort">
                Sắp xếp
              </label>
              <select
                id="search-sort"
                value={currentSort}
                onChange={(e) => updateSort(e.target.value)}
                className="cursor-pointer appearance-none rounded-none border border-neutral-200 bg-white py-2 pl-4 pr-10 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
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
        )}
      </div>

      <div className="mt-4">
        <SearchBox />
      </div>

      {hasQuery && (
        <div className="mt-4 flex sm:hidden">
          <div className="relative w-full">
            <label className="sr-only" htmlFor="search-sort-mobile">
              Sắp xếp
            </label>
            <select
              id="search-sort-mobile"
              value={currentSort}
              onChange={(e) => updateSort(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-none border border-neutral-200 bg-white py-2.5 pl-4 pr-10 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
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
      )}
    </div>
  );
}
