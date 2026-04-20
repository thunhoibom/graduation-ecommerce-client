import { getProductReviewsPublic, getReviewStats } from "@/services/rest-api/products/products";
export const revalidate = 0;
import type { ProductReviewPojo, ReviewStats, ProductReviewReplyPojo } from "@/types/product";
import { ChatCircleDots, Camera, CheckCircle, PencilSimple } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { WriteReviewButton } from "./write-review-button";

interface ProductReviewsProps {
  barcode: string;
  productName: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} sao`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg 
          key={n} 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
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
    <div className={`mt-4 ml-8 p-4 rounded-lg border ${
      reply.isStaff 
        ? "bg-neutral-50 border-neutral-200 dark:bg-neutral-800/50 dark:border-neutral-700" 
        : "bg-white border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800"
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-bold uppercase tracking-wider ${reply.isStaff ? "text-teal-600 dark:text-teal-400" : "text-neutral-500"}`}>
          {reply.authorName} {reply.isStaff && "(Quản trị viên)"}
        </span>
        {reply.createdAt && (
          <span className="text-[10px] text-neutral-400 italic">
            {new Date(reply.createdAt).toLocaleDateString("vi-VN", { day: "numeric", month: "short" })}
          </span>
        )}
      </div>
      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
        {reply.body}
      </p>
    </div>
  );
}

export async function ProductReviews({ barcode, productName }: ProductReviewsProps) {
  let reviews: ProductReviewPojo[] = [];
  let stats: ReviewStats | null = null;

  try {
    const [reviewData, statsData] = await Promise.all([
      getProductReviewsPublic(barcode, { pageSize: 20 }),
      getReviewStats(barcode),
    ]);
    
    console.log(`[DEBUG] Reviews for ${barcode}:`, JSON.stringify(reviewData, null, 2));
    console.log(`[DEBUG] Stats for ${barcode}:`, JSON.stringify(statsData, null, 2));

    reviews = Array.isArray(reviewData) ? reviewData : (reviewData.items ?? []);
    stats = statsData;
  } catch (error) {
    console.error(`[DEBUG] Error loading reviews for ${barcode}:`, error);
    return null;
  }

  const allReviewImages = reviews.flatMap(r => r.imageUrls || []);

  return (
    <section className="mt-16 border-t border-neutral-200 pt-12 dark:border-neutral-800">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Đánh giá từ cộng đồng
          </h2>
          <p className="text-sm text-neutral-500">Mọi phản hồi đều giúp chúng tôi hoàn thiện hơn mỗi ngày.</p>
        </div>

        <div className="flex items-center gap-8 bg-neutral-50 dark:bg-white/5 p-4 rounded-2xl">
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

      {/* User Photos Showcase (Real Social Proof) */}
      {allReviewImages.length > 0 && (
          <div className="mb-12 space-y-4">
            <div className="flex items-center gap-2">
              <Camera size={18} className="text-neutral-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Ảnh thực tế từ khách hàng</p>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
              {allReviewImages.map((url, i) => (
                <div key={i} className="group relative aspect-square w-32 shrink-0 overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200/50 transition-all hover:ring-neutral-400 lg:w-40">
                  <Image src={url} alt={`Review photo ${i+1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
              ))}
            </div>
          </div>
      )}

      {/* Review list */}
      <div className="space-y-12">
        {reviews.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-neutral-100 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
             <ChatCircleDots size={48} className="text-neutral-200" />
             <div className="space-y-1">
               <p className="text-neutral-600 font-bold">Chưa có đánh giá nào</p>
               <p className="text-xs text-neutral-400">Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm này.</p>
             </div>
             <WriteReviewButton barcode={barcode} productName={productName} />
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="group relative pb-12 last:pb-0"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    {(review.reviewerName ?? "K").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        {review.reviewerName ?? "Khách hàng"}
                      </span>
                      {review.verifiedPurchase && (
                        <span title="Đã mua hàng">
                          <CheckCircle size={14} weight="fill" className="text-teal-600" />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                      {review.createdAt && new Date(review.createdAt).toLocaleDateString("vi-VN", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    {review.title && <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{review.title}</h4>}
                  </div>
                  
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-2xl">
                    {review.body}
                  </p>

                  {/* Individual review images */}
                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div className="flex gap-2 pt-2">
                       {review.imageUrls.map((url, idx) => (
                         <div key={idx} className="relative h-20 w-20 overflow-hidden rounded-lg border border-neutral-100 dark:border-neutral-800">
                            <Image src={url} alt="Review attachment" fill className="object-cover" />
                         </div>
                       ))}
                    </div>
                  )}

                  {/* Replies thread */}
                  {review.replies && review.replies.length > 0 && (
                    <div className="space-y-4 pt-2">
                      {review.replies.map((reply) => (
                        <ReviewReply key={reply.id} reply={reply} />
                      ))}
                    </div>
                  )}

                  {/* Reply Action */}
                  <button className="flex items-center gap-1.5 mt-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                    <ChatCircleDots size={14} />
                    Phản hồi
                  </button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-100 dark:bg-neutral-800 group-last:hidden" />
            </div>
          ))
        )}
      </div>

      {stats && (stats.totalReviews ?? 0) > 20 && (
        <button className="mt-12 w-full py-4 border border-neutral-100 rounded-2xl text-sm font-bold hover:bg-neutral-50 transition-colors dark:border-neutral-800 dark:hover:bg-neutral-800">
          Xem thêm {(stats.totalReviews ?? 0) - 20} đánh giá khác
        </button>
      )}
    </section>
  );
}
