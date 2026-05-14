"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useRef } from "react";
import { addSearchHistoryEntry } from "@/lib/search-history";

export function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const query = searchParams.get("query") ?? searchParams.get("q") ?? "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (!q) return;
    addSearchHistoryEntry(q);
    const params = new URLSearchParams(searchParams.toString());
    params.set("query", q);
    params.delete("q");
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  };

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = "";
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    params.delete("q");
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full items-center">
      <MagnifyingGlass className="absolute left-4 size-4 text-neutral-400 pointer-events-none" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        name="query"
        defaultValue={query}
        placeholder="Tìm sản phẩm…"
        autoComplete="off"
        className="w-full border border-neutral-200 bg-white py-3 pl-11 pr-10 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          aria-label="Xóa tìm kiếm"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </form>
  );
}
