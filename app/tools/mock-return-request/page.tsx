"use client";

import { useEffect, useState } from "react";
import {
  listMockReturnRequests,
  simulateMockReturnAction,
  type MockReturnActionPayload,
  type MockReturnActionResponse,
  type MockReturnRequestOption,
} from "@/services/rest-api/returns/returns";

const ACTION_OPTIONS: Array<{
  id: MockReturnActionPayload["action"];
  label: string;
  needsTracking?: boolean;
  needsRefundAmount?: boolean;
}> = [
  { id: "APPROVE", label: "APPROVE (Duyệt)", needsRefundAmount: true },
  { id: "SET_TRACKING", label: "SET_TRACKING (Gán mã vận đơn)", needsTracking: true },
  { id: "RECEIVE", label: "RECEIVE (Đã nhận hàng trả)" },
  { id: "START_REFUND", label: "START_REFUND (Bắt đầu hoàn tiền)" },
  { id: "COMPLETE_REFUND", label: "COMPLETE_REFUND (Hoàn tiền xong)" },
  { id: "CANCEL", label: "CANCEL (Hủy yêu cầu)" },
  { id: "REJECT", label: "REJECT (Từ chối yêu cầu)" },
];

type FormState = {
  returnRequestId: string;
  action: MockReturnActionPayload["action"];
  trackingNumber: string;
  refundAmount: string;
  adminNotes: string;
};

export default function MockReturnRequestPage() {
  const [form, setForm] = useState<FormState>({
    returnRequestId: "",
    action: "SET_TRACKING",
    trackingNumber: "GHN-RETURN-MOCK-001",
    refundAmount: "",
    adminNotes: "",
  });
  const [requests, setRequests] = useState<MockReturnRequestOption[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<MockReturnActionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedAction = ACTION_OPTIONS.find((a) => a.id === form.action);

  const loadRequests = async () => {
    setLoadingList(true);
    try {
      const rows = await listMockReturnRequests(30);
      setRequests(rows);
    } catch {
      setRequests([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    void loadRequests();
  }, []);

  const onFieldChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSelectRequest = (rawId: string) => {
    onFieldChange("returnRequestId", rawId);
    const id = Number(rawId);
    if (!Number.isFinite(id)) return;
    const selected = requests.find((r) => r.id === id);
    if (!selected) return;
    setForm((prev) => ({
      ...prev,
      trackingNumber: selected.trackingNumber?.trim() || `GHN-RETURN-${selected.id}-${Date.now()}`,
      refundAmount: selected.refundAmount != null ? String(selected.refundAmount) : prev.refundAmount,
      adminNotes: `Mock action cho return #${selected.id} (${selected.status ?? "UNKNOWN"})`,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const id = Number(form.returnRequestId);
    if (!Number.isFinite(id) || id <= 0) {
      setError("returnRequestId không hợp lệ.");
      return;
    }

    const payload: MockReturnActionPayload = { action: form.action };
    if (selectedAction?.needsTracking) {
      if (!form.trackingNumber.trim()) {
        setError("trackingNumber là bắt buộc cho action này.");
        return;
      }
      payload.trackingNumber = form.trackingNumber.trim();
    }
    if (selectedAction?.needsRefundAmount && form.refundAmount.trim()) {
      const parsed = Number(form.refundAmount);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        setError("refundAmount phải là số dương.");
        return;
      }
      payload.refundAmount = Math.floor(parsed);
    }
    if (form.adminNotes.trim()) {
      payload.adminNotes = form.adminNotes.trim();
    }

    setSubmitting(true);
    try {
      const data = await simulateMockReturnAction(id, payload);
      setResult(data);
      void loadRequests();
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: unknown } })?.response?.data;
      if (typeof responseData === "string") {
        setError(responseData);
      } else if (
        responseData &&
        typeof responseData === "object" &&
        "message" in responseData &&
        typeof (responseData as { message?: unknown }).message === "string"
      ) {
        setError((responseData as { message: string }).message);
      } else {
        setError("Mock action thất bại. Kiểm tra trạng thái hiện tại của return request.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Mock Return Request Flow
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Màn test nội bộ cho luồng hoàn hàng: gán tracking và chuyển trạng thái return request.
        </p>

        <div className="mt-4 rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
          Route này không nằm trong menu và chỉ dùng cho QA nội bộ.
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-neutral-700 dark:text-neutral-300">Danh sách return request gần đây</span>
            <select
              value={form.returnRequestId}
              onChange={(e) => onSelectRequest(e.target.value)}
              disabled={loadingList}
              className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            >
              <option value="">
                {loadingList ? "Đang tải danh sách..." : "Chọn return request để auto fill"}
              </option>
              {requests.map((request) => (
                <option key={request.id} value={request.id}>
                  #{request.id} - ORDER #{request.orderId ?? "?"} - {request.status ?? "UNKNOWN"}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => void loadRequests()}
            className="self-end border border-neutral-300 px-3 py-2 text-sm hover:border-neutral-600 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-400"
          >
            Tải lại list
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-neutral-700 dark:text-neutral-300">returnRequestId *</span>
              <input
                value={form.returnRequestId}
                onChange={(e) => onFieldChange("returnRequestId", e.target.value)}
                placeholder="Ví dụ: 1"
                className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-neutral-700 dark:text-neutral-300">action *</span>
              <select
                value={form.action}
                onChange={(e) => onFieldChange("action", e.target.value as FormState["action"])}
                className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              >
                {ACTION_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-neutral-700 dark:text-neutral-300">
                trackingNumber{selectedAction?.needsTracking ? " *" : ""}
              </span>
              <input
                value={form.trackingNumber}
                onChange={(e) => onFieldChange("trackingNumber", e.target.value)}
                placeholder="GHN-RETURN-123"
                className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-neutral-700 dark:text-neutral-300">
                refundAmount (cho action APPROVE)
              </span>
              <input
                value={form.refundAmount}
                onChange={(e) => onFieldChange("refundAmount", e.target.value)}
                placeholder="50000"
                className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-neutral-700 dark:text-neutral-300">adminNotes</span>
            <textarea
              value={form.adminNotes}
              onChange={(e) => onFieldChange("adminNotes", e.target.value)}
              rows={3}
              placeholder="Ghi chú mock..."
              className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-white dark:bg-white dark:text-black"
          >
            {submitting ? "Đang gửi..." : "Gửi mock action"}
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
              <li>returnRequestId: {result.returnRequestId}</li>
              <li>orderId: {result.orderId ?? "—"}</li>
              <li>status: {result.status ?? "—"}</li>
              <li>trackingNumber: {result.trackingNumber ?? "—"}</li>
              <li>refundAmount: {result.refundAmount ?? "—"}</li>
              <li>refundMethod: {result.refundMethod ?? "—"}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
