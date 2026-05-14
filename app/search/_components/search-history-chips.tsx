"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { clearSearchHistory, getSearchHistory } from "@/lib/search-history";

export function SearchHistoryChips() {
  const [items, setItems] = useState<string[]>([]);

  const refresh = useCallback(() => {
    setItems(getSearchHistory());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleClear = () => {
    clearSearchHistory();
    setItems([]);
  };

  if (!items.length) return null;

  return (
    <section aria-label="Tìm kiếm gần đây">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
          Gần đây
        </h2>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-medium text-neutral-500 underline underline-offset-2 hover:text-neutral-900 dark:hover:text-white"
        >
          Xóa lịch sử
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((q) => (
          <Link
            key={q}
            href={`/search?query=${encodeURIComponent(q)}`}
            className="rounded-none border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
          >
            {q}
          </Link>
        ))}
      </div>
    </section>
  );
}
