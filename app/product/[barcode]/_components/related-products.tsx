import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/services/rest-api/products/products";
import type { ProductListItem } from "@/types/product";
import { resolveProductCardPricing } from "@/lib/product-pricing";
import { ProductDiscountBadge } from "@/components/product/product-discount-badge";
import { ProductCardPrice } from "@/components/product/product-card-price";

interface RelatedProductsProps {
  categorySlug?: string;
  currentBarcode?: string;
}

export async function RelatedProducts({ categorySlug, currentBarcode }: RelatedProductsProps) {
  if (!categorySlug) return null;

  let items: ProductListItem[] = [];
  try {
    const data = await getProducts({
      category: categorySlug,
      pageSize: 4,
    });
    items = (data.items ?? []).filter((p) => p.barcode !== currentBarcode).slice(0, 4);
  } catch {
    return null;
  }

  if (items.length < 2) return null;

  return (
    <section className="mt-16 border-t border-neutral-200 pt-12 dark:border-neutral-800">
      <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-6">
        Sản phẩm cùng danh mục
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) => {
          const pricing = resolveProductCardPricing(item);
          return (
          <Link key={item.barcode} href={`/product/${item.barcode}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
              {item.images?.[0]?.url ? (
                <Image
                  src={item.images[0].url}
                  alt={item.name}
                  fill
                  loading="lazy"
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-neutral-300 dark:text-neutral-700">
                  {item.name.charAt(0)}
                </div>
              )}
              {!item.currentStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-black">
                    Hết hàng
                  </span>
                </div>
              )}
              {pricing.hasDiscount ? (
                <ProductDiscountBadge discountPercent={pricing.discountPercent} />
              ) : null}
            </div>
            <div className="mt-2 space-y-0.5">
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                {item.category?.name}
              </p>
              <p className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-white">
                {item.name}
              </p>
              <ProductCardPrice pricing={pricing} />
            </div>
          </Link>
          );
        })}
      </div>
    </section>
  );
}
