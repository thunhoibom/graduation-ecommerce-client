import type { Metadata } from "next";
import dynamic from "next/dynamic";

const CheckoutForm = dynamic(
  () => import("./_components/checkout-form").then((mod) => mod.CheckoutForm),
  {
    loading: () => <div className="text-sm text-neutral-500">Dang tai thong tin thanh toan...</div>,
  },
);

export const metadata: Metadata = {
  title: "Thanh toán",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Thanh toán</h1>
      <CheckoutForm />
    </div>
  );
}
