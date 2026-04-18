import { getProductReviewsPublic, getReviewStats } from "@/services/rest-api/products/products";
import type { ProductReviewPojo, ReviewStats } from "@/types/product";

interface ProductReviewsProps {
  barcode: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-px" aria-label={`${rating} sao`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M7 1l1.5 3.5L12 5l-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5L7 1z"
            fill={n <= Math.round(rating) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1"
            className="text-neutral-400"
          />
        </svg>
      ))}
    </div>
  );
}

export async function ProductReviews({ barcode }: ProductReviewsProps) {
  let reviews: ProductReviewPojo[] = [];
  let stats: ReviewStats | null = null;

  try {
    const [reviewData, statsData] = await Promise.all([
      getProductReviewsPublic(barcode, { pageSize: 6 }),
      getReviewStats(barcode),
    ]);
    reviews = reviewData.items ?? [];
    stats = statsData;
  } catch {
    return null;
  }

  if (!reviews.length && !stats) return null;

  return (
    <section className="mt-16 border-t border-neutral-200 pt-12 dark:border-neutral-800">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Đánh giá sản phẩm
        </h2>

        {/* Aggregate rating */}
        {stats && (
          <div className="flex items-center gap-3">
            <span className="text-3xl font-semibold text-neutral-900 dark:text-white">
              {(stats.averageRating ?? 0).toFixed(1)}
            </span>
            <div className="space-y-1">
              <StarRating rating={stats.averageRating ?? 0} />
              <p className="text-xs text-neutral-500">
                {stats.totalReviews ?? 0} đánh giá
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Rating distribution */}
      {stats?.ratingDistribution && (
        <div className="mb-10 grid grid-cols-5 gap-3 max-w-xs">
          {([5, 4, 3, 2, 1] as const).map((star) => {
            const count = stats.ratingDistribution?.[star - 1] ?? 0;
            const total = stats.totalReviews ?? 1;
            const pct = Math.round((count / total) * 100);
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-right text-neutral-500">{star}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <div
                    className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-right text-neutral-400">{pct}%</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Review list */}
      <div className="space-y-8">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-neutral-100 pb-8 last:border-0 last:pb-0 dark:border-neutral-800"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                {/* Avatar placeholder */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  {(review.reviewerName ?? "K").charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {review.reviewerName ?? "Khách hàng"}
                </span>
                {review.verifiedPurchase && (
                  <span className="rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-500 dark:border-neutral-700">
                    Đã mua hàng
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StarRating rating={review.rating} />
                {review.createdAt && (
                  <span className="text-xs text-neutral-400">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>

            {review.title && (
              <p className="mb-1 text-sm font-medium text-neutral-900 dark:text-white">
                {review.title}
              </p>
            )}
            {review.body && (
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {review.body}
              </p>
            )}
          </div>
        ))}
      </div>

      {stats && (stats.totalReviews ?? 0) > 6 && (
        <p className="mt-8 text-center text-sm text-neutral-500">
          Hiển thị 6 / {stats.totalReviews} đánh giá
        </p>
      )}
    </section>
  );
}
