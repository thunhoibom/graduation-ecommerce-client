import Link from "next/link";
import Grid from "components/grid/index";
import { GridTileImage } from "./tile";
import { getProducts } from "@/services/rest-api/products/products";
import type { ProductListItem } from "@/types/product";

export async function ThreeItemGrid() {
  const { items } = await getProducts({ page: 1, pageSize: 3 });

  if (!items?.length) return null;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Sản phẩm mới
          </h2>
          <Link
            href="/collection/all"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white underline-offset-4 hover:underline transition-colors"
          >
            Xem tất cả
          </Link>
        </div>
        <Grid>
          {items.map((product: ProductListItem) => (
            <Grid.Item key={product.id}>
              <Link href={`/product/${product.barcode}`}>
                <GridTileImage
                  src={product.images?.[0]?.url ?? ""}
                  alt={product.name}
                  label={{
                    title: product.name,
                    amount: String(product.price),
                    currencyCode: "VND",
                    position: "bottom",
                  }}
                />
              </Link>
            </Grid.Item>
          ))}
        </Grid>
      </div>
    </section>
  );
}
