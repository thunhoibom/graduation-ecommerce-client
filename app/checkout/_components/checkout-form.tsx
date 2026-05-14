"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  Truck,
  Lock,
  Check,
  Tag,
  ShoppingBag,
  ArrowLeft,
  EnvelopeSimple,
  CreditCard,
  HandCoins,
} from "@phosphor-icons/react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/utils";
import { LocationPicker } from "@/components/ui/location-picker";
import type { AddressBookPojo } from "@/types/person";
import type { ShippingMethod } from "@/types/common";
import type { CheckoutStartPayload } from "@/types/checkout";
import { getAddressBook } from "@/services/rest-api/address-book";
import {
  getGhnDistricts,
  getGhnProvinces,
  getGhnWards,
  getShippingMethods,
  initiateCheckoutOtp,
  resendCheckoutOtp,
  verifyCheckoutOtp,
  type GhnDistrict,
  type GhnProvince,
  type GhnWard,
} from "@/services/rest-api/checkout/checkout";
import { calculateCartPricing } from "@/services/rest-api/cart/cart";
import type { CartPricingResult } from "@/types/cart";
import { getOrCreateDeviceId } from "@/lib/device-id";
import { postBehaviorEvent } from "@/services/rest-api/behavior";

function parseCheckoutApiError(err: unknown): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as
      | string
      | { message?: string; detailMessage?: string }
      | undefined;
    if (typeof data === "string" && data.trim()) return data.trim();
    if (data && typeof data === "object") {
      if (typeof data.detailMessage === "string" && data.detailMessage.trim()) {
        return data.detailMessage.trim();
      }
      if (typeof data.message === "string" && data.message.trim()) {
        return data.message.trim();
      }
    }
  }
  if (err instanceof Error && err.message) return err.message;
  return "Đã có lỗi xảy ra. Vui lòng thử lại.";
}

// ─── Step type ─────────────────────────────────────────────────────────────────

type Step = "shipping" | "shipping_method" | "payment" | "review" | "verify_otp";

// ─── Form data shapes ──────────────────────────────────────────────────────────

interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AddressFormData {
  firstLine: string;
  municipality: string;
  city: string;
  postalCode: string;
  notes: string;
  provinceId?: number;
  latitude?: number;
  longitude?: number;
  districtId?: number;
  wardCode?: string;
}

function emptyCustomer(): CustomerFormData {
  return { firstName: "", lastName: "", email: "", phone: "" };
}

function emptyAddress(): AddressFormData {
  return {
    firstLine: "",
    municipality: "",
    city: "",
    postalCode: "",
    notes: "",
    provinceId: undefined,
    latitude: undefined,
    longitude: undefined,
    districtId: undefined,
    wardCode: "",
  };
}

// ─── Step indicator ─────────────────────────────────────────────────────────────

function StepIndicator({
  current,
  onStepClick,
}: {
  current: Step;
  onStepClick: (step: Step) => void;
}) {
  const steps: { key: Step; label: string }[] = [
    { key: "shipping", label: "Thông tin" },
    { key: "shipping_method", label: "Vận chuyển" },
    { key: "payment", label: "Thanh toán" },
    { key: "review", label: "Xác nhận" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center gap-2 text-sm">
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const active = step.key === current;
        const clickable = done;

        return (
          <div key={step.key} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={`h-px w-6 sm:w-10 transition-colors ${
                  done
                    ? "bg-neutral-900 dark:bg-white"
                    : "bg-neutral-200 dark:bg-neutral-700"
                }`}
              />
            )}
            <button
              type="button"
              onClick={() => clickable && onStepClick(step.key)}
              disabled={!clickable}
              className={`flex items-center gap-1.5 transition-colors ${
                clickable
                  ? "cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300"
                  : "cursor-default"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs transition-colors ${
                  done
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                    : active
                    ? "border border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                    : "border border-neutral-300 text-neutral-400 dark:border-neutral-600 dark:text-neutral-500"
                }`}
              >
                {done ? <Check className="size-3" weight="bold" /> : i + 1}
              </span>
              <span
                className={`hidden sm:block ${
                  active
                    ? "font-semibold text-neutral-900 dark:text-white"
                    : done
                    ? "text-neutral-500"
                    : "text-neutral-400"
                }`}
              >
                {step.label}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Shipping method card ──────────────────────────────────────────────────────

function ShippingCard({
  method,
  selected,
  onSelect,
}: {
  method: ShippingMethod;
  selected: boolean;
  onSelect: () => void;
}) {
  const fee = (method as any).fee ?? method.baseFee ?? 0;
  const feeLabel =
    fee === 0 ? (
      <span className="text-green-600 dark:text-green-400">Miễn phí</span>
    ) : (
      formatMoney(fee)
    );

  const eta =
    method.estimatedDaysMin === method.estimatedDaysMax
      ? `${method.estimatedDaysMin} ngày`
      : `${method.estimatedDaysMin}–${method.estimatedDaysMax} ngày`;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "flex w-full items-center justify-between rounded-none border p-4 text-left transition-all",
        selected
          ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 dark:border-white dark:bg-neutral-900 dark:ring-white"
          : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div
          className={[
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
            selected
              ? "border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white"
              : "border-neutral-300 dark:border-neutral-600",
          ].join(" ")}
        >
          {selected && (
            <div className="h-1.5 w-1.5 rounded-full bg-white dark:bg-black" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            {method.name}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Nhận hàng trong {eta}
          </p>
        </div>
      </div>
      <span className="text-sm font-semibold text-neutral-900 dark:text-white">
        {feeLabel}
      </span>
    </button>
  );
}

// ─── Payment type selector ──────────────────────────────────────────────────────

type PaymentType = "PAYOS" | "COD";

function PaymentOption({
  type,
  selected,
  onSelect,
}: {
  type: PaymentType;
  selected: boolean;
  onSelect: () => void;
}) {
  const isPayos = type === "PAYOS";
  const title = isPayos
    ? "Thanh toán qua PayOS"
    : "Thanh toán khi nhận hàng (COD)";
  const description = isPayos
    ? "Thanh toán chuyển khoản/QR qua PayOS với trang thanh toán bảo mật"
    : "Trả tiền mặt khi nhận được hàng";
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "flex w-full items-center gap-3 rounded-none border p-4 text-left transition-all",
        selected
          ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 dark:border-white dark:bg-neutral-900 dark:ring-white"
          : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          selected
            ? "border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white"
            : "border-neutral-300 dark:border-neutral-600",
        ].join(" ")}
      >
        {selected && (
          <div className="h-1.5 w-1.5 rounded-full bg-white dark:bg-black" />
        )}
      </div>
      {isPayos ? (
        <CreditCard className="size-5 text-neutral-500" />
      ) : (
        <HandCoins className="size-5 text-neutral-500" />
      )}
      <div>
        <p className="text-sm font-medium text-neutral-900 dark:text-white">
          {title}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      </div>
    </button>
  );
}

// ─── Order summary sidebar ──────────────────────────────────────────────────────

function OrderSummarySidebar({
  items,
  subtotal,
  totalDiscount,
  shippingFee,
  total,
}: {
  items: { variantSku: string; productName: string; variantSize?: string; variantColor?: string; quantity: number; lineTotal: number }[];
  subtotal: number;
  totalDiscount: number;
  shippingFee: number;
  total: number;
}) {
  return (
    <div className="sticky top-4 space-y-4">
      {/* Items */}
      <div className="rounded-none border border-neutral-200 p-5 dark:border-neutral-800">
        <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">
          Đơn hàng ({items.length} sản phẩm)
        </h2>
        <div className="mb-4 max-h-52 space-y-3 overflow-y-auto">
          {items.map((item) => (
            <div key={item.variantSku} className="flex items-start justify-between gap-3 text-sm">
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-medium text-neutral-900 dark:text-white">
                  {item.productName}
                </p>
                <p className="text-xs text-neutral-500">
                  {[item.variantSize, item.variantColor].filter(Boolean).join(" · ")} ×{" "}
                  {item.quantity}
                </p>
              </div>
              <span className="shrink-0 font-medium text-neutral-900 dark:text-white">
                {formatMoney(item.lineTotal)}
              </span>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Tạm tính</span>
            <span className="text-neutral-900 dark:text-white">{formatMoney(subtotal)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Giảm giá</span>
              <span>−{formatMoney(totalDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-neutral-500">Vận chuyển</span>
            <span className="text-neutral-900 dark:text-white">
              {shippingFee === 0 ? (
                <span className="text-green-600 dark:text-green-400">Miễn phí</span>
              ) : (
                formatMoney(shippingFee)
              )}
            </span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold text-neutral-900 dark:text-white">
            <span>Tổng cộng</span>
            <span>{formatMoney(total)}</span>
          </div>
          <p className="text-xs text-neutral-400">(Đã bao gồm VAT 19%)</p>
        </div>
      </div>

      {/* Trust */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
        <Lock className="size-3.5" />
        <span>Thanh toán an toàn &amp; bảo mật</span>
      </div>
    </div>
  );
}

// ─── Main CheckoutForm ──────────────────────────────────────────────────────────

export function CheckoutForm() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();

  const [step, setStep] = useState<Step>("shipping");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer info (Step 1)
  const [customerForm, setCustomerForm] = useState<CustomerFormData>(emptyCustomer());

  // Address state
  const [savedAddresses, setSavedAddresses] = useState<AddressBookPojo[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressFormData>(emptyAddress());
  const [ghnProvinces, setGhnProvinces] = useState<GhnProvince[]>([]);
  const [ghnDistricts, setGhnDistricts] = useState<GhnDistrict[]>([]);
  const [ghnWards, setGhnWards] = useState<GhnWard[]>([]);
  const [ghnLoading, setGhnLoading] = useState(false);

  // Shipping method (Step 2)
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<number | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);

  // Payment (Step 3)
  const [paymentType, setPaymentType] = useState<PaymentType>("PAYOS");
  const [discountCode, setDiscountCode] = useState("");
  const [pricingPreview, setPricingPreview] = useState<CartPricingResult | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [billingType, setBillingType] = useState<"individual" | "enterprise">("individual");

  // OTP (after POST /checkout/initiate)
  const [pendingOtpOrderId, setPendingOtpOrderId] = useState<number | null>(null);
  const [otpMaskedEmail, setOtpMaskedEmail] = useState<string | null>(null);
  const [otpExpiresAt, setOtpExpiresAt] = useState<string | null>(null);
  const [otpResendIn, setOtpResendIn] = useState(0);
  const [otpCode, setOtpCode] = useState("");
  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const cartDiscount = cart?.discountAmount ?? 0;
  const totalDiscount = pricingPreview?.discountAmount ?? cartDiscount;
  const selectedMethod = shippingMethods.find((m) => m.id === selectedShipping);
  const shippingFee = (selectedMethod as any)?.fee ?? selectedMethod?.baseFee ?? 0;
  const total = Math.max(subtotal + shippingFee - totalDiscount, 0);

  useEffect(() => {
    if (otpResendIn <= 0) return;
    const t = window.setTimeout(() => setOtpResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [otpResendIn]);

  // ── Load saved addresses on mount ──────────────────────────────────────────
  useEffect(() => {
    getAddressBook()
      .then(setSavedAddresses)
      .catch(() => {/* non-authenticated guest — silently skip */});
  }, []);

  useEffect(() => {
    setGhnLoading(true);
    getGhnProvinces()
      .then(setGhnProvinces)
      .catch(() => toast.error("Không tải được danh sách tỉnh/thành GHN"))
      .finally(() => setGhnLoading(false));
  }, []);

  // ── Fill address form from saved address ───────────────────────────────────
  const selectedSavedAddress = savedAddresses.find((a) => a.id === selectedAddressId);

  // ── Load shipping methods when entering step 2 ─────────────────────────────
  const lastFetchKey = useRef<string>("");

  useEffect(() => {
    if (step !== "shipping_method") return;

    const isUsingMap = useNewAddress || savedAddresses.length === 0;
    const lat = isUsingMap ? addressForm.latitude : selectedSavedAddress?.address?.latitude;
    const lng = isUsingMap ? addressForm.longitude : selectedSavedAddress?.address?.longitude;
    const districtId = isUsingMap ? addressForm.districtId : selectedSavedAddress?.address?.districtId;
    const wardCode = isUsingMap ? addressForm.wardCode : selectedSavedAddress?.address?.wardCode;
    const fetchKey = `${subtotal}-${lat}-${lng}-${districtId}-${wardCode}`;

    if (shippingMethods.length > 0 && lastFetchKey.current === fetchKey) return; // already loaded with same inputs

    setShippingLoading(true);
    getShippingMethods(subtotal, lat, lng, districtId, wardCode)
      .then((methods) => {
        lastFetchKey.current = fetchKey;
        setShippingMethods(methods);
        // Auto-select if only one
        if (methods.length === 1 && methods[0]?.id != null) {
          setSelectedShipping(methods[0].id);
        }
      })
      .catch(() => toast.error("Không thể tải phương thức vận chuyển"))
      .finally(() => setShippingLoading(false));
  }, [step, subtotal, addressForm.latitude, addressForm.longitude, addressForm.districtId, addressForm.wardCode, selectedSavedAddress, useNewAddress, shippingMethods.length]);

  useEffect(() => {
    if (selectedSavedAddress && !useNewAddress) {
      const addr = selectedSavedAddress.address;
      setAddressForm({
        firstLine: addr?.firstLine ?? "",
        municipality: addr?.municipality ?? "",
        city: addr?.city ?? "",
        postalCode: addr?.postalCode ?? "",
        notes: addr?.notes ?? "",
        provinceId: undefined,
        latitude: addr?.latitude,
        longitude: addr?.longitude,
        districtId: addr?.districtId,
        wardCode: addr?.wardCode ?? "",
      });
    }
  }, [selectedAddressId, useNewAddress, selectedSavedAddress]);

  useEffect(() => {
    if (!useNewAddress && savedAddresses.length > 0) {
      return;
    }
    if (!addressForm.provinceId) {
      setGhnDistricts([]);
      setGhnWards([]);
      if (addressForm.districtId !== undefined || (addressForm.wardCode ?? "") !== "") {
        setAddressForm((a) => ({ ...a, districtId: undefined, wardCode: "" }));
      }
      return;
    }
    getGhnDistricts(addressForm.provinceId)
      .then(setGhnDistricts)
      .catch(() => toast.error("Không tải được quận/huyện GHN"));
  }, [addressForm.provinceId, useNewAddress, savedAddresses.length, addressForm.districtId, addressForm.wardCode]);

  useEffect(() => {
    if (!useNewAddress && savedAddresses.length > 0) {
      return;
    }
    if (!addressForm.districtId) {
      setGhnWards([]);
      if ((addressForm.wardCode ?? "") !== "") {
        setAddressForm((a) => ({ ...a, wardCode: "" }));
      }
      return;
    }
    getGhnWards(addressForm.districtId)
      .then(setGhnWards)
      .catch(() => toast.error("Không tải được phường/xã GHN"));
  }, [addressForm.districtId, useNewAddress, savedAddresses.length, addressForm.wardCode]);

  // ── Validation helpers ───────────────────────────────────────────────────
  const selectedProvince = addressForm.provinceId
    ? ghnProvinces.find((p) => p.provinceId === addressForm.provinceId)
    : undefined;
  const selectedDistrict = addressForm.districtId
    ? ghnDistricts.find((d) => d.districtId === addressForm.districtId)
    : undefined;

  const hasValidCustomer =
    customerForm.firstName.trim().length > 0 &&
    customerForm.lastName.trim().length > 0 &&
    customerForm.email.includes("@") &&
    customerForm.phone.trim().length >= 9;

  const hasValidAddress =
    addressForm.firstLine.trim().length > 0 &&
    addressForm.municipality.trim().length > 0 &&
    addressForm.city.trim().length > 0;

  // ── Step navigation ───────────────────────────────────────────────────────
  const goTo = (next: Step) => setStep(next);

  const handleShippingSubmit = () => {
    if (!hasValidCustomer) {
      toast.error("Vui lòng điền đầy đủ họ tên, email và SĐT");
      return;
    }
    if (!hasValidAddress) {
      toast.error("Vui lòng điền đầy đủ địa chỉ giao hàng");
      return;
    }
    if (!addressForm.districtId || !addressForm.wardCode) {
      toast.error("Vui lòng chọn Quận/Huyện và Phường/Xã từ danh mục GHN");
      return;
    }
    goTo("shipping_method");
  };

  const handleShippingMethodSubmit = () => {
    if (!selectedShipping) {
      toast.error("Vui lòng chọn phương thức vận chuyển");
      return;
    }
    goTo("payment");
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountLoading(true);
    try {
      const result = await calculateCartPricing(discountCode.trim());
      setPricingPreview(result);
      await refreshCart();
      toast.success(`Áp dụng mã "${discountCode.trim()}" thành công`);
      setDiscountCode("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể áp dụng mã giảm giá";
      toast.error(msg);
    } finally {
      setDiscountLoading(false);
    }
  };

  const handlePaymentSubmit = () => goTo("review");

  const buildCheckoutPayload = (): CheckoutStartPayload => ({
    shippingMethodId: selectedShipping!,
    discountCode: pricingPreview?.appliedDiscountCode ?? cart?.appliedDiscountCode,
    customer: {
      firstName: customerForm.firstName.trim(),
      lastName: customerForm.lastName.trim(),
      email: customerForm.email.trim(),
      phone: customerForm.phone.trim(),
    },
    shippingAddress: {
      firstLine: addressForm.firstLine.trim(),
      municipality: (selectedDistrict?.districtName ?? addressForm.municipality).trim(),
      city: (selectedProvince?.provinceName ?? addressForm.city).trim(),
      postalCode: addressForm.postalCode.trim() || undefined,
      notes: addressForm.notes.trim() || undefined,
      latitude: addressForm.latitude,
      longitude: addressForm.longitude,
      districtId: addressForm.districtId,
      wardCode: addressForm.wardCode?.trim() || undefined,
    },
    paymentType,
    billingType,
  });

  const handlePlaceOrder = async () => {
    if (!selectedShipping) return;

    if (pendingOtpOrderId != null) {
      setStep("verify_otp");
      return;
    }

    setIsSubmitting(true);

    try {
      const deviceId = getOrCreateDeviceId();
      if (deviceId) {
        postBehaviorEvent({
          deviceId,
          eventType: "BEGIN_CHECKOUT",
          payload: {
            total,
            quantity: items.reduce((sum, item) => sum + item.quantity, 0),
            placement: "checkout",
          },
        }).catch(() => undefined);
      }

      const otpResp = await initiateCheckoutOtp(buildCheckoutPayload());
      setPendingOtpOrderId(otpResp.orderId);
      setOtpMaskedEmail(otpResp.maskedEmail);
      setOtpExpiresAt(otpResp.expiresAt);
      setOtpResendIn(Math.max(0, otpResp.resendAfterSeconds));
      setOtpCode("");
      setStep("verify_otp");
      toast.success("Đã gửi mã xác thực tới email của bạn.");
    } catch (err: unknown) {
      toast.error(parseCheckoutApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (pendingOtpOrderId == null) return;
    const code = otpCode.trim().replace(/\s/g, "");
    if (!code) {
      toast.error("Vui lòng nhập mã OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await verifyCheckoutOtp(pendingOtpOrderId, code);
      const buyOrder = result.buyOrder ?? pendingOtpOrderId;

      setPendingOtpOrderId(null);
      setOtpMaskedEmail(null);
      setOtpExpiresAt(null);
      setOtpResendIn(0);
      setOtpCode("");

      if (paymentType === "COD" || !result.url) {
        router.push(
          `/checkout/success?buyOrder=${buyOrder}&token=${encodeURIComponent(result.token ?? "")}`
        );
        return;
      }

      window.location.href = result.url;
    } catch (err: unknown) {
      toast.error(parseCheckoutApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (pendingOtpOrderId == null || otpResendIn > 0) return;
    const checkoutEmail = customerForm.email.trim();
    if (!checkoutEmail) {
      toast.error("Vui lòng nhập email để gửi lại OTP");
      return;
    }
    try {
      const r = await resendCheckoutOtp(pendingOtpOrderId, checkoutEmail);
      setOtpResendIn(Math.max(0, r.resendAfterSeconds));
      setOtpExpiresAt(r.expiresAt);
      toast.success("Đã gửi lại mã OTP");
    } catch (err: unknown) {
      toast.error(parseCheckoutApiError(err));
    }
  };

  // ── Empty cart guard ───────────────────────────────────────────────────────
  if (!items.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <ShoppingBag className="size-12 text-neutral-300 dark:text-neutral-700" />
        <p className="text-neutral-500">Giỏ hàng trống.</p>
        <Link href="/collections/all">
          <Button variant="outline">Khám phá bộ sưu tập</Button>
        </Link>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* ── LEFT: Form steps ─────────────────────────────────────────────── */}
      <div className="lg:col-span-2 space-y-6">

        {/* Step indicator */}
        {step !== "verify_otp" && (
          <StepIndicator current={step} onStepClick={goTo} />
        )}

        {/* ── Step 1: Shipping information ─────────────────────────────── */}
        {step === "shipping" && (
          <div className="space-y-6">
            {/* Customer info */}
            <div className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800 space-y-4">
              <div className="flex items-center gap-2 font-semibold">
                <EnvelopeSimple className="size-5 text-neutral-500" />
                <h2>Thông tin liên hệ</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">Họ *</Label>
                  <Input
                    id="firstName"
                    placeholder="Nguyễn"
                    value={customerForm.firstName}
                    onChange={(e) =>
                      setCustomerForm((c) => ({ ...c, firstName: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Tên *</Label>
                  <Input
                    id="lastName"
                    placeholder="Văn A"
                    value={customerForm.lastName}
                    onChange={(e) =>
                      setCustomerForm((c) => ({ ...c, lastName: e.target.value }))
                    }
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={customerForm.email}
                    onChange={(e) =>
                      setCustomerForm((c) => ({ ...c, email: e.target.value }))
                    }
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0901234567"
                    value={customerForm.phone}
                    onChange={(e) =>
                      setCustomerForm((c) => ({ ...c, phone: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Saved addresses */}
            {savedAddresses.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  Địa chỉ đã lưu
                </p>
                {savedAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => {
                      setSelectedAddressId(addr.id!);
                      setUseNewAddress(false);
                    }}
                    className={[
                      "w-full rounded-none border p-4 text-left transition-all",
                      selectedAddressId === addr.id && !useNewAddress
                        ? "border-neutral-900 ring-1 ring-neutral-900 dark:border-white dark:ring-white"
                        : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {addr.label ?? "Địa chỉ"}
                          {addr.defaultShipping && (
                            <span className="ml-2 text-[10px] font-normal text-neutral-500">
                              Mặc định
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-sm text-neutral-500">
                          {[addr.address?.firstLine, addr.address?.municipality, addr.address?.city]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                      {selectedAddressId === addr.id && !useNewAddress && (
                        <Check className="size-4 shrink-0 text-neutral-900 dark:text-white" />
                      )}
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setUseNewAddress(true);
                    setSelectedAddressId(null);
                    setAddressForm(emptyAddress());
                  }}
                  className={[
                    "w-full rounded-none border p-3 text-center text-sm transition-all",
                    useNewAddress
                      ? "border-neutral-900 text-neutral-900 dark:border-white dark:text-white"
                      : "border-dashed border-neutral-300 text-neutral-500 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500",
                  ].join(" ")}
                >
                  + Thêm địa chỉ mới
                </button>
              </div>
            )}

            {/* New address form */}
            {(useNewAddress || savedAddresses.length === 0) && (
              <div className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800 space-y-4">
                <div className="flex items-center gap-2 font-semibold">
                  <Truck className="size-5 text-neutral-500" />
                  <h2>Địa chỉ giao hàng</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 space-y-1.5 z-0">
                    <Label>Ghim vị trí trên Bản đồ *</Label>
                    <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden">
                       <LocationPicker 
                         position={addressForm.latitude && addressForm.longitude ? { lat: addressForm.latitude, lng: addressForm.longitude } : null}
                         onChange={(lat: number, lng: number, data: any) => {
                             setAddressForm(prev => {
                                 // Build street
                                 let newFirstLine = "";
                                 const roadName = data?.road || data?.pedestrian || data?.path || data?.residential || data?.neighbourhood;
                                 if (roadName) {
                                     newFirstLine = data.house_number ? `${data.house_number} ${roadName}` : roadName;
                                 }
                                 
                                 // Build municipality (quận/huyện/xã/thị trấn)
                                 const newMunicipality = data?.suburb || data?.city_district || data?.county || data?.town || data?.village || data?.hamlet || data?.state_district || "";
                                 
                                 // Build city/province (tỉnh/thành phố)
                                 const newCity = data?.city || data?.province || data?.state || data?.region || (data as any)?.yes || "";

                                 return {
                                     ...prev,
                                     latitude: lat,
                                     longitude: lng,
                                     firstLine: newFirstLine,
                                     municipality: newMunicipality,
                                     city: newCity,
                                 };
                             });
                         }}
                       />
                    </div>
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="firstLine">Địa chỉ (Số nhà, đường) *</Label>
                    <Input
                      id="firstLine"
                      placeholder="Số nhà, tên đường"
                      value={addressForm.firstLine}
                      onChange={(e) =>
                        setAddressForm((a) => ({ ...a, firstLine: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="postalCode">Mã bưu điện</Label>
                    <Input
                      id="postalCode"
                      placeholder="700000"
                      value={addressForm.postalCode}
                      onChange={(e) =>
                        setAddressForm((a) => ({ ...a, postalCode: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="notes">Ghi chú</Label>
                    <Input
                      id="notes"
                      placeholder="Ghi chú giao hàng (tuỳ chọn)"
                      value={addressForm.notes}
                      onChange={(e) =>
                        setAddressForm((a) => ({ ...a, notes: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="provinceId">Tỉnh / Thành phố *</Label>
                    <Select
                      value={addressForm.provinceId ? String(addressForm.provinceId) : undefined}
                      onValueChange={(value) => {
                        const provinceId = Number(value);
                        const provinceName =
                          ghnProvinces.find((p) => p.provinceId === provinceId)?.provinceName ?? "";
                        setAddressForm((a) => ({
                          ...a,
                          provinceId,
                          city: provinceName || a.city,
                        }));
                      }}
                      disabled={ghnLoading}
                    >
                      <SelectTrigger id="provinceId" className="h-10 w-full rounded-none px-3 text-sm">
                        <SelectValue placeholder="Chọn tỉnh/thành" />
                      </SelectTrigger>
                      <SelectContent>
                        {ghnProvinces.map((p) => (
                          <SelectItem key={p.provinceId} value={String(p.provinceId)}>
                            {p.provinceName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="districtId">Quận / Huyện *</Label>
                    <Select
                      value={addressForm.districtId ? String(addressForm.districtId) : undefined}
                      onValueChange={(value) => {
                        const districtId = Number(value);
                        const districtName =
                          ghnDistricts.find((d) => d.districtId === districtId)?.districtName ?? "";
                        setAddressForm((a) => ({
                          ...a,
                          districtId,
                          municipality: districtName || a.municipality,
                        }));
                      }}
                      disabled={!addressForm.provinceId}
                    >
                      <SelectTrigger id="districtId" className="h-10 w-full rounded-none px-3 text-sm">
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        {ghnDistricts.map((d) => (
                          <SelectItem key={d.districtId} value={String(d.districtId)}>
                            {d.districtName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="wardCode">Phường/Xã (GHN) *</Label>
                    <Select
                      value={addressForm.wardCode || undefined}
                      onValueChange={(value) =>
                        setAddressForm((a) => ({ ...a, wardCode: value }))
                      }
                      disabled={!addressForm.districtId}
                    >
                      <SelectTrigger id="wardCode" className="h-10 w-full rounded-none px-3 text-sm">
                        <SelectValue placeholder="Chọn phường/xã" />
                      </SelectTrigger>
                      <SelectContent>
                        {ghnWards.map((w) => (
                          <SelectItem key={w.wardCode} value={w.wardCode}>
                            {w.wardName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleShippingSubmit}
              className="w-full"
              size="lg"
            >
              Tiếp tục
            </Button>
          </div>
        )}

        {/* ── Step 2: Shipping method ──────────────────────────────────── */}
        {step === "shipping_method" && (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => goTo("shipping")}
              className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              ← Quay lại thông tin giao hàng
            </button>

            {/* Address summary */}
            <div className="rounded-none border border-neutral-200 p-4 dark:border-neutral-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-1">
                Giao đến
              </p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {customerForm.firstName} {customerForm.lastName}
              </p>
              <p className="text-sm text-neutral-500">{customerForm.phone}</p>
              <p className="text-sm text-neutral-500">
                {[addressForm.firstLine, addressForm.municipality, addressForm.city]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            {/* Shipping methods */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Phương thức vận chuyển
              </p>
              {shippingLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
                </div>
              ) : shippingMethods.length === 0 ? (
                <p className="text-sm text-neutral-500 py-4">
                  Không có phương thức vận chuyển nào.
                </p>
              ) : (
                shippingMethods.map((method) => (
                  <ShippingCard
                    key={method.id}
                    method={method}
                    selected={selectedShipping === method.id}
                    onSelect={() => setSelectedShipping(method.id!)}
                  />
                ))
              )}
            </div>

            <Button
              onClick={handleShippingMethodSubmit}
              disabled={!selectedShipping}
              className="w-full"
              size="lg"
            >
              Tiếp tục
            </Button>
          </div>
        )}

        {/* ── Step 3: Payment method + discount ──────────────────────── */}
        {step === "payment" && (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => goTo("shipping_method")}
              className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              ← Quay lại phương thức vận chuyển
            </button>

            {/* Payment type */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Phương thức thanh toán
              </p>
              <div className="space-y-2">
                <PaymentOption
                  type="PAYOS"
                  selected={paymentType === "PAYOS"}
                  onSelect={() => setPaymentType("PAYOS")}
                />
                <PaymentOption
                  type="COD"
                  selected={paymentType === "COD"}
                  onSelect={() => setPaymentType("COD")}
                />
              </div>
            </div>

            {/* Discount code */}
            <div className="rounded-none border border-neutral-200 p-5 dark:border-neutral-800 space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="size-4 text-neutral-500" />
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Mã giảm giá
                </p>
              </div>
              {(pricingPreview?.appliedDiscountCode || cart?.appliedDiscountCode) && (
                <div className="flex items-center justify-between rounded-none border border-green-200 bg-green-50 px-3 py-2 dark:border-green-900 dark:bg-green-950/20">
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    {pricingPreview?.appliedDiscountCode ?? cart?.appliedDiscountCode}
                  </span>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    −{formatMoney(totalDiscount)}
                  </span>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã…"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value);
                    if (pricingPreview) setPricingPreview(null);
                  }}
                  className="flex-1 rounded-none"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApplyDiscount}
                  disabled={!discountCode.trim() || discountLoading}
                  className="rounded-none"
                >
                  {discountLoading ? "…" : "Áp dụng"}
                </Button>
              </div>
            </div>

            <Button
              onClick={handlePaymentSubmit}
              className="w-full"
              size="lg"
            >
              Tiếp tục
            </Button>
          </div>
        )}

        {/* ── Step 4: Review & confirm ────────────────────────────────── */}
        {step === "review" && (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => goTo("payment")}
              className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              ← Quay lại thanh toán
            </button>

            {/* Review: Contact */}
            <div className="rounded-none border border-neutral-200 p-5 dark:border-neutral-800 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  Thông tin liên hệ
                </p>
                <button
                  type="button"
                  onClick={() => goTo("shipping")}
                  className="text-xs underline text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  Sửa
                </button>
              </div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {customerForm.firstName} {customerForm.lastName}
              </p>
              <p className="text-sm text-neutral-500">{customerForm.email}</p>
              <p className="text-sm text-neutral-500">{customerForm.phone}</p>
            </div>

            {/* Review: Address */}
            <div className="rounded-none border border-neutral-200 p-5 dark:border-neutral-800 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  Địa chỉ giao hàng
                </p>
                <button
                  type="button"
                  onClick={() => goTo("shipping")}
                  className="text-xs underline text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  Sửa
                </button>
              </div>
              <p className="text-sm text-neutral-900 dark:text-white">
                {[addressForm.firstLine, addressForm.municipality, addressForm.city]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {addressForm.postalCode && (
                <p className="text-sm text-neutral-500">Mã bưu điện: {addressForm.postalCode}</p>
              )}
            </div>

            {/* Review: Shipping */}
            <div className="rounded-none border border-neutral-200 p-5 dark:border-neutral-800 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  Vận chuyển
                </p>
                <button
                  type="button"
                  onClick={() => goTo("shipping_method")}
                  className="text-xs underline text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  Sửa
                </button>
              </div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {selectedMethod?.name ?? "—"}
              </p>
              <p className="text-sm text-neutral-500">
                {shippingFee === 0 ? (
                  <span className="text-green-600 dark:text-green-400">Miễn phí</span>
                ) : (
                  formatMoney(shippingFee)
                )}
              </p>
            </div>

            {/* Review: Payment */}
            <div className="rounded-none border border-neutral-200 p-5 dark:border-neutral-800 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  Thanh toán
                </p>
                <button
                  type="button"
                  onClick={() => goTo("payment")}
                  className="text-xs underline text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  Sửa
                </button>
              </div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {paymentType === "PAYOS"
                  ? "Thanh toán trực tuyến (PayOS)"
                  : "Thanh toán khi nhận hàng (COD)"}
              </p>
              {(pricingPreview?.appliedDiscountCode || cart?.appliedDiscountCode) && totalDiscount > 0 && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Mã {pricingPreview?.appliedDiscountCode ?? cart?.appliedDiscountCode}: −{formatMoney(totalDiscount)}
                </p>
              )}
            </div>

            {/* Place order CTA */}
            <Button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Đang xử lý…
                </span>
              ) : pendingOtpOrderId != null ? (
                <span className="flex items-center gap-2">
                  <Lock className="size-4" />
                  Tiếp tục xác thực email
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="size-4" />
                  Đặt hàng · {formatMoney(total)}
                </span>
              )}
            </Button>

            <p className="text-center text-xs text-neutral-400">
              {pendingOtpOrderId != null
                ? "Bạn có một đơn chờ xác thực OTP qua email. Nhấn nút bên trên để mở bước nhập mã."
                : 'Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý với '}
              {pendingOtpOrderId == null && (
                <>
                  <Link href="/about" className="underline hover:text-neutral-600">
                    điều khoản sử dụng
                  </Link>{" "}
                  của Mono Studio.
                </>
              )}
            </p>
          </div>
        )}

        {step === "verify_otp" && (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setStep("review")}
              className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              ← Quay lại xác nhận đơn
            </button>

            <div className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800 space-y-4">
              <div className="flex items-center gap-2 font-semibold">
                <EnvelopeSimple className="size-5 text-neutral-500" />
                <h2>Xác thực email</h2>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Mã OTP đã gửi tới{" "}
                <span className="font-medium text-neutral-900 dark:text-white">
                  {otpMaskedEmail ?? "email của bạn"}
                </span>
                . Nhập mã để tiếp tục thanh toán hoặc hoàn tất đơn COD.
              </p>
              {otpExpiresAt && (
                <p className="text-xs text-neutral-500">
                  Mã có hiệu lực đến:{" "}
                  {new Date(otpExpiresAt).toLocaleString("vi-VN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="checkout-otp">Mã OTP</Label>
                <Input
                  id="checkout-otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={12}
                  placeholder="Nhập mã từ email"
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/[^\d\s]/g, ""))
                  }
                  className="rounded-none font-mono text-lg tracking-widest"
                />
              </div>
              <Button
                onClick={handleVerifyOtp}
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Đang xác thực…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="size-4" />
                    Xác thực &amp; thanh toán
                  </span>
                )}
              </Button>
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={otpResendIn > 0}
                  className="text-sm text-neutral-600 underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400"
                >
                  {otpResendIn > 0
                    ? `Gửi lại mã sau ${otpResendIn}s`
                    : "Gửi lại mã OTP"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT: Order summary ─────────────────────────────────────────── */}
      <OrderSummarySidebar
        items={items}
        subtotal={subtotal}
        totalDiscount={totalDiscount}
        shippingFee={shippingFee}
        total={total}
      />
    </div>
  );
}
