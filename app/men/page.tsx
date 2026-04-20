import type { Metadata } from "next";
import { getProducts } from "@/services/rest-api/products/products";
import type { ProductFilters } from "@/services/rest-api/products/products";
import { ProductGrid } from "@/app/collections/[slug]/_components/product-grid";
import { CollectionHeader } from "@/app/collections/[slug]/_components/collection-header";
import { FilterSidebar } from "@/app/collections/[slug]/_components/filter-sidebar";
import { ActiveFilters } from "@/app/collections/[slug]/_components/active-filters";
import { Breadcrumb } from "@/app/collections/[slug]/_components/breadcrumb";

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
    title: "Nam — Mono Studio",
    description: "Thời trang nam cao cấp, tối giản tại Mono Studio",
  };
}

export default async function MenPage({ searchParams }: Props) {
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
    category: "men",
    page,
    pageSize: 24,
    sortBy: sortBy ?? "name",
    sortDir: (sortDir as "asc" | "desc") ?? "asc",
    ...(minPrice !== undefined && { minPrice: parseInt(minPrice) }),
    ...(maxPrice !== undefined && { maxPrice: parseInt(maxPrice) }),
    ...(inStock === "true" && { inStock: true }),
    ...(query !== undefined && { query }),
  };

  const { items: products, totalCount, pageIndex } = await getProducts(filters);
  const totalPages = Math.ceil((totalCount ?? 0) / 24);

  const collection = { name: "Nam", code: "men", children: [] };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {/* Breadcrumb trail */}
      <div className="mb-5">
        <Breadcrumb collection={collection} />
      </div>

      {/* Header with sort */}
      <CollectionHeader
        collection={collection}
        totalCount={totalCount ?? 0}
        sortBy={sortBy ?? "name"}
        sortDir={sortDir ?? "asc"}
      />

      {/* Subcategory tabs — none for /men, kept for consistency */}
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
            products={products}
            page={pageIndex ?? page}
            totalPages={totalPages}
            sortBy={sortBy ?? "name"}
            sortDir={sortDir ?? "asc"}
            collectionSlug="men"
          />
        </div>
      </div>
    </div>
  );
}
