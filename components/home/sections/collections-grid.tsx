import Link from "next/link";
import { getCollections } from "@/services/rest-api/collections/collections";
import { CollectionsShowcaseClient } from "@/components/home/sections/collections-showcase-client";
import { HomeSectionHeader } from "@/components/home/sections/home-section-header";

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
    <section className="home-surface-muted home-section">
      <div className="section-shell">
        <HomeSectionHeader
          eyebrow="Danh mục"
          title="Bộ sưu tập"
          description="Chọn dòng sản phẩm phù hợp — mỗi bộ sưu tập được tuyển theo form dáng và ngữ cảnh mặc khác nhau."
          action={
            <Link href="/collections" className="home-link-pill">
              Tất cả bộ sưu tập
              <svg className="size-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          }
        />

        <CollectionsShowcaseClient collections={collections} />
      </div>
    </section>
  );
}
