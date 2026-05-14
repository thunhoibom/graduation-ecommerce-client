import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCollection,
  getCollectionProducts,
} from "@/services/rest-api/collections/collections";
import {
  parseIntSearchParam,
  parseOptionalTrimmed,
  searchProducts,
  type ProductFilters,
} from "@/services/rest-api/products/products";
import type { ProductSearchItem, ProductListItem } from "@/types/product";
import type { ProductCategoryPojo } from "@/types/person";
import { ProductGrid } from "./_components/product-grid";
import { CollectionHeader } from "./_components/collection-header";
import { FilterSidebar } from "./_components/filter-sidebar";
import { ActiveFilters } from "./_components/active-filters";
import { Breadcrumb } from "./_components/breadcrumb";
import { CollectionHero } from "./_components/collection-hero";
import { CollectionStory } from "./_components/collection-story";
import { CollectionFaq } from "./_components/collection-faq";
import { CollectionJsonLd } from "./_components/collection-json-ld";
import { CollectionWeatherRail } from "./_components/collection-weather-rail";
import { TrustStrip } from "@/components/storefront/trust-strip";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function mapSearchItemToListItem(
  item: ProductSearchItem,
  fallbackCategory: string
): ProductListItem {
  return {
    id: item.id ? parseInt(item.id) : undefined,
    name: item.name,
    barcode: item.barcode,
    price: item.price,
    currentPrice: item.price ?? 0,
    category: {
      name: item.categoryName,
      code:
        item.categoryCodes && item.categoryCodes.length > 0
          ? item.categoryCodes[0]
          : fallbackCategory,
    } as ProductCategoryPojo,
    images: item.primaryImageUrl ? [{ url: item.primaryImageUrl }] : [],
    currentStock: 1,
  };
}

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
    color?: string;
    size?: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const collection = await getCollection(slug);
    const title =
      collection.seo?.title?.trim() || `${collection.name} — Mono Studio`;
    const description =
      collection.seo?.description?.trim() ||
      collection.description ||
      `Khám phá bộ sưu tập ${collection.name} tại Mono Studio. Thời trang tối giản, chất lượng cao.`;
    return { title, description };
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
    color,
    size,
  } = await searchParams;

  const page = pageStr ? parseInt(pageStr) : 1;

  let collection;
  try {
    collection = await getCollection(slug);
  } catch (error) {
    notFound();
  }

  const colorTrimmed = parseOptionalTrimmed(color);
  const sizeTrimmed = parseOptionalTrimmed(size);
  const filters: ProductFilters = {
    category: slug,
    page,
    pageSize: 24,
    sortBy: sortBy ?? "name",
    sortDir: (sortDir as "asc" | "desc") ?? "asc",
    minPrice: parseIntSearchParam(minPrice),
    maxPrice: parseIntSearchParam(maxPrice),
    ...(inStock === "true" && { inStock: true }),
    ...(colorTrimmed ? { color: colorTrimmed } : {}),
    ...(sizeTrimmed ? { size: sizeTrimmed } : {}),
    ...(query !== undefined && query.trim() !== "" ? { query: query.trim() } : {}),
  };

  let products: ProductListItem[] = [];
  let totalCount = 0;
  /** 1-based page for pagination UI (API returns 0-based pageIndex) */
  let gridPage = page;

  if (query && query.trim().length > 0) {
    const result = await searchProducts(filters);
    products = (result.items ?? []).map((si: ProductSearchItem) =>
      mapSearchItemToListItem(si, slug)
    );
    totalCount = result.totalCount ?? 0;
    const apiIdx = result.pageIndex;
    gridPage =
      typeof apiIdx === "number" && Number.isFinite(apiIdx) ? apiIdx + 1 : page;
  } else {
    const response = await getCollectionProducts(slug, filters);
    products = response.items ?? [];
    totalCount = response.totalCount ?? 0;
    const apiIdx = response.pageIndex;
    gridPage =
      typeof apiIdx === "number" && Number.isFinite(apiIdx) ? apiIdx + 1 : page;
  }

  const totalPages = Math.ceil((totalCount ?? 0) / 24);
  const hasChildren = collection.children && collection.children.length > 0;

  return (
    <>
      <CollectionJsonLd collection={collection} products={products} totalCount={totalCount ?? 0} />
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="mb-5">
          <Breadcrumb collection={collection} />
        </div>

        <CollectionHero collection={collection} />

        <TrustStrip />

        <CollectionHeader
          collection={collection}
          totalCount={totalCount ?? 0}
          sortBy={sortBy ?? "name"}
          sortDir={sortDir ?? "asc"}
        />

        <CollectionStory descriptionHtml={collection.descriptionHtml} />

      {hasChildren && (
        <div className="mt-4 mb-2 overflow-x-auto">
          <div className="flex min-w-max items-center gap-2">
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

      <div className="mt-4">
        <ActiveFilters />
      </div>

      <div className="mt-6 flex gap-8">
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>

        <div className="min-w-0 flex-1 space-y-10">
          <ProductGrid
            products={products}
            page={gridPage}
            totalPages={totalPages}
            sortBy={sortBy ?? "name"}
            sortDir={sortDir ?? "asc"}
            collectionSlug={slug}
          />
          <CollectionWeatherRail categoryCode={slug} />
        </div>
      </div>

        <CollectionFaq />
      </div>
    </>
  );
}
