import Link from "next/link";
import { Sparkle } from "@phosphor-icons/react/dist/ssr";
import { fetchPublicPromotions } from "@/services/rest-api/promotions/promotions";

interface Props {
  barcode: string;
}

/** Gợi ý chương trình có thể áp dụng (giỏ / SP liên quan) — dữ liệu từ API public */
export async function ProductPromotionTeaser({ barcode }: Props) {
  const list = await fetchPublicPromotions({
    productBarcode: barcode,
    revalidateSeconds: 120,
  });
  const checkout = list.filter((p) => p.scope === "CART" || p.scope === "SHIPPING");
  if (checkout.length === 0) return null;

  const titles = checkout
    .slice(0, 3)
    .map((p) => {
      const n = p.name?.trim();
      if (n) return n;
      return p.effectsSummary?.trim() ?? "";
    })
    .filter((s): s is string => s.length > 0);

  return (
    <div className="mb-6 flex flex-wrap items-start gap-3 rounded-none border border-green-200 bg-green-50/90 px-4 py-3 dark:border-green-900/60 dark:bg-green-950/30">
      <Sparkle className="mt-0.5 size-5 shrink-0 text-green-700 dark:text-green-400" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-800 dark:text-green-300">
          Ưu đãi có thể áp dụng
        </p>
        <p className="mt-1 text-sm text-green-900 dark:text-green-100">
          {titles.join(" · ")}
        </p>
        <p className="mt-1 text-xs text-green-800/80 dark:text-green-400/90">
          Điều kiện cụ thể tính trên giỏ hàng — thêm sản phẩm và xem gợi ý trong giỏ.
        </p>
        <Link
          href="/promotions"
          className="mt-2 inline-block text-xs font-medium text-green-900 underline underline-offset-2 dark:text-green-200"
        >
          Xem chi tiết chương trình
        </Link>
      </div>
    </div>
  );
}
