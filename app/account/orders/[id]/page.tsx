"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AccountLayout } from "../../_components/account-layout";
import { OrderDetail } from "./_components/order-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && id) {
      router.replace(`/login?redirect=${encodeURIComponent(`/account/orders/${id}`)}`);
    }
  }, [isLoading, isAuthenticated, router, id]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
      </div>
    );
  }

  const buyOrder = parseInt(id ?? "");

  if (isNaN(buyOrder)) {
    return (
      <AccountLayout>
        <div className="rounded-none border border-neutral-200 p-6 text-center dark:border-neutral-800">
          <p className="text-neutral-500">Mã đơn hàng không hợp lệ.</p>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800">
        <OrderDetail buyOrder={buyOrder} />
      </div>
    </AccountLayout>
  );
}
