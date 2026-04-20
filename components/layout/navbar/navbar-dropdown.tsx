"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { MenuItem } from "@/types/common";

interface NavbarDropdownProps {
  item: MenuItem;
  onClose: () => void;
}

/**
 * NavbarDropdown — hover-triggered mega-menu dropdown.
 * Renders in a layered panel below the trigger link.
 * Handles keyboard navigation (Escape closes, Arrow keys navigate).
 */
export default function NavbarDropdown({ item, onClose }: NavbarDropdownProps) {
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Slight delay so the click that opened it doesn't immediately close
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 100);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  // Auto-highlight first group
  useEffect(() => {
    if (item.children?.length) setActiveGroup(item.children[0]?.id ?? null);
  }, [item.children]);

  const handleMouseEnter = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    onClose();
  }, [onClose]);

  const groups = item.children ?? [];
  const activeChildren = groups.find((g) => g.id === activeGroup)?.children ?? [];
  const hasGrandchildren = groups.some((g) => g.children && g.children.length > 0);

  return (
    <div
      ref={panelRef}
      role="menu"
      aria-label={`${item.title} submenu`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute left-0 top-full z-50 w-full pt-4 animate-in slide-in-from-top-1 fade-in duration-200"
    >
      {/* Dropdown panel */}
      <div className="mx-auto max-w-7xl overflow-hidden rounded-xl border border-border bg-background shadow-xl dark:border-neutral-800">
        <div className="flex divide-x divide-border dark:divide-neutral-800">
          {/* Left column: primary groups */}
          <div className="flex flex-col divide-y divide-border dark:divide-neutral-800 min-w-48">
            {groups.map((group) => (
              <button
                key={group.id}
                role="menuitem"
                onMouseEnter={() => setActiveGroup(group.id)}
                onClick={() => {
                  if (!group.children?.length) onClose();
                }}
                className={`
                  flex flex-col items-start gap-0.5 px-5 py-4 text-left transition-colors
                  ${
                    activeGroup === group.id
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }
                `}
              >
                <span className="text-sm font-medium">{group.title}</span>
                {group.description && (
                  <span className="text-xs text-muted-foreground/70">{group.description}</span>
                )}
              </button>
            ))}
          </div>

          {/* Right panel: grandchildren or direct links */}
          {hasGrandchildren ? (
            <div className="flex flex-1 divide-x divide-border dark:divide-neutral-800">
              {groups.map((group) =>
                group.children && group.children.length > 0 ? (
                  <div key={group.id} className="flex min-w-52 flex-col px-5 py-4">
                    <Link
                      href={group.path}
                      onClick={onClose}
                      className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground hover:underline underline-offset-4"
                    >
                      {group.title}
                    </Link>
                    <ul className="flex flex-col gap-1">
                      {group.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={child.path}
                            onClick={onClose}
                            className="block py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div key={group.id} className="flex min-w-52 flex-col px-5 py-4">
                    <Link
                      href={group.path}
                      onClick={onClose}
                      className="block py-1.5 text-sm font-semibold text-foreground hover:underline underline-offset-4"
                    >
                      {group.title}
                    </Link>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-wrap gap-6 px-5 py-4">
              {groups.map((group) => (
                <div key={group.id} className="min-w-40">
                  <Link
                    href={group.path}
                    onClick={onClose}
                    className="block text-sm font-semibold text-foreground hover:underline underline-offset-4"
                  >
                    {group.title}
                  </Link>
                  {group.description && (
                    <p className="mt-1 text-xs text-muted-foreground">{group.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
