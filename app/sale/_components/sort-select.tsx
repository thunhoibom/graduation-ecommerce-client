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

export function SortSelect({
  sortBy,
  sortDir,
  baseHref,
}: {
  sortBy: string;
  sortDir: string;
  baseHref: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = `${sortBy},${sortDir}`;

  const updateSort = (value: string) => {
    const [by, dir] = value.split(",");
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", by!);
    params.set("sortDir", dir!);
    params.delete("page");
    router.replace(`${baseHref}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="sale-sort">
        Sắp xếp
      </label>
      <select
        id="sale-sort"
        value={currentSort}
        onChange={(e) => updateSort(e.target.value)}
        className="appearance-none cursor-pointer rounded-none border border-neutral-200 bg-white py-2 pl-4 pr-10 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <CaretDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
    </div>
  );
}
