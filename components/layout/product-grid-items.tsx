import Grid from "components/grid";
import { GridTileImage } from "components/grid/tile";
import type { ProductListItem } from "@/types/product";
import Link from "next/link";

export default function ProductGridItems({
  products,
}: {
  products: ProductListItem[];
}) {
  return (
    <>
      {products.map((product) => (
        (() => {
          const currentPrice = product.currentPrice;
          const originalPrice = product.originalPrice ?? product.currentPrice;
          const hasDiscount = Boolean(product.hasDiscount && currentPrice < originalPrice);
          return (
        <Grid.Item key={product.barcode} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            href={`/product/${product.barcode}`}
            prefetch={true}
          >
            <GridTileImage
              alt={product.name}
              label={{
                title: product.name,
                amount: String(currentPrice),
                currencyCode: "VND",
              }}
              src={product.images?.[0]?.url ?? "/placeholder.png"}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
            {hasDiscount ? (
              <span className="absolute bottom-2 left-2 rounded-none bg-white/90 px-2 py-1 text-xs text-neutral-600 line-through">
                {originalPrice}
              </span>
            ) : null}
          </Link>
        </Grid.Item>
          );
        })()
      ))}
    </>
  );
}
