import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "@phosphor-icons/react/dist/ssr";
import { getProducts, type ProductFilters } from "@/services/rest-api/products/products";
import { SortSelect } from "./_components/sort-select";
import { ProductGrid, FilterSidebar, ActiveFilters } from "./_components";

interface Props {
  searchParams: Promise<{
    page?: string;
    sortBy?: string;
    sortDir?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Khuyến mãi — Mono Studio",
    description:
      "Ưu đãi hấp dẫn lên đến 50% tại Mono Studio. Thời trang tối giản, chất lượng cao với giá ưu đãi nhất.",
  };
}

export default async function SalePage({ searchParams }: Props) {
  const {
    page: pageStr,
    sortBy,
    sortDir,
    minPrice,
    maxPrice,
    inStock,
  } = await searchParams;

  const page = pageStr ? parseInt(pageStr) : 1;

  const filters: ProductFilters = {
    category: "sale",
    page,
    pageSize: 24,
    sortBy: sortBy ?? "name",
    sortDir: (sortDir as "asc" | "desc") ?? "asc",
    ...(minPrice !== undefined && { minPrice: parseInt(minPrice) }),
    ...(maxPrice !== undefined && { maxPrice: parseInt(maxPrice) }),
    ...(inStock === "true" && { inStock: true }),
  };

  const { items: products, totalCount, pageIndex } = await getProducts(filters);
  const totalPages = Math.ceil((totalCount ?? 0) / 24);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-xs text-neutral-500">
        <Link href="/" className="hover:text-neutral-900 dark:hover:text-white">
          Trang chủ
        </Link>
        <span>/</span>
        <span className="text-neutral-900 dark:text-white">Khuyến mãi</span>
      </nav>

      {/* ── Sale Hero Banner ──────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-orange-400 px-6 py-12 text-center md:px-12">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-8 top-4 size-24 rotate-12 rounded-full bg-white" />
          <div className="absolute right-12 bottom-6 size-16 -rotate-6 rounded-full bg-white" />
          <div className="absolute right-32 top-8 size-10 rotate-6 rounded-full bg-white" />
        </div>

        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-none bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <Tag className="size-3" weight="fill" />
            PROMOTION
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            SALE UP TO 50% OFF
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-red-100 md:text-base">
            Ưu đãi hấp dẫn cho các sản phẩm trong danh mục khuyến mãi. Chất lượng cao, giá tốt nhất.
          </p>

          {/* Static countdown timer display */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <CountdownUnit value="03" label="Ngày" />
            <span className="text-xl font-bold text-white">:</span>
            <CountdownUnit value="12" label="Giờ" />
            <span className="text-xl font-bold text-white">:</span>
            <CountdownUnit value="45" label="Phút" />
            <span className="text-xl font-bold text-white">:</span>
            <CountdownUnit value="30" label="Giây" />
          </div>
        </div>
      </div>

      {/* ── Collection-style header ──────────────────────── */}
      <div className="mt-8 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Ưu đãi đặc biệt
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {totalCount ?? 0} sản phẩm khuyến mãi
          </p>
        </div>

        {/* Desktop sort */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-sm text-neutral-500">Sắp xếp:</span>
          <SortSelect
            sortBy={sortBy ?? "name"}
            sortDir={sortDir ?? "asc"}
            baseHref="/sale"
          />
        </div>
      </div>

      {/* Mobile sort + filter row */}
      <div className="flex items-center gap-2 sm:hidden">
        <FilterSidebar isMobile />
        <div className="flex-1">
          <SortSelect
            sortBy={sortBy ?? "name"}
            sortDir={sortDir ?? "asc"}
            baseHref="/sale"
          />
        </div>
      </div>

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
            collectionSlug="sale"
          />
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-none bg-white/20 backdrop-blur-sm md:h-14 md:w-14">
        <span className="text-xl font-bold text-white md:text-2xl">{value}</span>
      </div>
      <span className="mt-1 text-[10px] uppercase tracking-wide text-red-100">{label}</span>
    </div>
  );
}
