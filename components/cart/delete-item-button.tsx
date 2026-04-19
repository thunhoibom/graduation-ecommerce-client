"use client";

import { Trash } from "@phosphor-icons/react";
import type { CartItem } from "@/types/cart";
import { useCart } from "./cart-context";

export function DeleteItemButton({ item }: { item: CartItem }) {
  const { removeItem } = useCart();
  const sku = item.variantSku || (item as any).sku || (item as any).variantSkuResolved;

  return (
    <button
      type="button"
      onClick={() => removeItem(sku)}
      aria-label="Xóa sản phẩm"
      className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 hover:bg-red-50 hover:text-red-500 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
    >
      <Trash className="size-3.5" />
    </button>
  );
}
