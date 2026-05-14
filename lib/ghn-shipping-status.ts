export type GhnShippingStatus = {
  value: string;
  label: string;
  group: string;
};

export const GHN_SHIPPING_STATUS_GROUPS: { id: string; label: string }[] = [
  { id: "pickup", label: "Lấy hàng" },
  { id: "transit", label: "Luân chuyển / kho" },
  { id: "delivery", label: "Giao hàng" },
  { id: "terminal", label: "Kết thúc / hủy" },
  { id: "return", label: "Hoàn hàng" },
  { id: "exception", label: "Ngoại lệ" },
];

export const GHN_SHIPPING_STATUSES: GhnShippingStatus[] = [
  { value: "ready_to_pick", label: "Mới tạo đơn hàng", group: "pickup" },
  { value: "picking", label: "Nhân viên đang lấy hàng", group: "pickup" },
  { value: "money_collect_picking", label: "Đang thu tiền người gửi", group: "pickup" },
  { value: "picked", label: "Nhân viên đã lấy hàng", group: "pickup" },
  { value: "storing", label: "Hàng đang nằm ở kho", group: "transit" },
  { value: "transporting", label: "Đang luân chuyển hàng", group: "transit" },
  { value: "sorting", label: "Đang phân loại hàng hóa", group: "transit" },
  { value: "delivering", label: "Nhân viên đang giao cho người nhận", group: "delivery" },
  {
    value: "money_collect_delivering",
    label: "Nhân viên đang thu tiền người nhận",
    group: "delivery",
  },
  { value: "delivered", label: "Nhân viên đã giao hàng thành công", group: "terminal" },
  { value: "delivery_fail", label: "Nhân viên giao hàng thất bại", group: "terminal" },
  { value: "cancel", label: "Hủy đơn hàng", group: "terminal" },
  { value: "waiting_to_return", label: "Đang đợi trả hàng về cho người gửi", group: "return" },
  { value: "return", label: "Trả hàng", group: "return" },
  { value: "return_transporting", label: "Đang luân chuyển hàng trả", group: "return" },
  { value: "return_sorting", label: "Đang phân loại hàng trả", group: "return" },
  { value: "returning", label: "Nhân viên đang đi trả hàng", group: "return" },
  { value: "return_fail", label: "Nhân viên trả hàng thất bại", group: "return" },
  { value: "returned", label: "Nhân viên trả hàng thành công", group: "return" },
  { value: "exception", label: "Đơn hàng ngoại lệ không nằm trong quy trình", group: "exception" },
  { value: "damage", label: "Hàng bị hư hỏng", group: "exception" },
  { value: "lost", label: "Hàng bị mất", group: "exception" },
];

export const GHN_QUICK_STATUSES = [
  "transporting",
  "delivering",
  "delivered",
  "delivery_fail",
  "cancel",
  "returned",
] as const;

const GHN_STATUS_LABELS = Object.fromEntries(
  GHN_SHIPPING_STATUSES.map((status) => [status.value, status.label]),
) as Record<string, string>;

export function getGhnStatusLabel(status: string): string {
  return GHN_STATUS_LABELS[status] ?? status;
}

export function inferGhnWorkflowAction(status: string): string {
  const normalized = status.trim().toUpperCase();
  if (!normalized) return "NONE";

  switch (normalized) {
    case "READY_TO_PICK":
    case "PICKING":
    case "MONEY_COLLECT_PICKING":
    case "PICKED":
    case "STORING":
    case "TRANSPORTING":
    case "SORTING":
    case "DELIVERING":
    case "MONEY_COLLECT_DELIVERING":
      return "DELIVERY_ON_ROUTE";
    case "DELIVERED":
    case "DELIVERY_COMPLETE":
    case "COMPLETED":
      return "COMPLETED";
    case "DELIVERY_FAIL":
    case "WAITING_TO_RETURN":
    case "RETURN":
    case "RETURN_TRANSPORTING":
    case "RETURN_SORTING":
    case "RETURNING":
    case "RETURN_FAIL":
      return "NONE";
    case "CANCEL":
      return "DELIVERY_CANCELLED";
    case "RETURNED":
      return "RETURNED";
    case "EXCEPTION":
    case "DAMAGE":
    case "LOST":
      return "DELIVERY_FAILED";
    default:
      if (normalized.includes("UNDELIVERABLE")) return "DELIVERY_FAILED";
      if (normalized.includes("CANCEL") || normalized.includes("RECALL")) {
        return "DELIVERY_CANCELLED";
      }
      if (
        normalized === "IN_TRANSIT" ||
        normalized === "ON_ROUTE" ||
        normalized === "OUT_FOR_DELIVERY"
      ) {
        return "DELIVERY_ON_ROUTE";
      }
      return "NONE";
  }
}

export function suggestGhnStatusForFulfillment(fulfillmentStatus?: string | null): string {
  const normalized = fulfillmentStatus?.trim().toUpperCase() ?? "";
  switch (normalized) {
    case "PENDING":
    case "PROCESSING":
    case "CONFIRMED":
      return "ready_to_pick";
    case "DELIVERY_ON_ROUTE":
    case "DELIVERING":
      return "delivering";
    case "DELIVERY_COMPLETE":
    case "DELIVERED":
      return "delivered";
    case "DELIVERY_FAILED":
      return "delivery_fail";
    case "DELIVERY_CANCELLED":
      return "cancel";
    case "RETURNED":
      return "returned";
    default:
      return "transporting";
  }
}
