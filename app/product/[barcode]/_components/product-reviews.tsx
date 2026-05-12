import { getProductReviewsPublic, getReviewStats } from "@/services/rest-api/products/products";
import type { ProductReviewPojo, ReviewStats } from "@/types/product";
import { ChatCircleDots, Camera } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { WriteReviewButton } from "./write-review-button";
import { ProductReviewListClient } from "./product-review-list-client";

export const revalidate = 0;

interface ProductReviewsProps {
  barcode: string;
  productName: string;
}

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

function normalizeReviewsPayload(
  raw: unknown
): ProductReviewPojo[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && "items" in raw) {
    const items = (raw as { items?: ProductReviewPojo[] }).items;
    return Array.isArray(items) ? items : [];
  }
  return [];
}

export async function ProductReviews({ barcode, productName }: ProductReviewsProps) {
  let reviews: ProductReviewPojo[] = [];
  let stats: ReviewStats | null = null;
  let loadError = false;

  try {
    const [reviewData, statsData] = await Promise.all([
      getProductReviewsPublic(barcode, { pageSize: 120 }),
      getReviewStats(barcode),
    ]);

    reviews = normalizeReviewsPayload(reviewData);
    stats = statsData;
  } catch {
    loadError = true;
  }

  if (loadError) {
    return (
      <section className="mt-16 border-t border-neutral-200 pt-12 dark:border-neutral-800">
        <p className="text-sm text-neutral-500">Không tải được đánh giá. Vui lòng thử lại sau.</p>
      </section>
    );
  }

  const allReviewImages = reviews.flatMap((r) => r.imageUrls || []);

  return (
    <section className="mt-16 border-t border-neutral-200 pt-12 dark:border-neutral-800">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Đánh giá từ cộng đồng
          </h2>
          <p className="text-sm text-neutral-500">Mọi phản hồi đều giúp chúng tôi hoàn thiện hơn mỗi ngày.</p>
        </div>

        <div className="flex items-center gap-8 rounded-2xl bg-neutral-50 p-4 dark:bg-white/5">
          {stats && (
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-neutral-900 dark:text-white">
                {(stats.averageRating ?? 0).toFixed(1)}
              </span>
              <div className="space-y-1">
                <StarRating rating={stats.averageRating ?? 0} />
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {stats.totalReviews ?? 0} đánh giá
                </p>
              </div>
            </div>
          )}
          <WriteReviewButton barcode={barcode} productName={productName} />
        </div>
      </div>

      {allReviewImages.length > 0 && (
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-2">
            <Camera size={18} className="text-neutral-500" />
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Ảnh thực tế từ khách hàng
            </p>
          </div>
          <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-4">
            {allReviewImages.map((url, i) => (
              <div
                key={i}
                className="group relative aspect-square w-32 shrink-0 overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200/50 transition-all hover:ring-neutral-400 lg:w-40"
              >
                <Image
                  src={url}
                  alt={`Review photo ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border-2 border-dashed border-neutral-100 py-12 text-center">
          <ChatCircleDots size={48} className="text-neutral-200" />
          <div className="space-y-1">
            <p className="font-bold text-neutral-600">Chưa có đánh giá nào</p>
            <p className="text-xs text-neutral-400">Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm này.</p>
          </div>
          <WriteReviewButton barcode={barcode} productName={productName} />
        </div>
      ) : (
        <ProductReviewListClient reviews={reviews} totalReviewCount={stats?.totalReviews ?? reviews.length} />
      )}
    </section>
  );
}
