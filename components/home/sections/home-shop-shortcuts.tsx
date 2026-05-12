import Link from "next/link";

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
    <section className="py-10 md:py-12" aria-labelledby="home-shop-shortcuts-heading">
      <div className="section-shell">
        <div className="mb-6 max-w-2xl">
          <p className="section-subtitle">Khám phá</p>
          <h2 id="home-shop-shortcuts-heading" className="section-title mt-1">
            Gợi ý lối mua sắm
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Chọn nhanh hướng bạn quan tâm — vẫn có thể tinh chỉnh bộ lọc trong từng trang.
          </p>
        </div>
        <ul className="flex flex-wrap gap-2 md:gap-3">
          {shortcuts.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group flex min-h-[3.25rem] flex-col justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2.5 transition-colors hover:border-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-500 dark:hover:bg-neutral-900/80"
              >
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">{s.label}</span>
                <span className="text-xs text-neutral-500 transition-colors group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-300">
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
