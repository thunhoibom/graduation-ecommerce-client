"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { removeItem } from "components/cart/actions";
import type { CartItem } from "@/types/cart";
import { useActionState } from "react";

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem;
  optimisticUpdate: (variantId: number, updateType: "delete") => void;
}) {
  const [message, formAction] = useActionState(removeItem, null);
  const removeItemAction = formAction.bind(null, item.id);

  return (
    <form
      action={async () => {
        optimisticUpdate(item.variant.id, "delete");
        removeItemAction();
      }}
    >
      <button
        type="submit"
        aria-label="Xóa sản phẩm khỏi giỏ hàng"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
      >
        <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
