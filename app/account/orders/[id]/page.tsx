"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useAuth } from "@/hooks/use-auth";
import { OrderDetail } from "./_components/order-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { id } = use(params);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/account/orders");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
        </div>
      </div>
    );
  }

  const buyOrder = parseInt(id ?? "");

  if (isNaN(buyOrder)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
        <p className="text-center text-neutral-500">Mã đơn hàng không hợp lệ.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      <OrderDetail buyOrder={buyOrder} />
    </div>
  );
}
