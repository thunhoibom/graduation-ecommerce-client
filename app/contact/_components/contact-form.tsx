"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { isAxiosError } from "axios";
import { postContactInquiry } from "@/services/rest-api/contact/contact";

const SUBJECTS = [
  { value: "order", label: "Tư vấn đơn hàng" },
  { value: "product", label: "Hỏi về sản phẩm" },
  { value: "return", label: "Yêu cầu trả hàng" },
  { value: "cooperation", label: "Hợp tác kinh doanh" },
  { value: "feedback", label: "Góp ý / Phản hồi" },
  { value: "other", label: "Khác" },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập họ tên.";
    if (!form.email.trim()) {
      e.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Email không hợp lệ.";
    }
    if (form.phone && !/^[0-9+\s]{8,15}$/.test(form.phone.replace(/\s/g, ""))) {
      e.phone = "Số điện thoại không hợp lệ.";
    }
    if (!form.subject) e.subject = "Vui lòng chọn chủ đề.";
    if (!form.message.trim()) {
      e.message = "Vui lòng nhập nội dung tin nhắn.";
    } else if (form.message.trim().length < 10) {
      e.message = "Tin nhắn quá ngắn (tối thiểu 10 ký tự).";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner(null);
    if (!validate()) return;
    setStatus("submitting");
    try {
      await postContactInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone.trim() || undefined,
        subject: form.subject,
        message: form.message,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      if (isAxiosError(err)) {
        const st = err.response?.status;
        const data = err.response?.data as
          | { message?: string; detailMessage?: string; code?: string }
          | undefined;
        if (st === 429) {
          setErrorBanner(
            data?.message ??
              "Bạn đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau một phút."
          );
        } else if (st === 400 && data?.detailMessage) {
          setErrorBanner(data.detailMessage);
        } else if (data?.message) {
          setErrorBanner(data.message);
        } else {
          setErrorBanner(
            "Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau."
          );
        }
      } else {
        setErrorBanner(
          "Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau."
        );
      }
    }
  };

  const handleChange = (
    field: keyof FormState,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-none border border-green-200 bg-green-50 p-8 text-center dark:border-green-900 dark:bg-green-950">
        <CheckCircle className="mb-3 size-12 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
          Gửi tin nhắn thành công!
        </h3>
        <p className="mt-2 text-sm text-green-700 dark:text-green-300">
          Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ.
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-none"
          onClick={() => {
            setForm({ name: "", email: "", phone: "", subject: "", message: "" });
            setStatus("idle");
            setErrorBanner(null);
          }}
        >
          Gửi tin nhắn khác
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-none border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">
          Họ tên <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Nguyễn Văn A"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          aria-invalid={!!errors.name}
          disabled={status === "submitting"}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          aria-invalid={!!errors.email}
          disabled={status === "submitting"}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phone">Điện thoại</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="0901 234 567"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          aria-invalid={!!errors.phone}
          disabled={status === "submitting"}
        />
        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <Label htmlFor="subject">
          Chủ đề <span className="text-red-500">*</span>
        </Label>
        <Select
          value={form.subject}
          onValueChange={(v) => handleChange("subject", v)}
          disabled={status === "submitting"}
        >
          <SelectTrigger
            id="subject"
            aria-invalid={!!errors.subject}
            className="w-full"
          >
            <SelectValue placeholder="— Chọn chủ đề —" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subject && <p className="text-xs text-red-500">{errors.subject}</p>}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="message">
          Nội dung <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Viết nội dung tin nhắn của bạn..."
          rows={5}
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
          aria-invalid={!!errors.message}
          disabled={status === "submitting"}
        />
        {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
      </div>

      {/* Error banner */}
      {status === "error" && errorBanner && (
        <div className="flex items-center gap-2 rounded-none border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950">
          <XCircle className="size-4 shrink-0 text-red-500" />
          <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">
            {errorBanner}
          </p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        className="w-full rounded-none"
        size="lg"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Đang gửi…" : "Gửi tin nhắn"}
      </Button>
    </form>
  );
}
