"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X } from "@phosphor-icons/react";

export function ActiveFilters() {
  const searchParams = useSearchParams();

  const filters: { key: string; label: string }[] = [];
  if (searchParams.get("inStock") === "true") {
    filters.push({ key: "inStock", label: "Chỉ còn hàng" });
  }
  if (searchParams.get("minPrice")) {
    filters.push({
      key: "minPrice",
      label: `Giá từ ${Number(searchParams.get("minPrice")).toLocaleString("vi-VN")}đ`,
    });
  }
  if (searchParams.get("maxPrice")) {
    filters.push({
      key: "maxPrice",
      label: `Giá đến ${Number(searchParams.get("maxPrice")).toLocaleString("vi-VN")}đ`,
    });
  }
  const color = searchParams.get("color");
  if (color) {
    filters.push({ key: "color", label: `Màu: ${color}` });
  }
  const size = searchParams.get("size");
  if (size) {
    filters.push({ key: "size", label: `Size: ${size}` });
  }
  if (searchParams.get("query")) {
    filters.push({ key: "query", label: `"${searchParams.get("query")}"` });
  }

  if (!filters.length) return null;

  const buildRemoveUrl = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete("page");
    return `?${params.toString()}`;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <Link
          key={f.key}
          href={buildRemoveUrl(f.key)}
          className="flex items-center gap-1.5 rounded-none border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500"
        >
          {f.label}
          <X className="size-3 shrink-0" />
        </Link>
      ))}
    </div>
  );
}
