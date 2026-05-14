import Link from "next/link";
import { HomeSectionHeader } from "@/components/home/sections/home-section-header";

const shortcuts = [
  {
    href: "/collections/all",
    label: "Tất cả sản phẩm",
    hint: "Xem toàn bộ catalog",
  },
  {
    href: "/collections",
    label: "Bộ sưu tập",
    hint: "Theo dòng sản phẩm",
  },
  {
    href: "/search?query=áo",
    label: "Áo & layer",
    hint: "Tìm nhanh áo khoác, sơ mi",
  },
  {
    href: "/search?query=quần",
    label: "Quần & bottom",
    hint: "Quần dài, short",
  },
  {
    href: "/blog",
    label: "Blog & phong cách",
    hint: "Cảm hứng mặc đẹp",
  },
] as const;

export function HomeShopShortcuts() {
  return (
    <section className="home-surface home-section" aria-labelledby="home-shop-shortcuts-heading">
      <div className="section-shell">
        <HomeSectionHeader
          eyebrow="Khám phá"
          title="Gợi ý lối mua sắm"
          description="Chọn nhanh hướng bạn quan tâm — vẫn có thể tinh chỉnh bộ lọc trong từng trang."
        />

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {shortcuts.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group flex min-h-[5.5rem] flex-col justify-between rounded-none border border-neutral-200/80 bg-neutral-50/80 px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-neutral-900 hover:bg-white hover:shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-500 dark:hover:bg-neutral-950"
              >
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">{s.label}</span>
                <span className="mt-3 text-xs leading-relaxed text-neutral-500 transition-colors group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-300">
                  {s.hint}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
