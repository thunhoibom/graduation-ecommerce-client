"use client";

import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react";

interface BreadcrumbProps {
  productName: string;
  category?: string;
  categorySlug?: string;
}

export function Breadcrumb({ productName, category, categorySlug }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-neutral-500 overflow-x-auto scrollbar-hide">
      <Link href="/" className="shrink-0 hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">
        Trang chủ
      </Link>
      <CaretRight className="size-3 shrink-0 text-neutral-300 dark:text-neutral-700" />
      <Link href="/collections/all" className="shrink-0 hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">
        Sản phẩm
      </Link>
      {category && categorySlug && (
        <>
          <CaretRight className="size-3 shrink-0 text-neutral-300 dark:text-neutral-700" />
          <Link
            href={`/collections/${categorySlug}`}
            className="shrink-0 hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap"
          >
            {category}
          </Link>
        </>
      )}
      <CaretRight className="size-3 shrink-0 text-neutral-300 dark:text-neutral-700" />
      <span className="truncate text-neutral-900 dark:text-white whitespace-nowrap">
        {productName}
      </span>
    </nav>
  );
}
