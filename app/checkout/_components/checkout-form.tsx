"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Tag, Truck, Lock } from "@phosphor-icons/react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getShippingMethods, validateDiscountCode } from "@/services/rest-api/checkout/checkout";
import type { ShippingMethod, DiscountValidationResult } from "@/types/common";
import type { AddressPojo } from "@/types/person";
import { formatMoney } from "@/lib/utils";

type Step = "shipping" | "payment";

export function CheckoutForm() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const [step, setStep] = useState<Step>("shipping");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shipping
  const [address, setAddress] = useState<AddressPojo>({
    firstLine: "",
    municipality: "",
    city: "",
    postalCode: "",
    secondLine: "",
    notes: "",
  });
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<number | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);

  // Discount
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState<DiscountValidationResult | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);

  // Payment
  const [paymentType, setPaymentType] = useState("WEBPAY");

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const discountAmount = discount?.valid ? (discount.discountAmount ?? 0) : (cart?.discountAmount ?? 0);
  const shippingFee = selectedShipping
    ? (shippingMethods.find((m) => m.id === selectedShipping)?.baseFee ?? 0)
    : 0;
  const total = subtotal + shippingFee - discountAmount;

  const loadShippingMethods = async (city: string) => {
    setShippingLoading(true);
    try {
      const methods = await getShippingMethods();
      setShippingMethods(methods);
      if (methods.length === 1) setSelectedShipping(methods[0]!.id!);
    } catch {
      toast.error("Không thể tải phương thức vận chuyển");
    } finally {
      setShippingLoading(false);
    }
  };

  const applyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountLoading(true);
    try {
      const result = await validateDiscountCode(discountCode.trim());
      setDiscount(result);
      if (!result.valid) {
        toast.error(result.message ?? "Mã không hợp lệ");
      } else {
        toast.success(`Áp dụng mã ${discountCode} thành công`);
      }
    } catch {
      toast.error("Không thể xác thực mã giảm giá");
    } finally {
      setDiscountLoading(false);
    }
  };

  const handleShippingSubmit = async () => {
    if (!address.firstLine.trim() || !address.city.trim() || !address.municipality.trim()) {
      toast.error("Vui lòng điền đầy đủ địa chỉ giao hàng");
      return;
    }
    await loadShippingMethods(address.city);
    setStep("payment");
  };

  const handlePaymentSubmit = async () => {
    if (!selectedShipping) {
      toast.error("Vui lòng chọn phương thức vận chuyển");
      return;
    }
    setIsSubmitting(true);
    try {
      const { initiateCheckout } = await import("@/services/rest-api/checkout/checkout");
      const result = await initiateCheckout({
        cartSessionToken: cart?.token,
        shippingMethodId: selectedShipping,
        discountCode: discount?.valid ? discount.code : undefined,
      });
      if (result.url) {
        window.location.href = result.url;
      } else {
        router.push(`/checkout/success?buyOrder=${result.buyOrder}&token=${result.token}`);
      }
    } catch (err: unknown) {
      const msg = (err as Error)?.message ?? "Thanh toán thất bại";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-500">Giỏ hàng trống.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Left: Form */}
      <div className="lg:col-span-2 space-y-8">

        {/* Step indicator */}
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={() => setStep("shipping")}
            className={`flex items-center gap-2 ${step === "shipping" ? "font-semibold" : "text-neutral-500"}`}
          >
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${step === "shipping" ? "bg-black text-white dark:bg-white dark:text-black" : "border border-neutral-300 dark:border-neutral-700"}`}>
              {step === "payment" ? <Check className="size-3" /> : "1"}
            </span>
            Giao hàng
          </button>
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
          <span className={`flex items-center gap-2 ${step === "payment" ? "font-semibold" : "text-neutral-500"}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${step === "payment" ? "bg-black text-white dark:bg-white dark:text-black" : "border border-neutral-300 dark:border-neutral-700"}`}>2</span>
            Thanh toán
          </span>
        </div>

        {/* Shipping step */}
        {step === "shipping" && (
          <div className="space-y-6 rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
            <div className="flex items-center gap-2 font-semibold">
              <Truck className="size-5" />
              <h2>Địa chỉ giao hàng</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="firstLine">Địa chỉ *</Label>
                <Input
                  id="firstLine"
                  placeholder="Số nhà, đường"
                  value={address.firstLine}
                  onChange={(e) => setAddress((a) => ({ ...a, firstLine: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="municipality">Quận / Huyện *</Label>
                <Input
                  id="municipality"
                  placeholder="Quận 1"
                  value={address.municipality}
                  onChange={(e) => setAddress((a) => ({ ...a, municipality: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">Tỉnh / Thành phố *</Label>
                <Input
                  id="city"
                  placeholder="TP. Hồ Chí Minh"
                  value={address.city}
                  onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="postalCode">Mã bưu điện</Label>
                <Input
                  id="postalCode"
                  placeholder="700000"
                  value={address.postalCode}
                  onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="notes">Ghi chú</Label>
                <Input
                  id="notes"
                  placeholder="Ghi chú giao hàng (tuỳ chọn)"
                  value={address.notes}
                  onChange={(e) => setAddress((a) => ({ ...a, notes: e.target.value }))}
                />
              </div>
            </div>

            <Button onClick={handleShippingSubmit} className="w-full">
              Tiếp tục thanh toán
            </Button>
          </div>
        )}

        {/* Payment step */}
        {step === "payment" && (
          <div className="space-y-6">
            {/* Shipping method */}
            <div className="space-y-4 rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
              <div className="flex items-center gap-2 font-semibold">
                <Truck className="size-5" />
                <h2>Phương thức vận chuyển</h2>
              </div>
              {shippingLoading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
              ) : (
                <div className="space-y-2">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center justify-between rounded border p-4 transition-colors ${
                        selectedShipping === method.id
                          ? "border-black bg-black/5 dark:border-white dark:bg-white/5"
                          : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={selectedShipping === method.id}
                          onChange={() => setSelectedShipping(method.id!)}
                          className="accent-black dark:accent-white"
                        />
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-neutral-500">
                            {method.estimatedDaysMin}–{method.estimatedDaysMax} ngày
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold">
                        {method.baseFee === 0
                          ? "Miễn phí"
                          : formatMoney(method.baseFee)}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className="space-y-4 rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
              <div className="flex items-center gap-2 font-semibold">
                <Lock className="size-5" />
                <h2>Phương thức thanh toán</h2>
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded border border-black bg-black/5 p-4 dark:border-white">
                <input
                  type="radio"
                  name="payment"
                  value="WEBPAY"
                  checked={paymentType === "WEBPAY"}
                  onChange={() => setPaymentType("WEBPAY")}
                  className="accent-black dark:accent-white"
                />
                <span className="font-medium">Thanh toán qua cổng Webpay</span>
              </label>
            </div>

            <Button onClick={handlePaymentSubmit} className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : `Thanh toán ${formatMoney(total)}`}
            </Button>
          </div>
        )}
      </div>

      {/* Right: Summary */}
      <div>
        <div className="sticky top-4 rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="mb-4 font-semibold">Đơn hàng của bạn</h2>

          {/* Items */}
          <div className="mb-4 space-y-3 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.variantSku} className="flex justify-between text-sm">
                <span className="line-clamp-1 flex-1 pr-2">
                  {item.productName}
                  {item.variantSize ? ` (${item.variantSize})` : ""}
                  <span className="text-neutral-500"> ×{item.quantity}</span>
                </span>
                <span className="shrink-0 font-medium">{formatMoney(item.lineTotal)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-neutral-100 pt-4 text-sm dark:border-neutral-800">
            <div className="flex justify-between">
              <span className="text-neutral-500">Tạm tính</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Giảm giá</span>
                <span>−{formatMoney(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-500">Vận chuyển</span>
              <span>
                {selectedShipping
                  ? (shippingFee === 0 ? "Miễn phí" : formatMoney(shippingFee))
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between border-t border-neutral-100 pt-2 font-semibold dark:border-neutral-800">
              <span>Tổng cộng</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>

          {/* Discount code */}
          <div className="mt-4 space-y-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <Label htmlFor="discount" className="text-sm font-medium">Mã giảm giá</Label>
            <div className="flex gap-2">
              <Input
                id="discount"
                placeholder="Nhập mã..."
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={applyDiscount}
                disabled={discountLoading || !discountCode.trim()}
              >
                {discountLoading ? "..." : "Áp dụng"}
              </Button>
            </div>
            {discount?.valid && (
              <p className="text-xs text-green-600 dark:text-green-400">
                ✓ {discount.message ?? "Áp dụng thành công"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
