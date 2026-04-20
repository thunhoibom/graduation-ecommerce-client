"use client";

import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react";
import type { ProductCategoryPojo } from "@/types/collection";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  /** The current category node — its `parent` field drives the trail */
  collection: {
    name: string;
    code: string;
    parent?: ProductCategoryPojo;
  };
}

/**
 * Builds the breadcrumb trail from a collection node's parent chain.
 * Shows: Trang chủ → Bộ sưu tập → [parent] → [current]
 */
function buildTrail(collection: BreadcrumbProps["collection"]): BreadcrumbItem[] {
  const trail: BreadcrumbItem[] = [];

  trail.push({ label: "Trang chủ", href: "/" });
  trail.push({ label: "Bộ sưu tập", href: "/collections" });

  // Walk up the parent chain to build full trail
  let current: ProductCategoryPojo | undefined = collection.parent;
  const parents: ProductCategoryPojo[] = [];

  while (current) {
    parents.unshift(current); // prepend so root comes first
    current = current.parent;
  }

  for (const parent of parents) {
    trail.push({
      label: parent.name,
      href: `/collections/${parent.code}`,
    });
  }

  // Current page — not a link
  trail.push({ label: collection.name });

  return trail;
}

export function Breadcrumb({ collection }: BreadcrumbProps) {
  const trail = buildTrail(collection);

  return (
    <nav aria-label="Đường dẫn">
      <ol className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
        {trail.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <CaretRight className="size-3 shrink-0 text-neutral-300 dark:text-neutral-600" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-neutral-900 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-900 dark:text-white">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}