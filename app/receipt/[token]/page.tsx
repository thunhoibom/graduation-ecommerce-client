"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  ShoppingBag,
  MapPin,
  Truck,
  Printer,
  ArrowLeft,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import { getReceipt } from "@/services/rest-api/checkout/checkout";
import type { Receipt } from "@/types/checkout";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đã gửi đi",
  OUT_FOR_DELIVERY: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

function ReceiptContent() {
  const params = useParams();
  const token = params.token as string;

  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Không tìm thấy thông tin biên nhận.");
      setLoading(false);
      return;
    }
    getReceipt(token)
      .then(setReceipt)
      .catch(() => setError("Không thể tải thông tin biên nhận."))
      .finally(() => setLoading(false));
  }, [token]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:py-12">
      {/* Print button */}
      {!loading && !error && (
        <div className="mb-6 flex justify-end no-print">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 rounded-none"
          >
            <Printer className="size-4" />
            In biên nhận
          </Button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
          <p className="text-sm text-neutral-500">Đang tải biên nhận…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-none border border-neutral-200 p-8 text-center dark:border-neutral-800">
          <p className="text-sm text-neutral-500">{error}</p>
          <Link href="/" className="mt-4 inline-block">
            <Button variant="outline" size="sm" className="rounded-none">
              <ArrowLeft className="mr-1.5 size-4" />
              Quay về trang chủ
            </Button>
          </Link>
        </div>
      )}

      {/* Receipt content */}
      {!loading && !error && receipt && (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/30">
              <CheckCircle
                className="size-7 text-green-600 dark:text-green-400"
                weight="fill"
              />
            </div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Biên nhận đơn hàng
            </h1>
            <div className="mt-2 flex items-center justify-center gap-3 flex-wrap">
              <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
                #{receipt.buyOrder}
              </span>
              {receipt.status && (
                <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                  {STATUS_LABEL[receipt.status] ?? receipt.status}
                </span>
              )}
            </div>
            {receipt.createdAt && (
              <p className="mt-1 text-xs text-neutral-400">
                Ngày:{" "}
                {new Intl.DateTimeFormat("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(receipt.createdAt))}
              </p>
            )}
          </div>

          {/* Customer */}
          {receipt.customerName && (
            <div className="rounded-none border border-neutral-200 px-5 py-4 dark:border-neutral-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-1">
                Khách hàng
              </p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {receipt.customerName}
              </p>
              {receipt.customerEmail && (
                <p className="text-sm text-neutral-500">{receipt.customerEmail}</p>
              )}
            </div>
          )}

          {/* Items */}
          <div className="rounded-none border border-neutral-200 dark:border-neutral-800">
            <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Chi tiết đơn hàng ({receipt.items.length} sản phẩm)
              </h2>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {receipt.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none border border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                      <ShoppingBag className="size-4 text-neutral-300 dark:text-neutral-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-white">
                        {item.productName}
                      </p>
                      {item.variantSku && (
                        <p className="font-mono text-xs text-neutral-400">{item.variantSku}</p>
                      )}
                      <p className="text-xs text-neutral-500">× {item.quantity}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-neutral-900 dark:text-white">
                    {formatMoney(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-neutral-100 px-5 py-4 space-y-2 text-sm dark:border-neutral-800">
              <div className="flex justify-between text-neutral-500">
                <span>Tạm tính</span>
                <span>{formatMoney(receipt.subtotal ?? 0)}</span>
              </div>
              {receipt.discountAmount != null && receipt.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Giảm giá</span>
                  <span>−{formatMoney(receipt.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-500">
                <span>Vận chuyển</span>
                <span>
                  {(receipt.shippingFee ?? 0) === 0 ? (
                    <span className="text-green-600 dark:text-green-400">Miễn phí</span>
                  ) : (
                    formatMoney(receipt.shippingFee ?? 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-neutral-100 pt-2 font-semibold text-neutral-900 dark:border-neutral-800 dark:text-white">
                <span>Tổng cộng</span>
                <span>{formatMoney(receipt.total ?? 0)}</span>
              </div>
            </div>
          </div>

          {/* Shipping + Payment */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {receipt.shippingAddress && (
              <div className="rounded-none border border-neutral-200 px-5 py-4 dark:border-neutral-800">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="size-4 text-neutral-500" />
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Địa chỉ giao hàng
                  </h2>
                </div>
                {receipt.shippingAddress.recipientName && (
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {receipt.shippingAddress.recipientName}
                  </p>
                )}
                {receipt.shippingAddress.phone && (
                  <p className="text-sm text-neutral-500">{receipt.shippingAddress.phone}</p>
                )}
                <p className="mt-1 text-sm text-neutral-500">
                  {[
                    receipt.shippingAddress.line1,
                    receipt.shippingAddress.line2,
                    receipt.shippingAddress.ward,
                    receipt.shippingAddress.district,
                    receipt.shippingAddress.city,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}

            {receipt.paymentType && (
              <div className="rounded-none border border-neutral-200 px-5 py-4 dark:border-neutral-800">
                <div className="mb-3 flex items-center gap-2">
                  <Truck className="size-4 text-neutral-500" />
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Thanh toán
                  </h2>
                </div>
                <p className="text-sm text-neutral-500">
                  {receipt.paymentType === "WEBPAY"
                    ? "Webpay Plus"
                    : receipt.paymentType === "VNPAY"
                    ? "VNPay"
                    : receipt.paymentType === "COD"
                    ? "Thanh toán khi nhận hàng (COD)"
                    : receipt.paymentType}
                </p>
                {receipt.transactionToken && (
                  <p className="mt-1 font-mono text-xs text-neutral-400">
                    Mã giao dịch: {receipt.transactionToken}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="rounded-none border border-neutral-200 px-5 py-4 dark:border-neutral-800">
            <p className="text-xs text-neutral-400 text-center">
              Cảm ơn bạn đã mua sắm tại Mono Studio. Đây là biên nhận của bạn.
              Nếu có thắc mắc, vui lòng liên hệ <strong>contact@monostudio.vn</strong>.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {receipt.buyOrder && (
              <Link href={`/account/orders/${receipt.buyOrder}`} className="flex-1">
                <Button variant="outline" size="lg" className="w-full rounded-none">
                  <Package className="mr-2 size-5" />
                  Xem đơn hàng
                </Button>
              </Link>
            )}
            <Link href="/collections/all" className="flex-1">
              <Button size="lg" className="w-full rounded-none">
                <ShoppingBag className="mr-2 size-5" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-8 lg:py-12">
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
            <p className="text-sm text-neutral-500">Đang tải…</p>
          </div>
        </div>
      }
    >
      <ReceiptContent />
    </Suspense>
  );
}
