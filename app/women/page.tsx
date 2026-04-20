import type { Metadata } from "next";
import { getProducts } from "@/services/rest-api/products/products";
import type { ProductFilters } from "@/services/rest-api/products/products";
import { ProductGrid } from "@/app/collections/[slug]/_components/product-grid";
import { CollectionHeader } from "@/app/collections/[slug]/_components/collection-header";
import { FilterSidebar } from "@/app/collections/[slug]/_components/filter-sidebar";
import { ActiveFilters } from "@/app/collections/[slug]/_components/active-filters";
import { Breadcrumb } from "@/app/collections/[slug]/_components/breadcrumb";
import type { Collection } from "@/types/collection";

interface Props {
  searchParams: Promise<{
    page?: string;
    sortBy?: string;
    sortDir?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    query?: string;
  }>;
}

export async function generateMetadata(_props: Props): Promise<Metadata> {
  return {
    title: "Nữ — Mono Studio",
    description: "Thời trang nữ cao cấp, tối giản tại Mono Studio.",
  };
}

const WOMEN_COLLECTION: Collection = {
  name: "Nữ",
  code: "women",
  children: [],
};

export default async function WomenPage({ searchParams }: Props) {
  const {
    page: pageStr,
    sortBy,
    sortDir,
    minPrice,
    maxPrice,
    inStock,
    query,
  } = await searchParams;

  const page = pageStr ? parseInt(pageStr) : 1;

  const filters: ProductFilters = {
    category: "women",
    page,
    pageSize: 24,
    sortBy: sortBy ?? "name",
    sortDir: (sortDir as "asc" | "desc") ?? "asc",
    ...(minPrice !== undefined && { minPrice: parseInt(minPrice) }),
    ...(maxPrice !== undefined && { maxPrice: parseInt(maxPrice) }),
    ...(inStock === "true" && { inStock: true }),
    ...(query !== undefined && { query }),
  };

  let items: Awaited<ReturnType<typeof getProducts>>["items"] = [];
  let totalCount = 0;
  let pageIndex = 1;
  let totalPages = 1;

  try {
    const result = await getProducts(filters);
    items = result.items ?? [];
    totalCount = result.totalCount ?? 0;
    pageIndex = result.pageIndex ?? page;
    totalPages = Math.ceil((totalCount ?? 0) / 24);
  } catch {
    // Return empty grid on error
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {/* Breadcrumb trail */}
      <div className="mb-5">
        <Breadcrumb collection={WOMEN_COLLECTION} />
      </div>

      {/* Header with sort */}
      <CollectionHeader
        collection={WOMEN_COLLECTION}
        totalCount={totalCount ?? 0}
        sortBy={sortBy ?? "name"}
        sortDir={sortDir ?? "asc"}
      />

      {/* Active filter chips */}
      <div className="mt-4">
        <ActiveFilters />
      </div>

      {/* Layout: sidebar + grid */}
      <div className="mt-6 flex gap-8">
        {/* Desktop filter sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>

        {/* Product grid */}
        <div className="min-w-0 flex-1">
          <ProductGrid
            products={items}
            page={pageIndex ?? page}
            totalPages={totalPages}
            sortBy={sortBy ?? "name"}
            sortDir={sortDir ?? "asc"}
            collectionSlug="women"
          />
        </div>
      </div>
    </div>
  );
}
