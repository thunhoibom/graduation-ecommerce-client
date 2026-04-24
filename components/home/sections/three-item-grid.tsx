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
