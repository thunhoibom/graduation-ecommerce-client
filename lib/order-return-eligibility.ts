import type { OrderPojo } from "@/types/order";

const RETURN_ELIGIBLE_FULFILLMENT = new Set([
  "DELIVERED",
  "COMPLETED",
  "DELIVERY_COMPLETE",
  "CANCELLED",
]);

export function normalizeOrderFulfillmentStatus(order: OrderPojo): string {
  const raw = (order.fulfillmentStatus ?? order.status ?? "").toUpperCase();
  if (raw === "DELIVERY_COMPLETE") return "DELIVERED";
  if (raw === "DELIVERY_ON_ROUTE") return "DELIVERING";
  if (raw === "DELIVERY_CANCELLED") return "CANCELLED";
  return raw;
}

export function getOrderRefundedAmount(order: OrderPojo): number {
  return Math.max(0, order.totalRefundedAmount ?? 0);
}

export function getOrderTotalAmount(order: OrderPojo): number {
  return Math.max(0, order.totalValue ?? order.netValue ?? 0);
}

export function isOrderFullyRefunded(order: OrderPojo): boolean {
  const refunded = getOrderRefundedAmount(order);
  if (refunded <= 0) return false;
  const payment = (order.paymentStatus ?? "").toUpperCase();
  if (payment === "REFUNDED") return true;
  const total = getOrderTotalAmount(order);
  return total > 0 && refunded >= total;
}

export function hasPartialRefund(order: OrderPojo): boolean {
  const refunded = getOrderRefundedAmount(order);
  if (refunded <= 0) return false;
  return !isOrderFullyRefunded(order);
}

export function canCustomerRequestReturn(order: OrderPojo): boolean {
  const fulfillment = normalizeOrderFulfillmentStatus(order);
  if (!RETURN_ELIGIBLE_FULFILLMENT.has(fulfillment)) return false;
  if (isOrderFullyRefunded(order)) return false;
  return true;
}

export function resolveOrderPaymentStatus(order: OrderPojo): string {
  const refunded = getOrderRefundedAmount(order);
  const total = getOrderTotalAmount(order);
  if (refunded > 0) {
    if (total > 0 && refunded >= total) return "REFUNDED";
    return "PARTIALLY_REFUNDED";
  }
  return (order.paymentStatus ?? "").toUpperCase();
}

export function resolveOrderPaymentDisplay(
  order: OrderPojo
): { label: string; color: string } | null {
  const payment = resolveOrderPaymentStatus(order);
  const refunded = getOrderRefundedAmount(order);

  if (payment === "REFUNDED" || isOrderFullyRefunded(order)) {
    return {
      label: "Đã hoàn tiền",
      color: "text-fuchsia-600 dark:text-fuchsia-400",
    };
  }
  if (payment === "PARTIALLY_REFUNDED" || hasPartialRefund(order)) {
    return {
      label: "Hoàn tiền một phần",
      color: "text-fuchsia-600 dark:text-fuchsia-400",
    };
  }
  if (payment === "UNPAID") {
    return { label: "Chưa thanh toán", color: "text-neutral-500" };
  }
  if (payment === "PAYMENT_STARTED") {
    return { label: "Đang thanh toán", color: "text-amber-600 dark:text-amber-400" };
  }
  if (payment === "PAID") {
    return { label: "Đã thanh toán", color: "text-green-600 dark:text-green-400" };
  }
  if (payment === "PAYMENT_FAILED") {
    return { label: "Thanh toán thất bại", color: "text-red-500 dark:text-red-400" };
  }
  if (payment === "PAYMENT_CANCELLED") {
    return { label: "Đã hủy thanh toán", color: "text-red-500 dark:text-red-400" };
  }
  if (payment === "EXPIRED") {
    return { label: "Hết hạn thanh toán", color: "text-red-500 dark:text-red-400" };
  }
  if (!payment && refunded > 0) {
    return {
      label: "Đã hoàn tiền",
      color: "text-fuchsia-600 dark:text-fuchsia-400",
    };
  }
  return payment ? { label: payment, color: "text-neutral-500" } : null;
}
