"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  Package,
  ShoppingBag,
  MapPin,
  Truck,
  EnvelopeSimple,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import { getReceipt } from "@/services/rest-api/checkout/checkout";
import { resetCartSessionAfterCheckout } from "@/services/rest-api/cart/cart";
import type { Receipt } from "@/types/checkout";
import { useCart } from "@/components/cart/cart-context";
import { postBehaviorEvent } from "@/services/rest-api/behavior";
import { getOrCreateDeviceId } from "@/lib/device-id";
import { ForYouRail } from "@/components/product/for-you-rail";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đã gửi đi",
  OUT_FOR_DELIVERY: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

function CheckoutSuccessContent() {
  const params = useSearchParams();
  const buyOrder = params.get("buyOrder");
  const token = params.get("token");
  const { refreshCart } = useCart();

  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  useEffect(() => {
    // Drop the browser cart session only; do not release order-linked stock holds.
    resetCartSessionAfterCheckout();
    refreshCart();

    if (!token) {
      setLoading(false);
      return;
    }
    getReceipt(token)
      .then((data) => {
        setReceipt(data);
        const deviceId = getOrCreateDeviceId();
        if (!deviceId) return;
        postBehaviorEvent({
          deviceId,
          eventType: "PURCHASE",
          payload: {
            orderId: buyOrder ?? undefined,
            total: data.totalValue ?? data.total ?? undefined,
          },
        }).catch(() => undefined);
      })
      .catch(() => setError("Không thể tải thông tin đơn hàng."))
      .finally(() => setLoading(false));
  }, [buyOrder, refreshCart, token]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 lg:py-20">
      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/30">
          <CheckCircle
            className="size-10 text-green-600 dark:text-green-400"
            weight="fill"
          />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Đặt hàng thành công!
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Cảm ơn bạn đã đặt hàng tại Mono Studio. Đơn hàng của bạn đang được xử lý.
        </p>
        {receipt?.customerEmail && (
          <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-neutral-500">
            <EnvelopeSimple className="size-4" />
            <span>Xác nhận đã gửi đến <strong>{receipt.customerEmail}</strong></span>
          </div>
        )}
      </div>

      {/* ── Loading ───────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
          <p className="text-sm text-neutral-500">Đang tải thông tin đơn hàng…</p>
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────── */}
      {!loading && error && (
        <div className="rounded-none border border-neutral-200 p-6 text-center dark:border-neutral-800">
          <p className="text-sm text-neutral-500">{error}</p>
          {buyOrder && (
            <p className="mt-2 font-mono text-sm">
              Mã đơn: <strong>#{buyOrder}</strong>
            </p>
          )}
          <Link href="/" className="mt-4 inline-block">
            <Button variant="outline" size="sm">Quay về trang chủ</Button>
          </Link>
        </div>
      )}

      {/* ── Content ───────────────────────────────────────── */}
      {!loading && !error && (
        <>
          {/* Order number badge */}
          {buyOrder && (
            <div className="mb-8 text-center">
              <div className="inline-flex flex-col items-center gap-1.5 rounded-none border border-neutral-200 bg-neutral-50 px-6 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row">
                <div className="flex items-center gap-2">
                  <Package className="size-4 text-neutral-500" />
                  <span className="text-sm text-neutral-500">Mã đơn hàng</span>
                </div>
                <span className="font-mono text-base font-bold text-neutral-900 dark:text-white">
                  #{buyOrder}
                </span>
                {receipt?.status && (
                  <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {STATUS_LABEL[receipt.status] ?? receipt.status}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Receipt card */}
          {receipt && (
            <div className="space-y-4">
              {/* Items — backend uses `details[]` not `items[]` */}
              <div className="rounded-none border border-neutral-200 dark:border-neutral-800">
                <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Sản phẩm đã đặt {receipt.totalItems != null && `(${receipt.totalItems})`}
                  </h2>
                </div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {(receipt.details ?? receipt.items ?? []).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-none border border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.productName} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ShoppingBag className="size-5 text-red-500" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-white">
                            {item.productName}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {item.variantSku && (
                              <span className="font-mono">{item.variantSku} · </span>
                            )}
                            × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-neutral-900 dark:text-white">
                        {formatMoney(item.lineTotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals — backend fields: totalValue, transportValue, discountAmount */}
                <div className="border-t border-neutral-100 px-5 py-4 space-y-2 text-sm dark:border-neutral-800">
                  <div className="flex justify-between text-neutral-500">
                    <span>Tạm tính</span>
                    <span>
                      {/* subtotal ≈ totalValue - tax - transport */}
                      {receipt.totalValue != null
                        ? formatMoney(
                            receipt.totalValue -
                              (receipt.taxValue ?? 0) -
                              (receipt.transportValue ?? 0)
                          )
                        : receipt.subtotal != null
                        ? formatMoney(receipt.subtotal)
                        : "—"}
                    </span>
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
                      {(receipt.transportValue ?? receipt.shippingFee ?? 0) === 0 ? (
                        <span className="text-green-600 dark:text-green-400">Miễn phí</span>
                      ) : (
                        formatMoney(receipt.transportValue ?? receipt.shippingFee ?? 0)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-100 pt-2 font-semibold text-neutral-900 dark:border-neutral-800 dark:text-white">
                    <span>Tổng cộng</span>
                    <span>
                      {receipt.totalValue != null
                        ? formatMoney(receipt.totalValue)
                        : receipt.total != null
                        ? formatMoney(receipt.total)
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping + Payment info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Shipping address */}
                {receipt.shippingAddress ? (
                  <div className="rounded-none border border-neutral-200 px-5 py-4 dark:border-neutral-800">
                    <div className="mb-3 flex items-center gap-2">
                      <MapPin className="size-4 text-neutral-500" />
                      <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Địa chỉ giao hàng
                      </h2>
                    </div>
                    {receipt.customerName && (
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {receipt.customerName}
                      </p>
                    )}
                    {receipt.shippingAddress.recipientName && (
                      <p className="text-sm text-neutral-500">
                        {receipt.shippingAddress.recipientName}
                        {receipt.shippingAddress.phone && ` · ${receipt.shippingAddress.phone}`}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-neutral-500">
                      {[
                        receipt.shippingAddress.line1 ?? receipt.shippingAddress.line1,
                        receipt.shippingAddress.line2,
                        receipt.shippingAddress.district,
                        receipt.shippingAddress.city,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-none border border-neutral-200 px-5 py-4 dark:border-neutral-800">
                    <div className="mb-3 flex items-center gap-2">
                      <MapPin className="size-4 text-neutral-500" />
                      <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Địa chỉ giao hàng
                      </h2>
                    </div>
                    <p className="text-sm text-neutral-500 italic">
                      Xem chi tiết trong email xác nhận đơn hàng.
                    </p>
                  </div>
                )}

                {/* Payment method */}
                {receipt.paymentType && (
                  <div className="rounded-none border border-neutral-200 px-5 py-4 dark:border-neutral-800">
                    <div className="mb-3 flex items-center gap-2">
                      <Truck className="size-4 text-neutral-500" />
                      <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Phương thức thanh toán
                      </h2>
                    </div>
                    <p className="text-sm text-neutral-500">
                      {receipt.paymentType === "WEBPAY"
                        ? "Thanh toán Webpay Plus"
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
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {buyOrder && (
              <Link href={`/account/orders/${buyOrder}`} className="flex-1">
                <Button className="w-full" size="lg">
                  Xem chi tiết đơn hàng
                </Button>
              </Link>
            )}
            <Link href="/collections/all" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                <ShoppingBag className="mr-2 size-5" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>

          {/* Next steps hint */}
          <div className="mt-6 rounded-none border border-blue-100 bg-blue-50 px-5 py-4 dark:border-blue-900/30 dark:bg-blue-950/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Bước tiếp theo:</strong> Bạn sẽ nhận email xác nhận trong giây lát. Khi đơn hàng được giao, chúng tôi sẽ thông báo đến bạn qua SMS hoặc email.
            </p>
          </div>

          <div className="mt-8">
            <ForYouRail variant="checkout_success" />
          </div>
        </>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-2xl px-4 py-12 lg:py-20">
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
          <p className="text-sm text-neutral-500">Đang tải…</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}