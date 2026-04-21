"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Form from "next/form";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { searchProducts } from "@/services/rest-api/products/products";
import type { ProductSearchItem } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/utils";

export default function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inputValue, setInputValue] = useState(searchParams?.get("query") || "");
  const [suggestions, setSuggestions] = useState<ProductSearchItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(inputValue, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      if (debouncedQuery.trim().length >= 2) {
        setIsLoading(true);
        try {
          const res = await searchProducts({ query: debouncedQuery, pageSize: 6 });
          setSuggestions(res.items || []);
          setShowSuggestions(true);
        } catch (err) {
          console.error("Suggestion fetch error:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }

    fetchSuggestions();
  }, [debouncedQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full group" ref={containerRef}>
      <Form
        action="/search"
        className="relative w-full"
        onSubmit={() => setShowSuggestions(false)}
      >
        <input
          type="text"
          name="query"
          placeholder="Tìm sản phẩm…"
          autoComplete="off"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          className="w-full rounded-full border border-neutral-200 bg-neutral-50 px-5 py-2 text-sm transition-all placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-400"
        />
        <button
          type="submit"
          aria-label="Tìm kiếm"
          className="absolute right-0 top-0 mr-1 flex h-full items-center p-2 text-neutral-400 hover:text-neutral-900 transition-colors dark:hover:text-white"
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
        </button>
      </Form>

      {/* Suggestion Dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-neutral-500">Đang tìm...</div>
          ) : (
            <div className="flex flex-col">
              <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50">
                Gợi ý sản phẩm
              </div>
              {suggestions.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.barcode}`}
                  onClick={() => setShowSuggestions(false)}
                  className="flex items-center gap-3 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-neutral-100 dark:bg-neutral-800">
                    {item.primaryImageUrl ? (
                      <Image
                        src={item.primaryImageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                      {item.name}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {formatMoney(item.price)}
                    </span>
                  </div>
                </Link>
              ))}
              <Link
                href={`/search?query=${inputValue}`}
                onClick={() => setShowSuggestions(false)}
                className="border-t border-neutral-100 p-3 text-center text-xs font-semibold text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-800"
              >
                Xem tất cả kết quả cho "{inputValue}"
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="relative w-full lg:w-80 xl:w-full animate-pulse">
      <div className="h-[38px] rounded-full border border-neutral-200 bg-neutral-100 dark:bg-neutral-800" />
    </div>
  );
}
