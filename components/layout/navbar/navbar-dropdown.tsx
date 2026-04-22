import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { MenuItem } from "@/types/common";
import { ArrowRightIcon } from "@phosphor-icons/react";

interface NavbarDropdownProps {
  item: MenuItem;
  onClose: () => void;
}

export default function NavbarDropdown({ item, onClose }: NavbarDropdownProps) {
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape & Outside Click
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
      className="absolute left-0 top-full z-50 w-full pt-4 animate-in slide-in-from-top-2 fade-in duration-300 ease-out"
    >
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-neutral-200 bg-white/95 backdrop-blur-md shadow-2xl dark:border-neutral-800 dark:bg-neutral-900/95">
        <div className="flex min-h-[420px]">
          {/* List of sub-categories */}
          <div className="w-64 border-r border-neutral-100 p-4 dark:border-neutral-800">
            <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Danh mục
            </div>
            <div className="space-y-1">
              {groups.map((group) => (
                <button
                  key={group.id}
                  role="menuitem"
                  onMouseEnter={() => setActiveGroup(group.id)}
                  className={`
                    group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all
                    ${
                      activeGroup === group.id
                        ? "bg-neutral-900 text-white shadow-md dark:bg-white dark:text-black"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                    }
                  `}
                >
                  <span className="text-sm font-semibold">{group.title}</span>
                  {activeGroup === group.id && (
                    <ArrowRightIcon weight="bold" size={12} className="animate-in slide-in-from-left-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Details & Featured Area */}
          <div className="flex flex-1 p-8">
            {/* Grandchildren links */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                {activeChildren.length > 0 ? (
                  activeChildren.map((child) => (
                    <div key={child.id} className="space-y-3">
                      <Link
                        href={child.path}
                        onClick={onClose}
                        className="text-sm font-bold uppercase tracking-wide text-neutral-900 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300 transition-colors"
                      >
                        {child.title}
                      </Link>
                      {child.children && child.children.length > 0 && (
                        <ul className="space-y-2">
                          {child.children.slice(0, 5).map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={sub.path}
                                onClick={onClose}
                                className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
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
                  <div className="col-span-2">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                        Khám phá {activeGroupData?.title}
                      </h3>
                      {activeGroupData?.description && (
                        <p className="mt-2 max-w-md text-sm text-neutral-500 dark:text-neutral-400">
                          {activeGroupData.description}
                        </p>
                      )}
                    </div>
                    <Link
                      href={activeGroupData?.path || "#"}
                      onClick={onClose}
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-neutral-800 hover:shadow-lg dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                      Xem tất cả
                      <ArrowRightIcon size={16} />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Feature Area (Image from DB) */}
            <div className="ml-12 w-80 shrink-0">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 shadow-inner">
                {activeGroupData?.imageUrl ? (
                  <Image
                    src={activeGroupData.imageUrl}
                    alt={activeGroupData.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="320px"
                    priority
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                    <div className="mb-4 rounded-full bg-neutral-200 p-4 dark:bg-neutral-700">
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="opacity-20 grayscale"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    </div>
                    <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest">
                      {activeGroupData?.title}
                    </p>
                  </div>
                )}
                {/* Overlay with info */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Bộ sưu tập</p>
                  <h4 className="mt-1 text-lg font-bold leading-tight">{activeGroupData?.title}</h4>
                  <Link
                    href={activeGroupData?.path || "#"}
                    onClick={onClose}
                    className="mt-3 inline-flex items-center text-xs font-bold uppercase tracking-widest underline underline-offset-4 decoration-2 decoration-white/30 hover:decoration-white transition-all"
                  >
                    Xem ngay
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
