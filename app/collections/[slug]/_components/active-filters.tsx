"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X } from "@phosphor-icons/react";

const FILTER_KEYS = [
  "inStock",
  "minPrice",
  "maxPrice",
  "color",
  "size",
  "query",
  "q",
] as const;

export function ActiveFilters() {
  const searchParams = useSearchParams();

  const rawQuery = (searchParams.get("query") ?? searchParams.get("q") ?? "").trim();

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
  if (rawQuery) {
    filters.push({ key: "searchQuery", label: `"${rawQuery}"` });
  }

  const buildRemoveUrl = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (key === "searchQuery") {
      params.delete("query");
      params.delete("q");
    } else {
      params.delete(key);
    }
    const qs = params.toString();
    return qs ? `?${qs}` : "?";
  };

  const buildClearAllUrl = () => {
    const params = new URLSearchParams(searchParams.toString());
    for (const k of FILTER_KEYS) {
      params.delete(k);
    }
    params.delete("page");
    const qs = params.toString();
    return qs ? `?${qs}` : "?";
  };

  if (!filters.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-full text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500 sm:w-auto">
        Bộ lọc đang áp dụng
      </span>
      {filters.map((f) => (
        <Link
          key={f.key + f.label}
          href={buildRemoveUrl(f.key)}
          className="flex items-center gap-1.5 rounded-none border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-500"
        >
          {f.label}
          <X className="size-3 shrink-0" aria-hidden />
        </Link>
      ))}
      <Link
        href={buildClearAllUrl()}
        className="text-xs font-medium text-neutral-600 underline-offset-2 hover:underline dark:text-neutral-400"
      >
        Xóa tất cả bộ lọc
      </Link>
    </div>
  );
}
