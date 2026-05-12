import type { Metadata } from "next";
import {
  getProducts,
  parseIntSearchParam,
  type ProductFilters,
} from "@/services/rest-api/products/products";
import type { ProductListItem } from "@/types/product";
import { ProductGrid } from "../[slug]/_components/product-grid";
import { FilterSidebar } from "../[slug]/_components/filter-sidebar";
import { AllProductsHeader } from "./_components/all-products-header";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{
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

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tất cả sản phẩm — Mono Studio",
    description: "Khám phá toàn bộ sản phẩm thời trang tại Mono Studio.",
  };
}

export default async function AllProductsPage({ searchParams }: Props) {
  const {
    page: pageStr,
    sortBy,
    sortDir,
    minPrice,
    maxPrice,
    inStock,
    color,
    size,
  } = await searchParams;

  const page = pageStr ? parseInt(pageStr) : 1;
  const sort = sortBy ?? "name";
  const dir = (sortDir as "asc" | "desc") ?? "asc";

  const colorTrimmed = color?.trim();
  const sizeTrimmed = size?.trim();
  const filters: ProductFilters = {
    page,
    pageSize: 24,
    sortBy: sort,
    sortDir: dir,
    minPrice: parseIntSearchParam(minPrice),
    maxPrice: parseIntSearchParam(maxPrice),
    ...(inStock === "true" && { inStock: true }),
    ...(colorTrimmed ? { color: colorTrimmed } : {}),
    ...(sizeTrimmed ? { size: sizeTrimmed } : {}),
  };

  let items: ProductListItem[] = [];
  let totalCount = 0;
  let gridPage = page;

  try {
    const result = await getProducts(filters);
    items = result.items ?? [];
    totalCount = result.totalCount ?? 0;
    const apiIdx = result.pageIndex;
    gridPage =
      typeof apiIdx === "number" && Number.isFinite(apiIdx) ? apiIdx + 1 : page;
  } catch {
    // Return empty grid on error
  }

  const totalPages = Math.ceil((totalCount ?? 0) / 24);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <Suspense fallback={null}>
        <AllProductsHeader
          totalCount={totalCount}
          sortBy={sort}
          sortDir={dir}
        />
      </Suspense>

      {/* Desktop: sidebar + grid */}
      <div className="flex gap-8">
        <Suspense fallback={null}>
          <FilterSidebar />
        </Suspense>

        <div className="min-w-0 flex-1">
          <ProductGrid
            products={items}
            page={gridPage}
            totalPages={totalPages}
            sortBy={sort}
            sortDir={dir}
            collectionSlug=""
          />
        </div>
      </div>
    </div>
  );
}
