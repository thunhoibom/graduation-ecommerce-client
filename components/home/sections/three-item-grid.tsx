import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/services/rest-api/products/products";
import type { ProductListItem } from "@/types/product";
import { formatMoney } from "@/lib/utils";

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
    <section className="border-y border-neutral-200/80 bg-white/70 py-12 md:py-14 dark:border-neutral-800 dark:bg-neutral-950/40">
      <div className="section-shell">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-subtitle">Mới cập nhật</p>
            <h2 className="section-title mt-1">Sản phẩm mới</h2>
          </div>
          <Link
            href="/collections/all"
            className="text-sm font-medium text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:text-white"
          >
            Xem tất cả
          </Link>
        </div>

        <ul className="grid grid-flow-row gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((product, index) => (
            <li key={product.barcode}>
              <Link
                href={`/product/${product.barcode}`}
                className="group block"
              >
                {/* Image */}
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
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-neutral-400">{product.name}</span>
                    </div>
                  )}

                  {/* Out-of-stock overlay */}
                  {product.currentStock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black">
                        Hết hàng
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="mt-3 space-y-1">
                  {product.category?.name && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {product.category.name}
                    </p>
                  )}
                  <h3 className="truncate text-sm font-medium leading-tight text-neutral-900 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {formatMoney(product.currentPrice)}
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
