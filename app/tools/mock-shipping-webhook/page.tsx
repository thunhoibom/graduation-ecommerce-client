"use client";

import { useEffect, useMemo, useState } from "react";
import {
  GHN_QUICK_STATUSES,
  GHN_SHIPPING_STATUS_GROUPS,
  GHN_SHIPPING_STATUSES,
  getGhnStatusLabel,
  inferGhnWorkflowAction,
  suggestGhnStatusForFulfillment,
} from "@/lib/ghn-shipping-status";
import {
  listMockShippingOrders,
  sendMockShippingTrackingWebhook,
  type MockShippingOrderOption,
  type MockShippingTrackingPayload,
  type MockShippingTrackingResponse,
} from "@/services/rest-api/checkout/checkout";

type FormState = {
  order_id: string;
  tracking_number: string;
  status: string;
  location: string;
  description: string;
  event_time: string;
  shipper_code: string;
};

export default function MockShippingWebhookPage() {
  const [form, setForm] = useState<FormState>({
    order_id: "",
    tracking_number: "",
    status: "transporting",
    location: "TP. Hồ Chí Minh",
    description: "Mock event từ màn QA",
    event_time: new Date().toISOString(),
    shipper_code: "GHN",
  });
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderOptions, setOrderOptions] = useState<MockShippingOrderOption[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [result, setResult] = useState<MockShippingTrackingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const suggestedAction = useMemo(() => inferGhnWorkflowAction(form.status), [form.status]);
  const selectedStatusLabel = useMemo(
    () => getGhnStatusLabel(form.status),
    [form.status],
  );

  const onFieldChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onQuickStatus = (status: string) => {
    setForm((prev) => ({ ...prev, status }));
  };

  const loadRecentOrders = async () => {
    setOrdersLoading(true);
    try {
      const rows = await listMockShippingOrders(30);
      setOrderOptions(rows);
    } catch {
      setOrderOptions([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    void loadRecentOrders();
  }, []);

  const onSelectOrder = (rawId: string) => {
    setSelectedOrderId(rawId);
    const id = Number(rawId);
    if (!Number.isFinite(id)) return;
    const selected = orderOptions.find((row) => row.id === id);
    if (!selected) return;

    const status = suggestGhnStatusForFulfillment(selected.fulfillmentStatus);

    setForm((prev) => ({
      ...prev,
      order_id: String(selected.id),
      tracking_number: selected.trackingNumber?.trim() || `MOCK-${selected.id}-${Date.now()}`,
      status,
      description: `Mock từ order #${selected.id} (${selected.fulfillmentStatus ?? "UNKNOWN"})`,
      event_time: new Date().toISOString(),
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(null);
    setError(null);

    const orderId = Number(form.order_id);
    if (!Number.isFinite(orderId) || orderId <= 0) {
      setError("order_id phải là số nguyên dương.");
      return;
    }
    if (!form.tracking_number.trim()) {
      setError("tracking_number là bắt buộc.");
      return;
    }
    if (!form.status.trim()) {
      setError("status là bắt buộc.");
      return;
    }

    const payload: MockShippingTrackingPayload = {
      order_id: orderId,
      tracking_number: form.tracking_number.trim(),
      status: form.status.trim(),
      event_time: form.event_time.trim() || new Date().toISOString(),
      shipper_code: form.shipper_code.trim() || "GHN",
      location: form.location.trim() || undefined,
      description: form.description.trim() || undefined,
    };

    setLoading(true);
    try {
      const data = await sendMockShippingTrackingWebhook(payload);
      setResult(data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: string | { message?: string } } })?.response?.data;
      if (typeof message === "string") {
        setError(message);
      } else if (typeof message === "object" && message?.message) {
        setError(message.message);
      } else {
        setError("Gọi mock webhook thất bại. Kiểm tra order_id và trạng thái đơn hiện tại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Mock GHN Webhook
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Màn test nội bộ để giả lập event tracking GHN và đẩy vào pipeline webhook backend.
        </p>

        <div className="mt-4 rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
          Route này không nằm trong menu và chỉ dùng cho QA nội bộ. Trường status dùng mã chuẩn GHN
          (ví dụ: transporting, delivered, delivery_fail).
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-neutral-700 dark:text-neutral-300">Danh sách đơn gần đây (auto fill)</span>
            <select
              value={selectedOrderId}
              onChange={(e) => onSelectOrder(e.target.value)}
              className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              disabled={ordersLoading}
            >
              <option value="">
                {ordersLoading ? "Đang tải danh sách đơn..." : "Chọn đơn để tự điền form"}
              </option>
              {orderOptions.map((order) => (
                <option key={order.id} value={order.id}>
                  #{order.id} - {order.fulfillmentStatus ?? "UNKNOWN"} - {order.paymentStatus ?? "UNKNOWN"}
                  {order.trackingNumber ? ` - ${order.trackingNumber}` : ""}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => void loadRecentOrders()}
            className="self-end border border-neutral-300 px-3 py-2 text-sm hover:border-neutral-600 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-400"
          >
            Tải lại list
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-neutral-700 dark:text-neutral-300">order_id *</span>
              <input
                value={form.order_id}
                onChange={(e) => onFieldChange("order_id", e.target.value)}
                placeholder="Ví dụ: 1012"
                className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-neutral-700 dark:text-neutral-300">tracking_number *</span>
              <input
                value={form.tracking_number}
                onChange={(e) => onFieldChange("tracking_number", e.target.value)}
                placeholder="GHN123456789"
                className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-neutral-700 dark:text-neutral-300">status GHN *</span>
              <select
                value={form.status}
                onChange={(e) => onFieldChange("status", e.target.value)}
                className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              >
                {GHN_SHIPPING_STATUS_GROUPS.map((group) => (
                  <optgroup key={group.id} label={group.label}>
                    {GHN_SHIPPING_STATUSES.filter((status) => status.group === group.id).map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.value} - {status.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              {GHN_QUICK_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onQuickStatus(status)}
                  className="border border-neutral-300 px-2.5 py-1 text-xs hover:border-neutral-600 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-400"
                >
                  {status}
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Mô tả GHN: <span className="font-semibold">{selectedStatusLabel}</span>
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Workflow action dự kiến: <span className="font-semibold">{suggestedAction}</span>
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-neutral-700 dark:text-neutral-300">shipper_code</span>
              <input
                value={form.shipper_code}
                onChange={(e) => onFieldChange("shipper_code", e.target.value)}
                placeholder="GHN"
                className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-neutral-700 dark:text-neutral-300">event_time (ISO-8601)</span>
              <input
                value={form.event_time}
                onChange={(e) => onFieldChange("event_time", e.target.value)}
                placeholder="2026-05-13T11:08:00.000Z"
                className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-neutral-700 dark:text-neutral-300">location</span>
              <input
                value={form.location}
                onChange={(e) => onFieldChange("location", e.target.value)}
                placeholder="Kho GHN Q.7"
                className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-neutral-700 dark:text-neutral-300">description</span>
              <input
                value={form.description}
                onChange={(e) => onFieldChange("description", e.target.value)}
                placeholder="Đơn đã xuất kho"
                className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-white dark:bg-white dark:text-black"
          >
            {loading ? "Đang gửi..." : "Gửi mock webhook"}
          </button>
        </form>

        {error && (
          <div className="mt-4 border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
            <p className="font-semibold">{result.message}</p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>trackingId: {result.trackingId}</li>
              <li>orderId: {result.orderId}</li>
              <li>trackingNumber: {result.trackingNumber}</li>
              <li>rawStatus: {result.rawStatus}</li>
              <li>mappedAction: {result.mappedAction}</li>
              <li>eventTime: {result.eventTime}</li>
            </ul>
          </div>
        )}

        <div className="mt-6 border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          <p className="font-semibold">Checklist QA đề xuất</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>transporting / delivering - Đơn chuyển sang trạng thái đang giao.</li>
            <li>delivered - Đơn chuyển hoàn tất theo workflow backend.</li>
            <li>delivery_fail - Chỉ ghi timeline; đơn vẫn đang giao, có thể giao lại hoặc chuyển vòng return.</li>
            <li>cancel - Đơn chuyển thu hồi giao hàng.</li>
            <li>returned - Đơn chuyển hoàn hàng.</li>
            <li>
              waiting_to_return / return / returning - Chỉ ghi timeline, không đổi fulfillment đơn.
            </li>
            <li>
              Duplicate event - gửi lại cùng order_id + tracking_number + status + event_time để xác nhận idempotent.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
