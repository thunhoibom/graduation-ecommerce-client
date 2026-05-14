"use client";

import Link from "next/link";
import { Gift } from "@phosphor-icons/react";
import type { PromotionNearMiss } from "@/types/cart";
import { cn, formatMoney } from "@/lib/utils";

interface Props {
  nearMisses: PromotionNearMiss[];
  cartSubtotal: number;
  className?: string;
}

export function PromotionNearMissPanel({ nearMisses, cartSubtotal, className }: Props) {
  if (!nearMisses.length) return null;

  return (
    <div
      className={cn(
        "rounded-none border border-amber-200 bg-amber-50/80 dark:border-amber-900/60 dark:bg-amber-950/25",
        className,
      )}
    >
      <div className="flex items-start gap-2 border-b border-amber-200/80 px-3 py-2 dark:border-amber-900/40">
        <Gift className="size-4 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
        <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-200">
          Gần đủ điều kiện ưu đãi
        </p>
      </div>
      <ul className="divide-y divide-amber-200/60 dark:divide-amber-900/40">
        {nearMisses.map((n, idx) => {
          const key = `${n.ruleId ?? idx}-${n.remainingAmount ?? 0}`;
          const threshold =
            n.remainingAmount != null ? cartSubtotal + n.remainingAmount : cartSubtotal;
          const pct =
            threshold > 0 ? Math.min(100, Math.round((100 * cartSubtotal) / threshold)) : 0;
          return (
            <li key={key} className="space-y-2 px-3 py-3">
              {n.title && (
                <p className="text-xs font-medium text-neutral-900 dark:text-white">{n.title}</p>
              )}
              <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                {n.messageVi ??
                  (n.remainingAmount != null
                    ? `Thêm ${formatMoney(n.remainingAmount)} để đạt ưu đãi.`
                    : null)}
              </p>
              {n.remainingAmount != null && threshold > 0 && (
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-amber-200/80 dark:bg-amber-900/50">
                    <div
                      className="h-full bg-amber-600 transition-[width] dark:bg-amber-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-500">
                    Giỏ hiện {formatMoney(cartSubtotal)} · còn thiếu{" "}
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {formatMoney(n.remainingAmount)}
                    </span>
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="border-t border-amber-200/80 px-3 py-2 dark:border-amber-900/40">
        <Link
          href="/promotions"
          className="text-[11px] font-medium text-amber-900 underline underline-offset-2 hover:text-amber-700 dark:text-amber-300 dark:hover:text-amber-200"
        >
          Xem tất cả chương trình
        </Link>
      </div>
    </div>
  );
}
