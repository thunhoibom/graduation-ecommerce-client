import type { Metadata } from "next";
import { Suspense } from "react";
import {
  parseIntSearchParam,
  parseOptionalTrimmed,
  searchProducts,
  type ProductFilters,
} from "@/services/rest-api/products/products";
import { getCategoryTree } from "@/services/rest-api/collections/collections";
import type { ProductListItem, ProductSearchItem } from "@/types/product";
import type { Collection } from "@/types/collection";
import { SearchHeader } from "./_components/search-header";
import { SearchBehaviorTracker } from "./_components/search-behavior-tracker";
import { SearchForYouSection } from "./_components/search-for-you";
import { SearchBreadcrumb } from "./_components/search-breadcrumb";
import { SearchLanding } from "./_components/search-landing";
import { ProductGrid } from "@/app/collections/[slug]/_components/product-grid";
import { FilterSidebar } from "@/app/collections/[slug]/_components/filter-sidebar";
import { ActiveFilters } from "@/app/collections/[slug]/_components/active-filters";

interface Props {
  searchParams: Promise<{
    query?: string;
    /** Legacy storefront param; prefer `query` in new links */
    q?: string;
    page?: string;
    sortBy?: string;
    sortDir?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    color?: string;
    size?: string;
  }>;
}

function resolveSearchQuery(sp: {
  query?: string;
  q?: string;
}): string {
  return (sp.query ?? sp.q ?? "").trim();
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const query = resolveSearchQuery(sp);
  return {
    title: query ? `"${query}" — Tìm kiếm — Mono Studio` : "Tìm kiếm — Mono Studio",
    description: query
      ? `Kết quả cho "${query}" tại Mono Studio — lọc giá, màu, size và xem gợi ý liên quan.`
      : "Tìm kiếm và khám phá sản phẩm Mono Studio — gợi ý từ khóa, danh mục nổi bật, khuyến mãi và lịch sử trên thiết bị của bạn.",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = resolveSearchQuery(sp);
  const {
    page: pageStr,
    sortBy,
    sortDir,
    minPrice,
    maxPrice,
    inStock,
    color,
    size,
  } = sp;

  const page = pageStr ? parseInt(pageStr) : 1;

  let items: ProductListItem[] = [];
  let totalCount = 0;
  let gridPage = page;
  let totalPages = 1;

  const hasQuery = Boolean(query && query.trim().length > 0);

  let categoryRoots: Collection[] = [];
  if (!hasQuery) {
    try {
      categoryRoots = await getCategoryTree();
    } catch {
      categoryRoots = [];
    }
  }

  if (hasQuery) {
    const colorTrimmed = parseOptionalTrimmed(color);
    const sizeTrimmed = parseOptionalTrimmed(size);
    const filters: ProductFilters = {
      query: query.trim(),
      page,
      pageSize: 24,
      // Default: no sort params → Elasticsearch orders by relevance (_score).
      // Sending price/desc by default made exact title matches rank below pricier “polo” hits.
      ...(sortBy
        ? { sortBy, sortDir: (sortDir as "asc" | "desc") ?? "desc" }
        : {}),
      minPrice: parseIntSearchParam(minPrice),
      maxPrice: parseIntSearchParam(maxPrice),
      ...(inStock === "true" && { inStock: true }),
      ...(colorTrimmed ? { color: colorTrimmed } : {}),
      ...(sizeTrimmed ? { size: sizeTrimmed } : {}),
    };

    try {
      const result = await searchProducts(filters);

      items = (result.items ?? []).map((si: ProductSearchItem) => ({
        id: si.id ? parseInt(si.id, 10) : undefined,
        name: si.name,
        barcode: si.barcode,
        currentPrice: si.price,
        category: {
          name: si.categoryName,
          code: si.categoryCodes && si.categoryCodes.length > 0 ? si.categoryCodes[0] : undefined,
        },
        images: si.primaryImageUrl ? [{ url: si.primaryImageUrl }] : [],
        currentStock: 1,
      }));

      totalCount = result.totalCount ?? 0;
      const apiIdx = result.pageIndex;
      gridPage =
        typeof apiIdx === "number" && Number.isFinite(apiIdx) ? apiIdx + 1 : page;
      totalPages = Math.ceil((totalCount ?? 0) / 24);
    } catch (error) {
      console.error("ES Search error:", error);
    }
  }

  const excludeIdsForYou =
    items.length > 0
      ? items
          .map((p) => (p.id != null ? String(p.id) : null))
          .filter((x): x is string => x != null)
      : [];

  const sortByResolved = sortBy ?? "relevance";
  const sortDirResolved = sortBy
    ? ((sortDir as "asc" | "desc") ?? "desc")
    : "desc";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <SearchBreadcrumb />

      <Suspense fallback={null}>
        <SearchHeader
          totalCount={totalCount}
          sortBy={sortByResolved}
          sortDir={sortDirResolved}
          hasQuery={hasQuery}
        />
      </Suspense>

      {hasQuery ? (
        <>
          <Suspense fallback={null}>
            <SearchBehaviorTracker />
          </Suspense>

          <div className="mt-4">
            <Suspense fallback={null}>
              <ActiveFilters />
            </Suspense>
          </div>

          <div className="mt-6 flex gap-8">
            <Suspense fallback={null}>
              <FilterSidebar />
            </Suspense>

            <div className="min-w-0 flex-1 space-y-10">
              <ProductGrid
                products={items}
                page={gridPage}
                totalPages={totalPages}
                sortBy={sortByResolved}
                sortDir={sortDirResolved}
                collectionSlug=""
                emptyTitle="Không tìm thấy sản phẩm nào"
                emptySubtitle="Thử từ khóa khác, xóa bộ lọc hoặc xem toàn bộ cửa hàng."
              />
              {items.length > 0 && query && (
                <SearchForYouSection query={query.trim()} excludeIds={excludeIdsForYou} />
              )}
            </div>
          </div>
        </>
      ) : (
        <SearchLanding roots={categoryRoots} />
      )}
    </div>
  );
}
