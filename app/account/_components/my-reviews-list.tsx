"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "@phosphor-icons/react";
import { getMyReviews } from "@/services/rest-api/products/products";
import type { ProductReviewPojo } from "@/types/product";

function formatReviewDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function MyReviewsList() {
  const [reviews, setReviews] = useState<ProductReviewPojo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getMyReviews();
        if (!cancelled) setReviews(list);
      } catch {
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-600 dark:border-t-neutral-100" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Star className="size-12 text-neutral-200 dark:text-neutral-800" />
        <div>
          <p className="font-medium text-neutral-600 dark:text-neutral-400">
            Chưa có đánh giá nào
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Đánh giá bạn gửi từ trang sản phẩm sẽ hiển thị tại đây sau khi được duyệt (nếu áp dụng).
          </p>
        </div>
        <Link
          href="/collections/all"
          className="mt-2 text-sm underline underline-offset-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Star className="size-5 text-neutral-500" />
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
          Đánh giá của tôi
        </h2>
      </div>

      <ul className="space-y-3">
        {reviews.map((r) => {
          const barcode = r.productBarcode ?? "";
          const title =
            r.productName?.trim() ||
            (barcode ? `Sản phẩm ${barcode}` : "Sản phẩm");
          const ratingN = Math.min(5, Math.max(0, Number(r.rating) || 0));
          const stars = ratingN > 0 ? "★".repeat(ratingN) : "—";

          return (
            <li
              key={r.id ?? `${barcode}-${r.createdAt}`}
              className="rounded-none border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-1">
                  {barcode ? (
                    <Link
                      href={`/product/${encodeURIComponent(barcode)}`}
                      className="text-sm font-medium text-neutral-900 hover:underline dark:text-white"
                    >
                      {title}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {title}
                    </span>
                  )}
                  {barcode ? (
                    <p className="font-mono text-xs text-neutral-500">{barcode}</p>
                  ) : null}
                  <p className="text-xs text-amber-700 dark:text-amber-400">{stars}</p>
                  {r.title && (
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      {r.title}
                    </p>
                  )}
                  {r.body && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{r.body}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span
                      className={
                        r.approved
                          ? "rounded border border-green-200 bg-green-50 px-1.5 py-0.5 text-[10px] text-green-800 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-400"
                          : "rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
                      }
                    >
                      {r.approved ? "Đã hiển thị công khai" : "Đang chờ kiểm duyệt"}
                    </span>
                    {r.verifiedPurchase && (
                      <span className="rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
                        Đã mua hàng
                      </span>
                    )}
                  </div>
                </div>
                {r.createdAt && (
                  <time
                    dateTime={r.createdAt}
                    className="text-xs text-neutral-500 whitespace-nowrap"
                  >
                    {formatReviewDate(r.createdAt)}
                  </time>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
