"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShoppingBag } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const buyOrder = params.get("buyOrder");
  const token = params.get("token");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mb-6 flex justify-center">
        <CheckCircle className="size-20 text-green-500" weight="fill" />
      </div>

      <h1 className="mb-3 text-3xl font-semibold tracking-tight">
        Đặt hàng thành công!
      </h1>

      <p className="mb-2 text-neutral-500">
        Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
      </p>

      {buyOrder && (
        <p className="mb-8 font-mono text-lg">
          Mã đơn hàng: <strong>#{buyOrder}</strong>
        </p>
      )}

      {token && (
        <p className="mb-8 rounded border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
          Token: {token}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {buyOrder && (
          <Link href={`/account/orders/${buyOrder}`}>
            <Button className="w-full" size="lg">
              Xem chi tiết đơn hàng
            </Button>
          </Link>
        )}
        <Link href="/collections/all">
          <Button variant="outline" className="w-full" size="lg">
            <ShoppingBag className="mr-2 size-5" />
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>
    </div>
  );
}
