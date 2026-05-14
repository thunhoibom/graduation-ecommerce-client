"use client";

import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react";

export function SearchBreadcrumb() {
  return (
    <nav className="mb-5" aria-label="Đường dẫn">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
        <li>
          <Link href="/" className="transition-colors hover:text-neutral-900 dark:hover:text-white">
            Trang chủ
          </Link>
        </li>
        <CaretRight className="size-3 shrink-0 text-neutral-300 dark:text-neutral-600" aria-hidden />
        <li className="text-neutral-900 dark:text-white">Tìm kiếm</li>
      </ol>
    </nav>
  );
}
