"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { MenuItem } from "@/types/common";
import { ArrowRightIcon, CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface NavbarDropdownProps {
  item: MenuItem;
  onClose: () => void;
}

export default function NavbarDropdown({ item, onClose }: NavbarDropdownProps) {
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 100);
    return () => {
      document.removeEventListener("keydown", handleKey);
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  useEffect(() => {
    if (item.children?.length && activeGroup === null) {
      setActiveGroup(item.children[0]?.id ?? null);
    }
  }, [item.children, activeGroup]);

  const groups = item.children ?? [];
  const activeGroupData = groups.find((g) => g.id === activeGroup);
  const activeChildren = activeGroupData?.children ?? [];

  return (
    <div
      ref={panelRef}
      role="menu"
      className="absolute inset-x-0 top-full z-50 w-full pt-2 animate-in fade-in slide-in-from-top-1 duration-200 ease-out"
    >
      <div
        className={cn(
          "mx-auto max-w-7xl overflow-hidden rounded-xl border border-neutral-200/90 bg-white/95 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] backdrop-blur-md",
          "dark:border-neutral-800 dark:bg-neutral-950/95 dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)]",
        )}
      >
        <div className="flex min-h-[min(420px,70vh)] max-w-full">
          {/* Cột danh mục */}
          <div className="w-56 shrink-0 border-r border-neutral-100 bg-neutral-50/50 py-4 pl-2 pr-2 dark:border-neutral-800/80 dark:bg-neutral-900/30 sm:w-60">
            <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
              Danh mục
            </p>
            <div className="space-y-0.5">
              {groups.map((group) => {
                const isActive = activeGroup === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    role="menuitem"
                    onMouseEnter={() => setActiveGroup(group.id)}
                    onFocus={() => setActiveGroup(group.id)}
                    className={cn(
                      "group flex w-full items-center justify-between gap-2 rounded-lg border border-transparent py-2.5 pl-3 pr-2.5 text-left text-sm font-medium outline-none transition-colors",
                      "focus-visible:ring-2 focus-visible:ring-neutral-900/20 focus-visible:ring-offset-1 dark:focus-visible:ring-white/25",
                      isActive
                        ? "border-neutral-200/80 bg-white text-neutral-900 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                        : "text-neutral-600 hover:border-neutral-200/60 hover:bg-white/80 hover:text-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/40 dark:hover:text-white",
                    )}
                  >
                    <span className="truncate">{group.title}</span>
                    <CaretRightIcon
                      weight="bold"
                      className={cn(
                        "size-3.5 shrink-0 text-neutral-300 transition-opacity dark:text-neutral-600",
                        isActive && "text-neutral-900 opacity-100 dark:text-white",
                        !isActive && "opacity-0 group-hover:opacity-100",
                      )}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nội dung + ảnh */}
          <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
            <div className="min-w-0 flex-1 p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-6">
                {activeChildren.length > 0 ? (
                  activeChildren.map((child) => (
                    <div key={child.id} className="min-w-0">
                      <Link
                        href={child.path}
                        onClick={onClose}
                        className="inline-block border-b border-transparent text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-900 dark:text-white dark:hover:border-white"
                      >
                        {child.title}
                      </Link>
                      {child.children && child.children.length > 0 && (
                        <ul className="mt-3 space-y-1 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                          {child.children.slice(0, 8).map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={sub.path}
                                onClick={onClose}
                                className="block rounded-md py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/50 dark:hover:text-white"
                              >
                                {sub.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                      {activeGroupData?.title}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                      Khám phá {activeGroupData?.title}
                    </h3>
                    {activeGroupData?.description ? (
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {activeGroupData.description}
                      </p>
                    ) : null}
                    <Link
                      href={activeGroupData?.path || "#"}
                      onClick={onClose}
                      className="mt-6 inline-flex items-center gap-2 rounded-md border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                      Xem tất cả
                      <ArrowRightIcon size={16} weight="bold" aria-hidden />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden shrink-0 border-t border-neutral-100 p-6 sm:p-8 lg:block lg:w-[min(100%,280px)] lg:border-l lg:border-t-0 xl:w-80 dark:border-neutral-800">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800">
                {activeGroupData?.imageUrl ? (
                  <Image
                    src={activeGroupData.imageUrl}
                    alt={activeGroupData.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 0vw, 320px"
                    priority
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                    <div className="mb-3 rounded-full bg-neutral-200/80 p-3 dark:bg-neutral-800">
                      <Image
                        src="/logo.png"
                        alt={activeGroupData?.title ?? "Logo"}
                        width={36}
                        height={36}
                        className="opacity-30 grayscale"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
                      {activeGroupData?.title}
                    </p>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-5 pb-5 pt-16 text-white">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">Bộ sưu tập</p>
                  <h4 className="mt-1 text-base font-semibold leading-snug">{activeGroupData?.title}</h4>
                  <Link
                    href={activeGroupData?.path || "#"}
                    onClick={onClose}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-white/90 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
                  >
                    Xem ngay
                    <ArrowRightIcon size={12} weight="bold" className="opacity-80" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
