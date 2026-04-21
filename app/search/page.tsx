import type { Metadata } from "next";
import { getProducts, searchProducts } from "@/services/rest-api/products/products";
import type { ProductFilters } from "@/services/rest-api/products/products";
import type { ProductListItem, ProductSearchItem } from "@/types/product";
import { SearchBox } from "./_components/search-box";
import { SearchResults } from "./_components/search-results";
import { SearchHeader } from "./_components/search-header";

interface Props {
  searchParams: Promise<{
    query?: string;
    page?: string;
    sortBy?: string;
    sortDir?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { query } = await searchParams;
  return {
    title: query ? `"${query}" — Tìm kiếm — Mono Studio` : "Tìm kiếm — Mono Studio",
    description: query
      ? `Kết quả tìm kiếm cho "${query}" tại Mono Studio`
      : "Tìm kiếm sản phẩm tại Mono Studio.",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const {
    query,
    page: pageStr,
    sortBy,
    sortDir,
    minPrice,
    maxPrice,
    inStock,
  } = await searchParams;

  const page = pageStr ? parseInt(pageStr) : 1;

  // Only fetch products if there's a query
  let items: ProductListItem[] = [];
  let totalCount = 0;
  let pageIndex = 1;
  let totalPages = 1;

  if (query && query.trim().length > 0) {
    const filters: ProductFilters = {
      query: query.trim(),
      page,
      pageSize: 24,
      sortBy: sortBy ?? "name",
      sortDir: (sortDir as "asc" | "desc") ?? "asc",
      ...(minPrice !== undefined && { minPrice: parseInt(minPrice) }),
      ...(maxPrice !== undefined && { maxPrice: parseInt(maxPrice) }),
      ...(inStock === "true" && { inStock: true }),
    };

    try {
      // Use Elasticsearch-powered search endpoint
      const result = await searchProducts(filters);

      console.log(`>>> [DEBUG SSR SEARCH] Filters:`, JSON.stringify(filters));
      console.log(`>>> [DEBUG SSR SEARCH] Found ${result.totalCount} items`);

      // Map ProductSearchItem to ProductListItem for the UI components
      items = (result.items ?? []).map((si: ProductSearchItem) => ({
        id: si.id ? parseInt(si.id) : undefined,
        name: si.name,
        barcode: si.barcode,
        price: si.price,
        category: {
          name: si.categoryName,
          code: si.categoryCodes && si.categoryCodes.length > 0 ? si.categoryCodes[0] : undefined
        },
        images: si.primaryImageUrl ? [{ url: si.primaryImageUrl }] : [],
        currentStock: 1, // Default to in stock for ES items
      })) as ProductListItem[];

      totalCount = result.totalCount ?? 0;
      pageIndex = result.pageIndex ?? page;
      totalPages = Math.ceil((totalCount ?? 0) / 24);
    } catch (error) {
      console.error("ES Search error:", error);
      // Return empty results on error
    }
  }

  const hasQuery = Boolean(query && query.trim().length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      {/* Page title */}
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-6">
        Tìm kiếm
      </h1>

      {/* Search input */}
      <div className="mb-6">
        <SearchBox />
      </div>

      {/* Results */}
      {hasQuery ? (
        <>
          <SearchHeader
            totalCount={totalCount}
            sortBy={sortBy ?? "name"}
            sortDir={(sortDir as "asc" | "desc") ?? "asc"}
          />
          <SearchResults
            products={items}
            totalCount={totalCount}
            page={pageIndex}
            totalPages={totalPages}
          />
        </>
      ) : (
        /* Empty / no-query state */
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-neutral-100 dark:bg-neutral-900">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" className="text-neutral-300 dark:text-neutral-700" />
              <path d="M17 17l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-neutral-300 dark:text-neutral-700" />
            </svg>
          </div>
          <p className="text-base font-medium text-neutral-500">
            Tìm kiếm sản phẩm bạn muốn
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            Nhập từ khóa vào ô tìm kiếm bên trên
          </p>
        </div>
      )}
    </div>
  );
}
