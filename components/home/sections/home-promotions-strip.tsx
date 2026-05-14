import Link from "next/link";
import { Tag } from "@phosphor-icons/react/dist/ssr";
import { fetchPublicPromotions } from "@/services/rest-api/promotions/promotions";
import { HomeSectionHeader } from "@/components/home/sections/home-section-header";

export async function HomePromotionsStrip() {
  const promos = await fetchPublicPromotions({ revalidateSeconds: 120 });
  const checkout = promos.filter((p) => p.scope === "CART" || p.scope === "SHIPPING");
  if (checkout.length === 0) return null;

  const display = checkout.slice(0, 4);

  return (
    <section className="home-surface-soft">
      <div className="section-shell py-10 md:py-12">
        <HomeSectionHeader
          eyebrow="Ưu đãi"
          title="Chương trình đang diễn ra"
          description="Áp dụng tự động khi giỏ hàng đủ điều kiện — xem chi tiết dưới đây."
          action={
            <Link href="/promotions" className="home-text-link">
              Xem tất cả chương trình
            </Link>
          }
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {display.map((p) => (
            <li
              key={p.id ?? p.name}
              className="rounded-none border border-neutral-200/80 bg-white/90 p-5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.35)] dark:border-neutral-800 dark:bg-neutral-950/80"
            >
              <div className="mb-3 inline-flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                <Tag className="size-3.5" weight="fill" aria-hidden />
                Ưu đãi
              </div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">{p.name}</p>
              {p.effectsSummary && (
                <p className="mt-2 text-xs font-medium text-green-700 dark:text-green-400">
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
