"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ArrowRight } from "@phosphor-icons/react";
import { getMyOrders } from "@/services/rest-api/orders/orders";
import type { OrderPojo } from "@/types/order";
import { formatMoney } from "@/lib/utils";
import {
  getOrderRefundedAmount,
  isOrderFullyRefunded,
  resolveOrderPaymentDisplay,
} from "@/lib/order-return-eligibility";

export const ORDER_FULFILLMENT_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:            { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  CONFIRMED:          { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  PROCESSING:         { label: "Đang chuẩn bị hàng", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400" },
  READY_TO_PICK:      { label: "Chờ shipper lấy hàng", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" },
  PICKED_UP:          { label: "Shipper đã lấy hàng", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  DELIVERING:         { label: "Đang giao", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  DELIVERED:          { label: "Đã giao", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  COMPLETED:          { label: "Hoàn tất", color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-400" },
  CANCELLED:          { label: "Đã hủy", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  CANCELLATION_REQUESTED: { label: "Yêu cầu hủy", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
  DELIVERY_ON_ROUTE:  { label: "Đang giao", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  DELIVERY_COMPLETE:  { label: "Đã giao", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  DELIVERY_FAILED:    { label: "Giao thất bại", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
  DELIVERY_CANCELLED: { label: "Đã thu hồi giao", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  REJECTED:           { label: "Đơn bị từ chối", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  RETURNED:           { label: "Đã hoàn hàng", color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400" },
};

export function formatOrderShortDate(dateStr?: string) {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function OrderList() {
  const [orders, setOrders] = useState<OrderPojo[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const loadOrders = async (p: number) => {
    try {
      const data = await getMyOrders({ pageIndex: p - 1, pageSize: 10 });
      const items = data.items ?? [];
      if (p === 1) {
        setOrders(items);
      } else {
        setOrders((prev) => [...prev, ...items]);
      }
      setTotalCount(data.totalCount ?? 0);
      setHasMore((data.pageIndex ?? p) * 10 < (data.totalCount ?? 0));
      setPage(p);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(1); }, []);

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900">
          <Package className="size-8 text-neutral-300 dark:text-neutral-700" />
        </div>
        <div>
          <p className="font-medium text-neutral-500">Chưa có đơn hàng nào</p>
          <p className="mt-1 text-sm text-neutral-400">Các đơn hàng của bạn sẽ xuất hiện tại đây.</p>
        </div>
        <Link
          href="/collections/all"
          className="mt-2 text-sm underline underline-offset-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          Bắt đầu mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
          Đơn hàng của tôi
        </h2>
        <span className="text-sm text-neutral-500">{totalCount} đơn hàng</span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const fulfillment = order.fulfillmentStatus ?? order.status;
          const statusInfo = ORDER_FULFILLMENT_LABELS[fulfillment ?? ""] ?? {
            label: fulfillment ?? "—",
            color: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
          };
          const paymentInfo = resolveOrderPaymentDisplay(order) ?? {
            label: order.paymentStatus ?? "",
            color: "text-neutral-500",
          };
          const refundedAmount = getOrderRefundedAmount(order);
          const showDeliveredHint =
            !isOrderFullyRefunded(order) &&
            (fulfillment === "DELIVERY_COMPLETE" ||
              fulfillment === "DELIVERED" ||
              fulfillment === "COMPLETED");

          return (
            <Link
              key={order.buyOrder}
              href={`/account/orders/${order.buyOrder}`}
              className="block rounded-none border border-neutral-200 p-4 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
                      #{order.buyOrder}
                    </span>
                    <span className={`inline-flex rounded px-2 py-0.5 text-[11px] font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {formatOrderShortDate(order.date)} · {order.details?.length ?? 0} sản phẩm
                  </p>
                  {paymentInfo.label && (
                    <p className={`text-[11px] ${paymentInfo.color}`}>{paymentInfo.label}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {formatMoney(order.totalValue ?? order.netValue ?? 0)}
                    </p>
                    {(showDeliveredHint) && (
                      <p className="text-[11px] text-green-600 dark:text-green-400">Đã giao</p>
                    )}
                    {refundedAmount > 0 ? (
                      <p className="text-[11px] text-red-500">Đã hoàn {formatMoney(refundedAmount)}</p>
                    ) : null}
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-neutral-400" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => loadOrders(page + 1)}
            className="rounded-none border border-neutral-200 px-6 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
          >
            Xem thêm đơn hàng
          </button>
        </div>
      )}
    </div>
  );
}
