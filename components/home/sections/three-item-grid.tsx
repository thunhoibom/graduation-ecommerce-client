import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/services/rest-api/products/products";
import type { ProductListItem } from "@/types/product";
import { HomeSectionHeader } from "@/components/home/sections/home-section-header";
import { resolveProductCardPricing } from "@/lib/product-pricing";
import { ProductDiscountBadge } from "@/components/product/product-discount-badge";
import { ProductCardPrice } from "@/components/product/product-card-price";

export async function ThreeItemGrid() {
  let items: ProductListItem[] = [];
  try {
    const data = await getProducts({ page: 1, pageSize: 3 });
    items = data.items ?? [];
  } catch {
    return null;
  }

  if (!items.length) return null;

  return (
    <section className="home-surface home-section">
      <div className="section-shell">
        <HomeSectionHeader
          eyebrow="Mới cập nhật"
          title="Sản phẩm mới"
          action={
            <Link href="/collections/all" className="home-text-link">
              Xem tất cả
            </Link>
          }
        />

        <ul className="grid grid-flow-row gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {items.map((product, index) => {
            const pricing = resolveProductCardPricing(product);
            return (
            <li key={product.barcode}>
              <Link href={`/product/${product.barcode}`} className="group block">
                <div className="home-product-media">
                  {product.images?.[0]?.url ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      priority={index < 3}
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-neutral-400">{product.name}</span>
                    </div>
                  )}

                  {product.currentStock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="rounded-none bg-white/90 px-3 py-1 text-xs font-medium text-black">
                        Hết hàng
                      </span>
                    </div>
                  )}
                  {pricing.hasDiscount ? (
                    <ProductDiscountBadge discountPercent={pricing.discountPercent} />
                  ) : null}
                </div>

                <div className="mt-4 space-y-1.5">
                  {product.category?.name && (
                    <p className="text-xs uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                      {product.category.name}
                    </p>
                  )}
                  <h3 className="truncate text-base font-medium leading-tight text-neutral-900 dark:text-white">
                    {product.name}
                  </h3>
                  <ProductCardPrice pricing={pricing} />
                </div>
              </Link>
            </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
