"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { ProductReviewPojo, ProductReviewReplyPojo } from "@/types/product";
import { ChatCircleDots, CheckCircle } from "@phosphor-icons/react";

const INITIAL_VISIBLE = 6;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} sao`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
            fill={n <= Math.round(rating) ? "#FACC15" : "#E5E5E5"}
            className={n <= Math.round(rating) ? "text-yellow-400" : "text-neutral-200 dark:text-neutral-800"}
          />
        </svg>
      ))}
    </div>
  );
}

function ReviewReply({ reply }: { reply: ProductReviewReplyPojo }) {
  return (
    <div
      className={`mt-4 ml-8 rounded-lg border p-4 ${
        reply.isStaff
          ? "border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50"
          : "border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`text-xs font-bold uppercase tracking-wider ${
            reply.isStaff ? "text-teal-600 dark:text-teal-400" : "text-neutral-500"
          }`}
        >
          {reply.authorName} {reply.isStaff && "(Quản trị viên)"}
        </span>
        {reply.createdAt && (
          <span className="text-[10px] italic text-neutral-400">
            {new Date(reply.createdAt).toLocaleDateString("vi-VN", { day: "numeric", month: "short" })}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{reply.body}</p>
    </div>
  );
}

interface ProductReviewListClientProps {
  reviews: ProductReviewPojo[];
  totalReviewCount: number;
}

export function ProductReviewListClient({ reviews, totalReviewCount }: ProductReviewListClientProps) {
  const [visibleCount, setVisibleCount] = useState(Math.min(INITIAL_VISIBLE, reviews.length));

  const visible = useMemo(() => reviews.slice(0, visibleCount), [reviews, visibleCount]);

  const canShowMore = visibleCount < reviews.length;

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {visible.map((review, index) => (
        <div key={review.id ?? `review-${index}`} className="group relative pb-12 last:pb-0">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex min-w-[200px] items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                {(review.reviewerName ?? "K").charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="mb-0.5 flex items-center gap-1.5">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">
                    {review.reviewerName ?? "Khách hàng"}
                  </span>
                  {review.verifiedPurchase && (
                    <span title="Đã mua hàng">
                      <CheckCircle size={14} weight="fill" className="text-teal-600" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  {review.createdAt &&
                    new Date(review.createdAt).toLocaleDateString("vi-VN", { month: "short", year: "numeric" })}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} />
                {review.title && (
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{review.title}</h4>
                )}
              </div>

              <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {review.body}
              </p>

              {review.imageUrls && review.imageUrls.length > 0 && (
                <div className="flex gap-2 pt-2">
                  {review.imageUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative h-20 w-20 overflow-hidden rounded-lg border border-neutral-100 dark:border-neutral-800"
                    >
                      <Image src={url} alt="Review attachment" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {review.replies && review.replies.length > 0 && (
                <div className="space-y-4 pt-2">
                  {review.replies.map((reply) => (
                    <ReviewReply key={reply.id ?? `reply-${reply.authorName}`} reply={reply} />
                  ))}
                </div>
              )}

              <button
                type="button"
                disabled
                className="mt-4 flex cursor-not-allowed items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-300 dark:text-neutral-600"
                title="Tính năng đang phát triển"
              >
                <ChatCircleDots size={14} />
                Phản hồi
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-100 dark:bg-neutral-800 group-last:hidden" />
        </div>
      ))}

      {canShowMore && (
        <button
          type="button"
          onClick={() => setVisibleCount((c) => Math.min(c + INITIAL_VISIBLE, reviews.length))}
          className="mt-4 w-full rounded-2xl border border-neutral-100 py-4 text-sm font-bold transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
        >
          Xem thêm {Math.min(INITIAL_VISIBLE, reviews.length - visibleCount)} đánh giá
        </button>
      )}

      {!canShowMore && totalReviewCount > reviews.length && (
        <p className="text-center text-xs text-neutral-500">
          Đang hiển thị {reviews.length} / {totalReviewCount} đánh giá gần nhất.
        </p>
      )}
    </div>
  );
}
