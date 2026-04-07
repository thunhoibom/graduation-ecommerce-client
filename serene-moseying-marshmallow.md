# Plan: Homepage — Mono Studio E-Commerce

## Context

Trang chủ hiện tại (`app/page.tsx`) có 4 section nhưng **chưa xử lý loading/error state** (không có `loading.tsx`/`error.tsx` root), **chưa gọi API `/api/public/about`** (HeroSection hoàn toàn tĩnh), và **`app/search/page.tsx` chỉ là placeholder**. Mục tiêu: làm cho homepage hoàn toàn **data-driven** từ backend, có skeleton loading, error boundary, và API service layer đầy đủ.

---

## 1. Tạo `services/rest-api/about/about.ts`

**Tạo file mới:**
```
services/rest-api/about/about.ts
```

**Lý do:** Backend có `GET /api/public/about` nhưng chưa có service phía frontend. Response shape là `CompanyDetailsPojo`:
```ts
{ name: string; description: string; bannerImageURL: string; logoImageURL: string }
```

**Code:**
```ts
import { api } from "../app-api";

export interface CompanyDetailsPojo {
  name: string;
  description?: string;
  bannerImageURL?: string;
  logoImageURL?: string;
  tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: Record<string, string>;
}

export async function getAbout(): Promise<CompanyDetailsPojo> {
  const { data } = await api.get<CompanyDetailsPojo>("/api/public/about");
  return data;
}
```

---

## 2. Tạo `app/loading.tsx` (Root)

**Tạo file:** `app/loading.tsx`

**Mục đích:** Hiển thị skeleton toàn trang khi bất kỳ route nào đang loading (Next.js App Router streaming).

**Pattern:** Dùng `components/ui/skeleton.tsx` (hiện đã có, chỉ cần pass className tùy chỉnh).

```tsx
// app/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-12">
      {/* Hero skeleton */}
      <div className="h-[400px] rounded-lg bg-neutral-100 dark:bg-neutral-800" />
      {/* Product grid skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[3/4] w-full rounded-none" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 3. Tạo `app/error.tsx` (Root — nếu chưa có hoặc thay thế)

**Kiểm tra:** Hiện tại `app/error.tsx` **đã tồn tại** với nội dung cơ bản. Giữ nguyên hoặc enhance thêm.

Nếu cần thay thế — nội dung tối thiểu đã đủ:
- Hiển thị thông báo lỗi thân thiện
- Nút "Thử lại" gọi `reset()`
- Styled với dark mode

---

## 4. Tạo `components/home/sections/hero-section.tsx`

**Thay thế:** `components/home/hero-section.tsx` (giữ nguyên file, chỉ refactor nội dung)

**Biến thành Server Component async:**

```tsx
// components/home/sections/hero-section.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@phosphor-icons/react";
import { getAbout } from "@/services/rest-api/about/about";

export async function HeroSection() {
  let about;
  try {
    about = await getAbout();
  } catch {
    about = null;
  }

  const name = about?.name ?? "Mono Studio";
  const description = about?.description ?? "Thời trang tối giản cho những ai đặt chất lượng lên hàng đầu.";
  const bannerUrl = about?.bannerImageURL;

  return (
    <section className="relative w-full bg-neutral-50 dark:bg-black">
      <div className="absolute left-0 top-0 h-full w-px bg-neutral-200 dark:bg-neutral-800" />

      {bannerUrl ? (
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <Image
            src={bannerUrl}
            alt={name}
            fill
            priority
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-7xl px-4 max-w-2xl text-white">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                {name} — 2026
              </p>
              <h1 className="mt-4 font-display text-5xl font-bold tracking-tight md:text-7xl">
                Minimal.<br />Intentional.<br />Yours.
              </h1>
              <p className="mt-6 text-base leading-relaxed text-white/80 md:text-lg max-w-lg">
                {description}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gap-2 bg-white text-black hover:bg-white/90">
                  <Link href="/collections/all">
                    Khám phá bộ sưu tập
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/50 text-white hover:bg-white/10">
                  <Link href="/about">Về chúng tôi</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Fallback: text-only hero
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              {name} — 2026
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-7xl">
              Minimal.<br />Intentional.<br />Yours.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
              {description}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/collections/all">
                  Khám phá bộ sưu tập
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Về chúng tôi</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />
    </section>
  );
}
```

**Lưu ý:** Component vẫn dùng `export default` (không đổi tên) — file cũ được replace.

---

## 5. Tạo `components/home/sections/three-item-grid.tsx`

**Thay thế:** `components/grid/three-items.tsx`

**Cải thiện:**
- Đổi tên thành Server Component (`ThreeItemGrid` không có "use client")
- Thêm skeleton khi loading (tạm thời dùng component `ProductGridSkeleton` inline)
- Xử lý error bằng cách return null
- Hiệu năng: thêm `loading="lazy"` và `priority={false}` cho ảnh ngoài viewport đầu tiên

```tsx
// components/home/sections/three-item-grid.tsx
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/services/rest-api/products/products";
import type { ProductListItem } from "@/types/product";
import { formatMoney } from "@/lib/utils";

function ProductCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[3/4] w-full rounded-none border border-neutral-200 dark:border-neutral-800" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export async function ThreeItemGrid() {
  let items: ProductListItem[] = [];
  try {
    const data = await getProducts({ page: 1, pageSize: 3 });
    items = data.items ?? [];
  } catch {
    return null; // fail silently — section simply won't render
  }

  if (!items.length) return null;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Sản phẩm mới
          </h2>
          <Link
            href="/collections/all"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white underline-offset-4 hover:underline transition-colors"
          >
            Xem tất cả
          </Link>
        </div>

        <ul className="grid grid-flow-row gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((product, index) => (
            <li key={product.id} className="animate-fadeIn">
              <Link href={`/product/${product.barcode}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                  {product.images?.[0]?.url ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      priority={index < 3}
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                      <span className="text-sm">{product.name}</span>
                    </div>
                  )}
                  {!product.currentStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black">
                        Hết hàng
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-1">
                  {product.category?.name && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {product.category.name}
                    </p>
                  )}
                  <h3 className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {formatMoney(product.price)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

**Xóa:** `components/grid/three-items.tsx` (thay thế hoàn toàn)

---

## 6. Tạo `components/home/sections/collections-grid.tsx`

**Thay thế:** `components/home/collections-grid.tsx`

**Cải thiện:**
- Error handling → return null on failure
- Stale-while-revalidate pattern: thêm `next: { revalidate: 3600 }` (cache 1 giờ cho categories)
- Image fallback: dùng `col.imageUrl` hoặc `col.image?.url`

```tsx
// components/home/sections/collections-grid.tsx
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getCollections } from "@/services/rest-api/collections/collections";
import type { CollectionListItem } from "@/types/collection";

export const revalidate = 3600; // ISR — revalidate every hour

export async function CollectionsGrid() {
  let collections: CollectionListItem[] = [];
  try {
    collections = await getCollections();
  } catch {
    return null;
  }

  if (!collections?.length) return null;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Bộ sưu tập
          </h2>
          <Link
            href="/collections"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white underline-offset-4 hover:underline transition-colors"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {collections.map((col) => (
            <Link key={col.code} href={`/collections/${col.code}`} className="group">
              <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow">
                <CardContent className="p-0 aspect-square relative bg-neutral-100 dark:bg-neutral-900">
                  {col.imageUrl ?? col.image?.url ? (
                    <Image
                      src={col.imageUrl ?? col.image!.url}
                      alt={col.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-100 dark:bg-neutral-900">
                      <span className="text-3xl font-bold tracking-tight text-neutral-300 dark:text-neutral-700">
                        {col.name.charAt(0)}
                      </span>
                      <span className="text-xs text-neutral-400 dark:text-neutral-600">
                        {col.name}
                      </span>
                    </div>
                  )}
                </CardContent>
                <div className="border-t border-neutral-100 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950">
                  <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                    {col.name}
                  </p>
                  {col.productCount !== undefined && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {col.productCount} sản phẩm
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 7. Tạo `components/home/sections/featured-carousel.tsx`

**Thay thế:** `components/carousel.tsx` (Server) + `components/carousel/home-carousel.tsx` (Client)

**Mục đích:** Carousel hiện tại có `Carousel` (Server) gọi `getProducts` rồi truyền cho `HomeCarousel` (Client). Giữ nguyên kiến trúc, chỉ cải thiện error handling.

```tsx
// components/home/sections/featured-carousel.tsx
// (Server Component — wraps HomeCarousel client)

import { getProducts } from "@/services/rest-api/products/products";
import { FeaturedCarouselClient } from "./featured-carousel-client";

export async function FeaturedCarousel() {
  let items = [];
  try {
    const data = await getProducts({ page: 1, pageSize: 12 });
    items = data.items ?? [];
  } catch {
    return null;
  }

  if (!items.length) return null;

  return <FeaturedCarouselClient products={items} />;
}
```

```tsx
// components/home/sections/featured-carousel-client.tsx
// (Client Component — interactive carousel)

"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CaretLeft, CaretRight, ShoppingBag } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import type { ProductListItem } from "@/types/product";

interface Props { products: ProductListItem[]; }

export function FeaturedCarouselClient({ products }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const item = scrollRef.current.querySelector("li");
    const itemWidth = item?.offsetWidth ?? 272;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -(itemWidth * 4) : itemWidth * 4,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Đáng chú ý
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll("left")}
              aria-label="Cuộn sang trái" className="size-9">
              <CaretLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")}
              aria-label="Cuộn sang phải" className="size-9">
              <CaretRight className="size-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 pl-1 pr-1 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.barcode}`}
              className="group flex-none w-[240px] md:w-[260px]"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-none border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                {product.images?.[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    loading="lazy"
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 240px, 260px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                    <ShoppingBag className="size-8" />
                  </div>
                )}
                {!product.currentStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black">
                      Hết hàng
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3 space-y-1">
                {product.category?.name && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {product.category.name}
                  </p>
                )}
                <h3 className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                  {product.name}
                </h3>
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {formatMoney(product.price)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 8. Cập nhật `app/page.tsx`

```tsx
import { HeroSection } from "@/components/home/sections/hero-section";
import { ThreeItemGrid } from "@/components/home/sections/three-item-grid";
import { CollectionsGrid } from "@/components/home/sections/collections-grid";
import { FeaturedCarousel } from "@/components/home/sections/featured-carousel";
import Footer from "@/components/layout/footer";

export const metadata = {
  title: "Mono Studio — Thời trang tối giản",
  description: "Khám phá bộ sưu tập thời trang tối giản của Mono Studio. Chất lượng cao, thiết kế có chủ đích.",
  openGraph: { type: "website" },
};

// Optional: ISR — revalidate homepage every 5 minutes
export const revalidate = 300;

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <ThreeItemGrid />
      <CollectionsGrid />
      <FeaturedCarousel />
      <Footer />
    </>
  );
}
```

---

## 9. Xóa file cũ

Sau khi các file mới hoạt động ổn định, xóa các file thay thế:
- `components/home/hero-section.tsx` (→ `components/home/sections/hero-section.tsx`)
- `components/grid/three-items.tsx` (→ `components/home/sections/three-item-grid.tsx`)
- `components/home/collections-grid.tsx` (→ `components/home/sections/collections-grid.tsx`)
- `components/carousel.tsx` (→ `components/home/sections/featured-carousel.tsx`)

---

## File Changes Summary

| Hành động | File |
|-----------|------|
| Tạo mới | `services/rest-api/about/about.ts` |
| Tạo mới | `app/loading.tsx` |
| Tạo mới | `components/home/sections/hero-section.tsx` |
| Tạo mới | `components/home/sections/three-item-grid.tsx` |
| Tạo mới | `components/home/sections/collections-grid.tsx` |
| Tạo mới | `components/home/sections/featured-carousel.tsx` |
| Tạo mới | `components/home/sections/featured-carousel-client.tsx` |
| Sửa | `app/page.tsx` |
| Xóa | `components/home/hero-section.tsx` |
| Xóa | `components/grid/three-items.tsx` |
| Xóa | `components/home/collections-grid.tsx` |
| Xóa | `components/carousel.tsx` |

---

## Verification

1. Chạy `pnpm dev` — trình duyệt mở `http://localhost:3000`
2. Kiểm tra **Network tab**:
   - `GET /api/public/about` → hero hiển thị banner + brand info
   - `GET /api/data/product_categories` → collections grid render đúng
   - `GET /api/data/products?page=1&pageSize=3` → 3 sản phẩm mới
   - `GET /api/data/products?page=1&pageSize=12` → carousel 12 sản phẩm
3. Test **loading state**: Reload trang → skeleton loading hiển thị
4. Test **error boundary**: Tạm tắt backend → trang hiển thị `app/error.tsx` fallback
5. Test **dark mode**: Bật dark mode → tất cả section render đúng
6. Test **responsive**: Mobile → 2-col grid, Desktop → 3-4 col grid
