import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import type { Product } from "@/types/product";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  const maxPrice = product.variants.length > 0
    ? Math.max(...product.variants.map((v) => Number(v.price.amount)))
    : Number(product.price.amount);
  const currencyCode = product.price.currencyCode;

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.name}</h1>
        <div className="mr-auto w-auto rounded-full bg-black p-2 text-sm text-white dark:bg-white dark:text-black">
          <Price amount={maxPrice.toString()} currencyCode={currencyCode} />
        </div>
      </div>
      <VariantSelector
        options={product.options}
        variants={product.variants}
      />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : (
        <p className="mb-6 text-sm leading-tight dark:text-white/[60%]">
          {product.description}
        </p>
      )}
      <AddToCart product={product} />
    </>
  );
}
