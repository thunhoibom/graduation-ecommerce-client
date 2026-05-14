import Link from "next/link";
import Image from "next/image";
import type { Collection } from "@/types/collection";
import { TrustStrip } from "@/components/storefront/trust-strip";
import { SearchHistoryChips } from "./search-history-chips";

const TRENDING = [
  "áo sơ mi",
  "quần jean",
  "blazer",
  "giày sneaker",
  "túi tote",
  "váy liền",
  "áo khoác",
  "phụ kiện",
];

interface SearchLandingProps {
  roots: Collection[];
}

export function SearchLanding({ roots }: SearchLandingProps) {
  const picks = roots.slice(0, 6);

  return (
    <div className="space-y-12 pb-12">
      <section>
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
          Gợi ý tìm kiếm
        </h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Chọn nhanh từ khóa phổ biến hoặc khám phá danh mục bên dưới.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {TRENDING.map((t) => (
            <Link
              key={t}
              href={`/search?query=${encodeURIComponent(t)}`}
              className="rounded-none border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
            >
              {t}
            </Link>
          ))}
        </div>
      </section>

      <SearchHistoryChips />

      {picks.length > 0 ? (
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                Danh mục nổi bật
              </h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Mua theo bộ sưu tập — mỗi danh mục được tuyển riêng.
              </p>
            </div>
            <Link
              href="/collections"
              className="text-sm font-medium text-neutral-600 underline underline-offset-2 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Tất cả bộ sưu tập
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {picks.map((c) => {
              const img = c.imageUrl ?? c.image?.url;
              const count =
                c.productCount != null ? `${c.productCount} sản phẩm` : null;
              return (
                <Link
                  key={c.code}
                  href={`/collections/${c.code}`}
                  className="group border border-neutral-200 bg-white transition-colors hover:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-500"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                    {img ? (
                      <Image
                        src={img}
                        alt=""
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-neutral-300 dark:text-neutral-700">
                        {c.name.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-white">
                      {c.name}
                    </p>
                    {count ? (
                      <p className="mt-0.5 text-[11px] text-neutral-500">{count}</p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="rounded-none border border-neutral-200 bg-neutral-50/90 p-6 dark:border-neutral-800 dark:bg-neutral-900/40 md:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
          Khuyến mãi & ưu đãi
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Theo dõi chương trình giảm giá theo mùa và combo được shop cập nhật thường xuyên.
        </p>
        <Link
          href="/promotions"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 underline underline-offset-2 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
        >
          Xem khuyến mãi đang diễn ra
          <span aria-hidden>→</span>
        </Link>
      </section>

      <TrustStrip />
    </div>
  );
}
