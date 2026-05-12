import type { Metadata } from "next";
import { Suspense } from "react";
import {
  parseIntSearchParam,
  parseOptionalTrimmed,
  searchProducts,
  type ProductFilters,
} from "@/services/rest-api/products/products";
import type { ProductListItem, ProductSearchItem } from "@/types/product";
import { SearchHeader } from "./_components/search-header";
import { SearchBehaviorTracker } from "./_components/search-behavior-tracker";
import { SearchForYouSection } from "./_components/search-for-you";
import { ProductGrid } from "@/app/collections/[slug]/_components/product-grid";
import { FilterSidebar } from "@/app/collections/[slug]/_components/filter-sidebar";

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
      ? `Kết quả tìm kiếm cho "${query}" tại Mono Studio`
      : "Tìm kiếm sản phẩm tại Mono Studio.",
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

  // Only fetch products if there's a query
  let items: ProductListItem[] = [];
  let totalCount = 0;
  /** 1-based page for pagination UI (API returns 0-based pageIndex) */
  let gridPage = page;
  let totalPages = 1;

  if (query && query.trim().length > 0) {
    const colorTrimmed = parseOptionalTrimmed(color);
    const sizeTrimmed = parseOptionalTrimmed(size);
    const filters: ProductFilters = {
      query: query.trim(),
      page,
      pageSize: 24,
      sortBy: sortBy ?? "price",
      sortDir: (sortDir as "asc" | "desc") ?? "desc",
      minPrice: parseIntSearchParam(minPrice),
      maxPrice: parseIntSearchParam(maxPrice),
      ...(inStock === "true" && { inStock: true }),
      ...(colorTrimmed ? { color: colorTrimmed } : {}),
      ...(sizeTrimmed ? { size: sizeTrimmed } : {}),
    };

    try {
      const result = await searchProducts(filters);

      // Map ProductSearchItem to ProductListItem for the UI components
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

  const hasQuery = Boolean(query && query.trim().length > 0);
  const excludeIdsForYou =
    items.length > 0
      ? items
          .map((p) => (p.id != null ? String(p.id) : null))
          .filter((x): x is string => x != null)
      : [];

  const sortByResolved = sortBy ?? "price";
  const sortDirResolved = (sortDir as "asc" | "desc") ?? "desc";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
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

          <div className="flex gap-8">
            <Suspense fallback={null}>
              <FilterSidebar />
            </Suspense>

            <div className="min-w-0 flex-1">
              <ProductGrid
                products={items}
                page={gridPage}
                totalPages={totalPages}
                sortBy={sortByResolved}
                sortDir={sortDirResolved}
                collectionSlug=""
                emptyTitle="Không tìm thấy sản phẩm nào"
                emptySubtitle="Thử từ khóa khác hoặc kiểm tra lại chính tả"
              />
              {items.length > 0 && query && (
                <SearchForYouSection query={query.trim()} excludeIds={excludeIdsForYou} />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-neutral-100 dark:bg-neutral-900">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle
                cx="12"
                cy="12"
                r="7"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-neutral-300 dark:text-neutral-700"
              />
              <path
                d="M17 17l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="text-neutral-300 dark:text-neutral-700"
              />
            </svg>
          </div>
          <p className="text-base font-medium text-neutral-500">
            Tìm kiếm sản phẩm bạn muốn
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            Nhập từ khóa vào ô tìm kiếm phía trên
          </p>
        </div>
      )}
    </div>
  );
}
