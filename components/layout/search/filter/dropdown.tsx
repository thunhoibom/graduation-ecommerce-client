"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import type { ListItem } from ".";
import { FilterItem } from "./item";
import { cn } from "@/lib/utils";

export default function FilterItemDropdown({ list }: { list: ListItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState("");
  const [openSelect, setOpenSelect] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if (
        ("path" in listItem && pathname === listItem.path) ||
        ("slug" in listItem && searchParams.get("sort") === listItem.slug)
      ) {
        setActive(listItem.title);
      }
    });
  }, [pathname, list, searchParams]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        id={`${listboxId}-trigger`}
        aria-haspopup="listbox"
        aria-expanded={openSelect}
        aria-controls={`${listboxId}-listbox`}
        onClick={() => setOpenSelect((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-left text-sm font-medium text-neutral-900 shadow-sm transition-all",
          "hover:border-neutral-300 hover:bg-neutral-50/80",
          "focus-visible:border-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/15",
          "dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-900/80",
          "dark:focus-visible:border-neutral-300 dark:focus-visible:ring-white/20",
          openSelect && "border-neutral-900 ring-2 ring-neutral-900/10 dark:border-neutral-400 dark:ring-white/15",
        )}
      >
        <span className="truncate text-neutral-700 dark:text-neutral-200">{active || "Chọn"}</span>
        <ChevronDownIcon
          className={cn("h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200", openSelect && "rotate-180")}
          aria-hidden
        />
      </button>
      {openSelect ? (
        <div
          id={`${listboxId}-listbox`}
          role="listbox"
          aria-labelledby={`${listboxId}-trigger`}
          className={cn(
            "absolute z-50 mt-1.5 max-h-[min(70vh,320px)] w-full overflow-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg",
            "dark:border-neutral-700 dark:bg-neutral-950",
            "animate-in fade-in slide-in-from-top-1 duration-150",
          )}
        >
          <ul className="py-1" onClick={() => setOpenSelect(false)}>
            {list.map((item: ListItem, i) => (
              <FilterItem key={i} item={item} variant="menu" />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
