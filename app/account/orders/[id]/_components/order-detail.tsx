"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package } from "@phosphor-icons/react";
import { getMyOrder } from "@/services/rest-api/orders/orders";
import { cancelOrder } from "@/services/rest-api/orders/orders";
import type { OrderPojo } from "@/types/order";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:          { label: "Chờ xác nhận",   color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  CONFIRMED:        { label: "Đã xác nhận",    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  PROCESSING:       { label: "Đang xử lý",     color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" },
  SHIPPED:          { label: "Đã gửi đi",      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  OUT_FOR_DELIVERY: { label: "Đang giao",      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  DELIVERED:        { label: "Đã giao",        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  CANCELLED:        { label: "Đã hủy",         color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  RETURN_REQUESTED: { label: "Yêu cầu đổi/trả", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
  RETURN_APPROVED:  { label: "Đã duyệt đổi/trả", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
  REFUNDED:         { label: "Đã hoàn tiền",  color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function OrderDetail({ buyOrder }: { buyOrder: number }) {
  const [order, setOrder] = useState<OrderPojo | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await getMyOrder(buyOrder);
      setOrder(data);
    } catch {
      toast.error("Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrder(); }, [buyOrder]);

  const handleCancel = async () => {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    setCancelling(true);
    try {
      const updated = await cancelOrder(buyOrder);
      setOrder(updated);
      toast.success("Đơn hàng đã được hủy");
    } catch {
      toast.error("Không thể hủy đơn hàng");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Package className="size-12 text-neutral-200 dark:text-neutral-800" />
        <p className="font-medium text-neutral-500">Không tìm thấy đơn hàng</p>
        <Link href="/account/orders">
          <Button variant="outline" size="sm" className="rounded-none">Quay lại</Button>
        </Link>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[order.status ?? ""] ?? {
    label: order.status ?? "—",
    color: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
  };

  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED";

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="size-4" />
        Quay lại đơn hàng
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Đơn hàng #{order.buyOrder}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Đặt ngày {formatDate(order.date)}
          </p>
        </div>
        <span className={`self-start inline-flex rounded px-3 py-1 text-sm font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Action: cancel */}
      {canCancel && (
        <div className="rounded-none border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
          <p className="text-sm text-red-700 dark:text-red-300">
            Bạn có thể hủy đơn hàng này trước khi nó được xử lý.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={cancelling}
            className="mt-3 rounded-none border-red-300 text-red-600 hover:bg-red-100 dark:border-red-800 dark:text-red-400"
          >
            {cancelling ? "Đang hủy…" : "Hủy đơn hàng"}
          </Button>
        </div>
      )}

      {/* Items */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
          Sản phẩm đã đặt
        </h2>
        <div className="divide-y divide-neutral-100 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {(order.details ?? []).map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 py-4">
              {/* Product image */}
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-none border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
                {item.product?.images?.[0]?.url ? (
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <Package className="size-6 text-neutral-300 dark:text-neutral-700" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-2">
                  {item.product?.name ?? item.description ?? "—"}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {item.units} × {formatMoney(item.unitValue)}
                </p>
              </div>

              {/* Line total */}
              <span className="text-sm font-semibold text-neutral-900 dark:text-white shrink-0">
                {formatMoney(item.units * item.unitValue)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Order summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Shipping address */}
        {order.shippingAddress && (
          <div className="rounded-none border border-neutral-200 p-4 dark:border-neutral-800">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              Địa chỉ giao hàng
            </h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              {[order.shippingAddress.firstLine, order.shippingAddress.municipality, order.shippingAddress.city]
                .filter(Boolean).join(", ")}
            </p>
            {order.shippingAddress.postalCode && (
              <p className="mt-1 text-xs text-neutral-500">{order.shippingAddress.postalCode}</p>
            )}
          </div>
        )}

        {/* Billing address */}
        {order.billingAddress && (
          <div className="rounded-none border border-neutral-200 p-4 dark:border-neutral-800">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              Địa chỉ thanh toán
            </h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              {[order.billingAddress.firstLine, order.billingAddress.municipality, order.billingAddress.city]
                .filter(Boolean).join(", ")}
            </p>
          </div>
        )}
      </div>

      {/* Price breakdown */}
      <div className="rounded-none border border-neutral-200 p-5 dark:border-neutral-800">
        <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">
          Chi tiết thanh toán
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Tạm tính</span>
            <span className="text-neutral-900 dark:text-white">{formatMoney(order.netValue ?? 0)}</span>
          </div>
          {order.discountValue ? (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Giảm giá {order.discountCode ? `(${order.discountCode})` : ""}</span>
              <span>−{formatMoney(order.discountValue)}</span>
            </div>
          ) : null}
          <div className="flex justify-between">
            <span className="text-neutral-500">Phí vận chuyển</span>
            <span className="text-neutral-900 dark:text-white">{formatMoney(order.transportValue ?? 0)}</span>
          </div>
          <div className="flex justify-between border-t border-neutral-100 pt-2 dark:border-neutral-800">
            <span className="font-medium text-neutral-900 dark:text-white">Tổng cộng</span>
            <span className="font-semibold text-neutral-900 dark:text-white">{formatMoney(order.totalValue ?? 0)}</span>
          </div>
          {order.totalRefundedAmount ? (
            <div className="flex justify-between text-red-500 dark:text-red-400">
              <span>Đã hoàn</span>
              <span>−{formatMoney(order.totalRefundedAmount)}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Reorder CTA */}
      <div className="flex justify-center">
        <Link href="/collections/all">
          <Button variant="outline" className="rounded-none">
            Mua lại
          </Button>
        </Link>
      </div>
    </div>
  );
}
