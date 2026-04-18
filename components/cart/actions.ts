"use client";

import { redirect } from "next/navigation";
import { removeFromCart } from "@/services/rest-api/cart/cart";

/** POST action — remove item by variantSku */
export async function removeItem(
  _prevState: unknown,
  { variantSku }: { variantSku: string }
) {
  try {
    await removeFromCart(variantSku);
    return null;
  } catch {
    return "Không thể xóa sản phẩm. Vui lòng thử lại.";
  }
}

/** Server Action — redirect to checkout page (full 4-step checkout happens client-side) */
export async function redirectToCheckout() {
  redirect("/checkout");
}
