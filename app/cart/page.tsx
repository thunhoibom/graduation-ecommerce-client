import type { Metadata } from "next";
import Link from "next/link";
import { CartView } from "./_components/cart-view";

export const metadata: Metadata = {
  title: "Giỏ hàng",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Giỏ hàng</h1>
      <CartView />
    </div>
  );
}
