import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCollection,
  getCollectionProducts,
} from "@/services/rest-api/collections/collections";
import { ProductGrid } from "./_components/product-grid";
import { CollectionHeader } from "./_components/collection-header";
import { FilterSidebar } from "./_components/filter-sidebar";
import { ActiveFilters } from "./_components/active-filters";
import { Breadcrumb } from "./_components/breadcrumb";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { ProductFilters } from "@/services/rest-api/products/products";

interface Props {
  params: Promise<{ slug: string }>;
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const collection = await getCollection(slug);
    return {
      title: `${collection.name} — Mono Studio`,
      description:
        collection.description ??
        `Khám phá bộ sưu tập ${collection.name} tại Mono Studio. Thời trang tối giản, chất lượng cao.`,
    };
  } catch {
    return { title: "Bộ sưu tập" };
  }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params;
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

  let collection;
  try {
    console.log(`[DEBUG] CollectionPage rendered for slug: ${slug}`);
    collection = await getCollection(slug);
  } catch (error) {
    console.error(`[DEBUG] CollectionPage ERROR for slug: ${slug}, triggering notFound()`);
    notFound();
  }

  const filters: ProductFilters = {
    category: slug,
    page,
    pageSize: 24,
    sortBy: sortBy ?? "name",
    sortDir: (sortDir as "asc" | "desc") ?? "asc",
    ...(minPrice !== undefined && { minPrice: parseInt(minPrice) }),
    ...(maxPrice !== undefined && { maxPrice: parseInt(maxPrice) }),
    ...(inStock === "true" && { inStock: true }),
    ...(query !== undefined && { query }),
  };

  const { items: products, totalCount, pageIndex } =
    await getCollectionProducts(slug, filters);
  const totalPages = Math.ceil((totalCount ?? 0) / 24);

  const hasChildren = collection.children && collection.children.length > 0;

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

      {/* Subcategory tabs — horizontal scroll on mobile */}
      {hasChildren && (
        <div className="mt-4 mb-2 overflow-x-auto">
          <div className="flex min-w-max items-center gap-2">
            {/* "All" tab — current category itself */}
            <Link
              href={`/collections/${slug}`}
              className="flex items-center gap-1.5 rounded-none border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
            >
              Tất cả
              {collection.productCount !== undefined && (
                <Badge
                  variant="secondary"
                  className="ml-0.5 h-4 min-w-[20px] justify-center px-1 text-[10px]"
                >
                  {collection.productCount}
                </Badge>
              )}
            </Link>

            {/* Subcategory tabs */}
            {collection.children!.map((child) => (
              <Link
                key={child.code}
                href={`/collections/${child.code}`}
                className="flex items-center gap-1.5 rounded-none border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-white"
              >
                {child.name}
                {child.productCount !== undefined && (
                  <Badge
                    variant="secondary"
                    className="ml-0.5 h-4 min-w-[20px] justify-center px-1 text-[10px]"
                  >
                    {child.productCount}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

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
            collectionSlug={slug}
          />
        </div>
      </div>
    </div>
  );
}
