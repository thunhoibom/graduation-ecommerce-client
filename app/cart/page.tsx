import type { Metadata } from "next";
import dynamic from "next/dynamic";

const CartView = dynamic(
  () => import("./_components/cart-view").then((mod) => mod.CartView),
  {
    loading: () => <div className="text-sm text-neutral-500">Dang tai gio hang...</div>,
  },
);

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
