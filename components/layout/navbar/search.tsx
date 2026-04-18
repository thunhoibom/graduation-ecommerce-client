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
      className="relative w-full lg:w-80 xl:w-full"
    >
      <input
        key={searchParams?.get("q")}
        type="text"
        name="query"
        placeholder="Tìm sản phẩm…"
        autoComplete="off"
        defaultValue={searchParams?.get("query") || ""}
        className="w-full rounded-none border border-neutral-200 bg-white py-2.5 pl-4 pr-10 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white"
      />
      <button
        type="submit"
        aria-label="Tìm kiếm"
        className="absolute right-0 top-0 mr-3 flex h-full items-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
      >
        <MagnifyingGlassIcon className="h-4" />
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
