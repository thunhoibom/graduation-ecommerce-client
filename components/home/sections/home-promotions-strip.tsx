import Link from "next/link";
import { Tag } from "@phosphor-icons/react/dist/ssr";
import { fetchPublicPromotions } from "@/services/rest-api/promotions/promotions";

export async function HomePromotionsStrip() {
  const promos = await fetchPublicPromotions({ revalidateSeconds: 120 });
  const checkout = promos.filter((p) => p.scope === "CART" || p.scope === "SHIPPING");
  if (checkout.length === 0) return null;

  const display = checkout.slice(0, 4);

  return (
    <section className="border-y border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              <Tag className="size-3.5" weight="fill" aria-hidden />
              Ưu đãi đang diễn ra
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Áp dụng tự động khi giỏ hàng đủ điều kiện — xem chi tiết dưới đây.
            </p>
          </div>
          <Link
            href="/promotions"
            className="shrink-0 text-sm font-medium text-neutral-900 underline underline-offset-4 dark:text-white"
          >
            Xem tất cả chương trình
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {display.map((p) => (
            <li
              key={p.id ?? p.name}
              className="border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">{p.name}</p>
              {p.effectsSummary && (
                <p className="mt-1 text-xs font-medium text-green-700 dark:text-green-400">
                  {p.effectsSummary}
                </p>
              )}
              {p.conditionsSummary && (
                <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {p.conditionsSummary}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
