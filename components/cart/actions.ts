"use client";

import { redirect } from "next/navigation";
import { removeFromCart } from "@/services/rest-api/cart/cart";
import { initiateCheckout } from "@/services/rest-api/checkout/checkout";
import { getCart } from "@/services/rest-api/cart/cart";

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

/** Server Action — redirect to payment gateway after checkout init */
export async function redirectToCheckout() {
  const cart = await getCart();
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  try {
    const result = await initiateCheckout({ cartSessionToken: cart.token });
    if (result.url) {
      redirect(result.url);
    }
    // Fallback: go to a checkout status page
    redirect(`/checkout/status?buyOrder=${result.buyOrder}&token=${result.token}`);
  } catch {
    redirect("/cart");
  }
}