"use server";

import { redirect } from "next/navigation";
import { getCart, addToCart, removeFromCart, updateCartItem } from "@/services/rest-api/cart/cart";

export async function addItem(
  prevState: unknown,
  variantId: string | undefined
) {
  if (!variantId) return "Vui lòng chọn phân loại sản phẩm";

  try {
    const cart = await getCart();
    if (!cart) return "Không tìm thấy giỏ hàng";
    await addToCart(cart.id, { variantId: Number(variantId), quantity: 1 });
  } catch {
    return "Lỗi khi thêm sản phẩm vào giỏ hàng";
  }
}

export async function removeItem(
  prevState: unknown,
  cartItemId: number
) {
  try {
    const cart = await getCart();
    if (!cart) return "Không tìm thấy giỏ hàng";
    await removeFromCart(cart.id, cartItemId);
  } catch {
    return "Lỗi khi xóa sản phẩm khỏi giỏ hàng";
  }
}

export async function updateItemQuantity(
  prevState: unknown,
  payload: {
    cartItemId: number;
    quantity: number;
  }
) {
  const { cartItemId, quantity } = payload;

  try {
    const cart = await getCart();
    if (!cart) return "Không tìm thấy giỏ hàng";

    if (quantity === 0) {
      await removeFromCart(cart.id, cartItemId);
    } else {
      await updateCartItem(cart.id, cartItemId, quantity);
    }
  } catch {
    return "Lỗi khi cập nhật số lượng";
  }
}

export async function redirectToCheckout() {
  // TODO: redirect to checkout page when backend payment is ready
  const cart = await getCart();
  if (cart?.checkoutUrl) {
    redirect(cart.checkoutUrl);
  }
  redirect("/cart");
}

export async function createCartAndSetCookie() {
  // Cart is now created lazily via REST API in cart-context
  // Cookie is set automatically by app-api.ts helpers
}
