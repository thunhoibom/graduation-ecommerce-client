import Link from "next/link";
import type { Metadata } from "next";
import { Tag } from "@phosphor-icons/react/dist/ssr";
import { fetchPublicPromotions } from "@/services/rest-api/promotions/promotions";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Chương trình khuyến mãi — Mono Studio",
  description:
    "Danh sách ưu đãi đang hiệu lực tại Mono Studio: giảm giá đơn hàng, freeship và khuyến mãi trên giá sản phẩm.",
};

export default async function PromotionsPage() {
  const promos = await fetchPublicPromotions({ revalidateSeconds: 120 });

  const checkout = promos.filter((p) => p.scope === "CART" || p.scope === "SHIPPING");
  const catalog = promos.filter((p) => p.scope === "PRODUCT" || p.scope === "CATEGORY");

  return (
    <>
      <div className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-none bg-neutral-900 px-3 py-1 text-xs font-medium text-white dark:bg-white dark:text-black">
            <Tag className="size-3.5" weight="fill" aria-hidden />
            Promotion
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-4xl">
            Chương trình khuyến mãi
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600 dark:text-neutral-400">
            Giỏ hàng đủ điều kiện sẽ được áp dụng tự động khi thanh toán.
            thanh toán.
          </p>
          <Link
            href="/cart"
            className="mt-6 inline-block text-sm font-medium text-neutral-900 underline underline-offset-4 dark:text-white"
          >
            Đi tới giỏ hàng
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Ưu đãi giỏ hàng &amp; vận chuyển
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Áp dụng khi đặt hàng, theo điều kiện từng chương trình.
          </p>
          {checkout.length === 0 ? (
            <p className="mt-6 text-sm text-neutral-500">Hiện không có chương trình loại này.</p>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {checkout.map((p) => (
                <li
                  key={p.id ?? p.name}
                  className="border border-neutral-200 p-5 dark:border-neutral-800"
                >
                  <p className="font-medium text-neutral-900 dark:text-white">{p.name}</p>
                  {p.effectsSummary && (
                    <p className="mt-2 text-sm text-green-700 dark:text-green-400">{p.effectsSummary}</p>
                  )}
                  {p.conditionsSummary && (
                    <p className="mt-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {p.conditionsSummary}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Giá &amp; khuyến mãi trên sản phẩm
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Đã phản ánh trên giá hiển thị tại trang sản phẩm và danh mục.
          </p>
          {catalog.length === 0 ? (
            <p className="mt-6 text-sm text-neutral-500">Không có rule PRODUCT/CATEGORY đang chạy.</p>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.map((p) => (
                <li
                  key={p.id ?? p.name}
                  className="border border-neutral-200 p-5 dark:border-neutral-800"
                >
                  <p className="font-medium text-neutral-900 dark:text-white">{p.name}</p>
                  {p.effectsSummary && (
                    <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{p.effectsSummary}</p>
                  )}
                  {p.conditionsSummary && (
                    <p className="mt-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {p.conditionsSummary}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
}
