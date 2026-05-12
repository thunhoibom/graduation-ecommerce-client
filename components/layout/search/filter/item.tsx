"use client";

import clsx from "clsx";
import type { SortFilterItem } from "lib/constants";
import { createUrl } from "lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ListItem, PathFilterItem } from ".";

function PathFilterItem({
  item,
  variant = "default",
}: {
  item: PathFilterItem;
  variant?: "default" | "menu";
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicTag = active ? "p" : Link;

  newParams.delete("q");
  newParams.delete("query");

  const isMenu = variant === "menu";

  return (
    <li
      className={clsx(
        "flex text-black dark:text-white",
        isMenu ? "list-none" : "mt-2",
      )}
    >
      <DynamicTag
        href={createUrl(item.path, newParams)}
        className={clsx(
          isMenu
            ? clsx(
                "w-full rounded-md px-3 py-2 text-sm text-neutral-800 transition-colors dark:text-neutral-100",
                active
                  ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-white"
                  : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60",
              )
            : clsx(
                "w-full text-sm underline-offset-4 hover:underline dark:hover:text-neutral-100",
                active && "underline underline-offset-4",
              ),
        )}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

function SortFilterItem({
  item,
  variant = "default",
}: {
  item: SortFilterItem;
  variant?: "default" | "menu";
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("sort") === item.slug;
  const searchQuery = searchParams.get("query") ?? searchParams.get("q") ?? "";
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(searchQuery && { query: searchQuery }),
      ...(item.slug && item.slug.length && { sort: item.slug }),
    }),
  );
  const DynamicTag = active ? "p" : Link;
  const isMenu = variant === "menu";

  return (
    <li
      className={clsx(
        "flex text-sm text-black dark:text-white",
        isMenu ? "list-none" : "mt-2",
      )}
    >
      <DynamicTag
        prefetch={!active ? false : undefined}
        href={href}
        className={clsx(
          isMenu
            ? clsx(
                "w-full rounded-md px-3 py-2 text-neutral-800 transition-colors dark:text-neutral-100",
                active
                  ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-white"
                  : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60",
              )
            : clsx("w-full hover:underline hover:underline-offset-4", {
              "underline underline-offset-4": active,
            }),
        )}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

export function FilterItem({
  item,
  variant = "default",
}: {
  item: ListItem;
  variant?: "default" | "menu";
}) {
  return "path" in item ? (
    <PathFilterItem item={item} variant={variant} />
  ) : (
    <SortFilterItem item={item} variant={variant} />
  );
}
