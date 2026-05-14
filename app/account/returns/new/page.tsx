"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Package, Check } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/utils";
import { getMyOrders } from "@/services/rest-api/orders/orders";
import { createReturnRequest } from "@/services/rest-api/returns/returns";
import type { OrderPojo, OrderDetailPojo } from "@/types/order";

const REASON_OPTIONS = [
  { value: "WRONG_SIZE", label: "Sai kích thước" },
  { value: "DEFECTIVE", label: "Sản phẩm lỗi" },
  { value: "CHANGED_MIND", label: "Đổi ý" },
  { value: "NOT_AS_DESCRIBED", label: "Không đúng mô tả" },
  { value: "OTHER", label: "Lý do khác" },
];

const REFUND_METHOD = "BANK_TRANSFER" as const;

function normalizeFulfillmentStatus(order: OrderPojo): string {
  const raw = (order.fulfillmentStatus ?? order.status ?? "").toUpperCase();
  if (raw === "DELIVERY_COMPLETE") return "DELIVERED";
  if (raw === "DELIVERY_ON_ROUTE") return "DELIVERING";
  if (raw === "DELIVERY_CANCELLED") return "CANCELLED";
  return raw;
}

function canReturnOrder(order: OrderPojo): boolean {
  const status = normalizeFulfillmentStatus(order);
  return status === "DELIVERED" || status === "COMPLETED" || status === "CANCELLED";
}

export default function NewReturnPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<OrderPojo[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [refundBankName, setRefundBankName] = useState("");
  const [refundBankAccountNumber, setRefundBankAccountNumber] = useState("");
  const [refundBankAccountHolder, setRefundBankAccountHolder] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"order" | "items" | "reason" | "done">("order");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/account/returns/new");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    getMyOrders({ pageIndex: 0, pageSize: 100 })
      .then((data) => {
        const eligible = (data.items ?? []).filter((o) => canReturnOrder(o));
        setOrders(eligible);
      })
      .catch(() => toast.error("Không thể tải danh sách đơn hàng"))
      .finally(() => setLoadingOrders(false));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!orders.length) return;
    const prefillOrderId = searchParams.get("orderId");
    if (!prefillOrderId) return;
    const matched = orders.find((o) => String(o.buyOrder) === prefillOrderId);
    if (!matched) return;
    setSelectedOrderId(prefillOrderId);
    setSelectedItems(new Set());
    setStep("items");
  }, [orders, searchParams]);

  const selectedOrder = orders.find((o) => String(o.buyOrder) === selectedOrderId);

  const toggleItem = (idx: number) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!selectedOrder || selectedItems.size === 0 || !reason) return;
    if (reason === "OTHER" && !notes.trim()) {
      toast.error("Vui lòng nhập lý do đổi/trả");
      return;
    }
    if (!refundBankName.trim() || !refundBankAccountNumber.trim() || !refundBankAccountHolder.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin tài khoản ngân hàng để hoàn tiền");
      return;
    }

    setSubmitting(true);
    try {
      const items = Array.from(selectedItems).map((idx) => {
        const detail = selectedOrder.details![idx]!;
        return {
          productId: detail.product?.id,
          variantId: detail.variantId,
          quantity: detail.units,
          reason: reason === "OTHER" ? notes : reason,
        };
      });

      await createReturnRequest({
        orderId: selectedOrder.buyOrder!,
        reason,
        status: "PENDING",
        refundMethod: REFUND_METHOD,
        refundBankName: refundBankName.trim(),
        refundBankAccountNumber: refundBankAccountNumber.trim(),
        refundBankAccountHolder: refundBankAccountHolder.trim(),
        items,
      });

      setStep("done");
      toast.success("Yêu cầu đổi/trả đã được gửi thành công");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể gửi yêu cầu đổi/trả";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 lg:px-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 lg:px-6">
        <div className="flex flex-col items-center gap-5 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <Check className="size-8 text-green-600 dark:text-green-400" weight="bold" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Yêu cầu đổi/trả đã được gửi
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Chúng tôi sẽ xử lý yêu cầu và phản hồi qua email trong 1–2 ngày làm việc.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/account/orders">
              <Button variant="outline" className="rounded-none">Xem đơn hàng</Button>
            </Link>
            <Link href="/collections/all">
              <Button className="rounded-none">Tiếp tục mua sắm</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-6">
      {/* Back */}
      <Link
        href="/account/orders"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="size-4" />
        Quay lại
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
        Yêu cầu đổi / trả
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Yêu cầu đổi hoặc trả sản phẩm trong vòng 30 ngày kể từ ngày nhận hàng.
      </p>

      {/* Step indicator */}
      <div className="mt-8 flex items-center gap-2">
        {(["order", "items", "reason"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                step === s
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                  : i < ["order", "items", "reason"].indexOf(step)
                  ? "bg-green-500 text-white"
                  : "border border-neutral-300 text-neutral-400 dark:border-neutral-700 dark:text-neutral-500"
              )}
            >
              {i + 1}
            </div>
            {i < 2 && <div className="h-px w-8 bg-neutral-200 dark:bg-neutral-800" />}
          </div>
        ))}
      </div>

      {/* ── Step 1: Select order ─────────────────────────────── */}
      {step === "order" && (
        <div className="mt-8 space-y-6">
          <h2 className="text-base font-semibold">1. Chọn đơn hàng</h2>

          {loadingOrders ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Package className="size-10 text-neutral-200 dark:text-neutral-800" />
              <p className="text-sm text-neutral-500">
                Không có đơn hàng nào có thể đổi/trả.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                (() => {
                  const normalized = normalizeFulfillmentStatus(order);
                  const isDeliveredLike = normalized === "DELIVERED" || normalized === "COMPLETED";
                  return (
                <label
                  key={order.buyOrder}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-none border p-4 transition-colors",
                    selectedOrderId === String(order.buyOrder)
                      ? "border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-900"
                      : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
                  )}
                >
                  <input
                    type="radio"
                    name="order"
                    value={order.buyOrder}
                    checked={selectedOrderId === String(order.buyOrder)}
                    onChange={() => {
                      setSelectedOrderId(String(order.buyOrder));
                      setSelectedItems(new Set());
                      setStep("items");
                    }}
                    className="accent-neutral-900"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
                      #{order.buyOrder}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {order.details?.length ?? 0} sản phẩm ·{" "}
                      {formatMoney(order.totalValue ?? 0)}
                    </p>
                  </div>
                  <span className={cn(
                    "rounded px-2 py-0.5 text-[11px] font-medium",
                    isDeliveredLike
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    {isDeliveredLike ? "Đã giao" : "Đã hủy"}
                  </span>
                </label>
                  );
                })()
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Step 2: Select items ─────────────────────────────── */}
      {step === "items" && selectedOrder && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">2. Chọn sản phẩm muốn đổi/trả</h2>
            <button
              onClick={() => setStep("order")}
              className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              ← Đổi đơn hàng
            </button>
          </div>

          <div className="space-y-3">
            {(selectedOrder.details ?? []).map((item, idx) => (
              <label
                key={idx}
                className={cn(
                  "flex cursor-pointer items-center gap-4 rounded-none border p-4 transition-colors",
                  selectedItems.has(idx)
                    ? "border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-900"
                    : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-800"
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.has(idx)}
                  onChange={() => toggleItem(idx)}
                  className="accent-neutral-900 size-4"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-2">
                    {item.product?.name ?? item.description ?? "—"}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {item.units} × {formatMoney(item.unitValue)}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <Button
            onClick={() => setStep("reason")}
            disabled={selectedItems.size === 0}
            className="w-full rounded-none py-4"
            size="lg"
          >
            Tiếp tục ({selectedItems.size} sản phẩm)
          </Button>
        </div>
      )}

      {/* ── Step 3: Reason & refund ──────────────────────────── */}
      {step === "reason" && selectedOrder && (
        <div className="mt-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">3. Lý do &amp; Hoàn tiền</h2>
            <button
              onClick={() => setStep("items")}
              className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              ← Đổi sản phẩm
            </button>
          </div>

          {/* Reason */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Lý do đổi/trả *</Label>
            <div className="grid grid-cols-1 gap-2">
              {REASON_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-none border p-3 transition-colors",
                    reason === opt.value
                      ? "border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-900"
                      : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-800"
                  )}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={opt.value}
                    checked={reason === opt.value}
                    onChange={(e) => setReason(e.target.value)}
                    className="accent-neutral-900"
                  />
                  <span className="text-sm text-neutral-900 dark:text-white">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          {reason === "OTHER" && (
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-semibold">
                Mô tả lý do *
              </Label>
              <Textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mô tả chi tiết lý do đổi/trả…"
                className="rounded-none resize-none"
              />
            </div>
          )}

          <div className="space-y-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Hoàn tiền được xử lý bằng chuyển khoản ngân hàng. Vui lòng nhập tài khoản nhận hoàn.
            </p>
              <div className="space-y-2">
                <Label htmlFor="refund-bank-name">Tên ngân hàng *</Label>
                <Input
                  id="refund-bank-name"
                  value={refundBankName}
                  onChange={(e) => setRefundBankName(e.target.value)}
                  placeholder="VD: Vietcombank"
                  className="rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refund-bank-account-number">Số tài khoản *</Label>
                <Input
                  id="refund-bank-account-number"
                  value={refundBankAccountNumber}
                  onChange={(e) => setRefundBankAccountNumber(e.target.value)}
                  placeholder="Nhập số tài khoản nhận hoàn"
                  className="rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refund-bank-account-holder">Tên chủ tài khoản *</Label>
                <Input
                  id="refund-bank-account-holder"
                  value={refundBankAccountHolder}
                  onChange={(e) => setRefundBankAccountHolder(e.target.value)}
                  placeholder="VD: NGUYEN VAN A"
                  className="rounded-none"
                />
              </div>
            </div>

          <Button
            onClick={handleSubmit}
            disabled={!reason || submitting}
            className="w-full rounded-none py-4"
            size="lg"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Đang gửi…
              </span>
            ) : (
              "Gửi yêu cầu đổi/trả"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
