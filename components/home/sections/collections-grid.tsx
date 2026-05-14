import Link from "next/link";
import { getCollections } from "@/services/rest-api/collections/collections";
import { CollectionsShowcaseClient } from "@/components/home/sections/collections-showcase-client";

// ISR — requested hourly refresh; effective segment revalidate follows the minimum in the route (see app/page.tsx revalidate = 300).
export const revalidate = 3600;

export async function CollectionsGrid() {
  let collections: Awaited<ReturnType<typeof getCollections>> = [];
  try {
    collections = await getCollections();
  } catch {
    return null;
  }

  if (!collections?.length) return null;

  return (
    <section className="bg-neutral-100/60 py-12 md:py-16 dark:bg-neutral-900/35">
      <div className="section-shell">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div className="max-w-xl">
            <p className="section-subtitle">Danh mục</p>
            <h2 className="section-title mt-1">Bộ sưu tập</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Chọn dòng sản phẩm phù hợp — mỗi bộ sưu tập được tuyển theo form dáng và ngữ cảnh mặc khác nhau.
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-400 dark:hover:bg-neutral-900"
          >
            Tất cả bộ sưu tập
            <svg className="size-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <CollectionsShowcaseClient collections={collections} />
      </div>
    </section>
  );
}
