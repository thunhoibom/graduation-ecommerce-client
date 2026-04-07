"use client";

import clsx from "clsx";
import { Minus, Plus } from "@phosphor-icons/react";
import type { CartItem } from "@/types/cart";
import { useCart } from "./cart-context";

export function EditItemQuantityButton({
  item,
  type,
}: {
  item: CartItem;
  type: "plus" | "minus";
}) {
  const { updateItem } = useCart();

  return (
    <button
      type="button"
      onClick={() =>
        updateItem(item.variantSku, type === "plus" ? item.quantity + 1 : item.quantity - 1)
      }
      aria-label={type === "plus" ? "Tăng số lượng" : "Giảm số lượng"}
      className={clsx(
        "flex h-7 w-7 items-center justify-center rounded border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500",
        type === "plus" ? "ml-auto" : "",
      )}
    >
      {type === "plus" ? (
        <Plus className="size-3" />
      ) : (
        <Minus className="size-3" />
      )}
    </button>
  );
}
