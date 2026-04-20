"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Search() {
  const searchParams = useSearchParams();

  return (
    <Form
      action="/search"
      className="relative w-full group"
    >
      <input
        key={searchParams?.get("q")}
        type="text"
        name="query"
        placeholder="Tìm sản phẩm…"
        autoComplete="off"
        defaultValue={searchParams?.get("query") || ""}
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
  );
}

export function SearchSkeleton() {
  return (
    <div className="relative w-full lg:w-80 xl:w-full animate-pulse">
      <div className="h-[38px] rounded-none border border-neutral-200 bg-neutral-100 dark:bg-neutral-800" />
    </div>
  );
}
