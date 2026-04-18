"use client";

import Link from "next/link";
import { Minus, Plus, Trash, ArrowLeft, ShoppingBag, Tag } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import type { CartItem } from "@/types/cart";

interface CartItemRowProps {
  item: CartItem;
}

function CartItemRow({ item }: CartItemRowProps) {
  const { updateItem, removeItem } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  const sizeColor = [item.variantSize, item.variantColor]
    .filter(Boolean)
    .join(" · ");

  const handleRemove = async () => {
    setIsRemoving(true);
    await removeItem(item.variantSku);
    setIsRemoving(false);
  };

  const isLowStock =
    item.availableStock != null &&
    item.availableStock > 0 &&
    item.availableStock <= 5;

  const isOutOfStock = item.availableStock === 0 || item.inStock === false;

  return (
    <div
      className={`flex gap-4 border-b border-neutral-100 py-5 last:border-0 dark:border-neutral-800 transition-opacity ${
        isRemoving ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      {/* Product image */}
      <Link
        href={`/product/${item.productBarcode}`}
        className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-none border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <ShoppingBag className="size-7 text-neutral-300 dark:text-neutral-700" />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-black/60">
            <span className="bg-white/90 px-2 py-0.5 text-[10px] font-medium text-black">
              Hết hàng
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-0.5">
          <Link
            href={`/product/${item.productBarcode}`}
            className="line-clamp-2 text-sm font-medium leading-tight text-neutral-900 hover:underline dark:text-white"
          >
            {item.productName}
          </Link>
          {sizeColor && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{sizeColor}</p>
          )}
          <p className="text-xs text-neutral-400">
            {formatMoney(item.unitPrice)} / cái
          </p>
        </div>

        <div className="flex items-center justify-between">
          {/* Low stock warning */}
          {isLowStock && (
            <p className="text-[11px] font-medium text-orange-500 dark:text-orange-400">
              Chỉ còn {item.availableStock} sản phẩm
            </p>
          )}
          {isOutOfStock && (
            <p className="text-[11px] font-medium text-red-500 dark:text-red-400">
              Sản phẩm này đã hết hàng
            </p>
          )}

          {/* Quantity controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateItem(item.variantSku, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-none border border-neutral-200 text-neutral-600 hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-30 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500"
              aria-label="Giảm số lượng"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-8 text-center text-sm text-neutral-900 dark:text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => updateItem(item.variantSku, item.quantity + 1)}
              disabled={isOutOfStock || (item.availableStock != null && item.quantity >= item.availableStock)}
              className="flex h-8 w-8 items-center justify-center rounded-none border border-neutral-200 text-neutral-600 hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-30 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500"
              aria-label="Tăng số lượng"
            >
              <Plus className="size-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Line total + remove */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="p-1 text-neutral-400 hover:text-red-500 disabled:opacity-30 dark:text-neutral-600 dark:hover:text-red-400"
          aria-label="Xóa sản phẩm"
        >
          <Trash className="size-4" />
        </button>
        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
          {formatMoney(item.lineTotal)}
        </span>
      </div>
    </div>
  );
}

// ─── Discount code input ───────────────────────────────────────────────────────

interface DiscountFormProps {
  appliedCode?: string;
  discountAmount?: number;
}

function DiscountForm({ appliedCode, discountAmount }: DiscountFormProps) {
  const { refreshCart } = useCart();
  const [code, setCode] = useState(appliedCode ?? "");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;
    setIsValidating(true);
    setError("");
    try {
      // Call discount validate endpoint
      const { validateDiscountCode } = await import(
        "@/services/rest-api/checkout/checkout"
      );
      await validateDiscountCode(code.trim());
      await refreshCart();
      toast.success(`Áp dụng mã "${code.trim()}" thành công`);
      setCode("");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Mã không hợp lệ hoặc đã hết hạn.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsValidating(false);
    }
  };

  if (appliedCode && discountAmount) {
    return (
      <div className="flex items-center justify-between rounded-none border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900 dark:bg-green-950/30">
        <div className="flex items-center gap-2">
          <Tag className="size-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            {appliedCode}
          </span>
        </div>
        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
          −{formatMoney(discountAmount)}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(""); }}
          placeholder="Nhập mã giảm giá"
          className="flex-1 rounded-none border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white"
        />
        <Button
          onClick={handleApply}
          disabled={!code.trim() || isValidating}
          variant="outline"
          size="sm"
          className="rounded-none"
        >
          {isValidating ? "…" : "Áp dụng"}
        </Button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Main CartView ─────────────────────────────────────────────────────────────

export function CartView() {
  const { cart, isLoading } = useCart();

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const discountAmount = cart?.discountAmount ?? 0;
  const total = cart?.totalAfterDiscount ?? subtotal;

  const hasOutOfStock = items.some(
    (i) => i.availableStock === 0 || i.inStock === false
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-28 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900">
          <ShoppingBag className="size-10 text-neutral-300 dark:text-neutral-700" />
        </div>
        <div>
          <p className="text-lg font-medium text-neutral-500 dark:text-neutral-400">
            Giỏ hàng trống
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm.
          </p>
        </div>
        <Link href="/collections/all">
          <Button variant="outline" className="rounded-none">
            Khám phá bộ sưu tập
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* ── Items list ──────────────────────────────────────── */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {cart?.itemCount ?? 0} sản phẩm
          </span>
          <Link
            href="/collections/all"
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
            Tiếp tục mua sắm
          </Link>
        </div>

        {/* Out of stock warning */}
        {hasOutOfStock && (
          <div className="mt-4 flex items-start gap-2 rounded-none border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/20">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0 text-red-500" aria-hidden="true">
              <path d="M8 1L1 14h14L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M8 6v4M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-300">
              Một số sản phẩm trong giỏ đã hết hàng. Vui lòng kiểm tra lại trước khi thanh toán.
            </p>
          </div>
        )}

        <div className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800">
          {items.map((item) => (
            <CartItemRow key={item.variantSku} item={item} />
          ))}
        </div>
      </div>

      {/* ── Order summary ───────────────────────────────────── */}
      <div>
        <div className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="mb-5 text-base font-semibold text-neutral-900 dark:text-white">
            Tóm tắt đơn hàng
          </h2>

          {/* Discount code */}
          <div className="mb-5">
            <DiscountForm
              appliedCode={cart?.appliedDiscountCode}
              discountAmount={discountAmount}
            />
          </div>

          {/* Totals */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Tạm tính</span>
              <span className="text-neutral-900 dark:text-white">{formatMoney(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Giảm giá</span>
                <span>−{formatMoney(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
              <span className="font-medium text-neutral-900 dark:text-white">Thành tiền</span>
              <span className="font-semibold text-neutral-900 dark:text-white">
                {formatMoney(total)}
              </span>
            </div>
          </div>

          <p className="mb-5 mt-2 text-xs text-neutral-400">
            Phí vận chuyển và thuế được tính khi thanh toán.
          </p>

          <Link href="/checkout">
            <Button
              className="w-full rounded-none py-4 text-sm font-medium"
              size="lg"
              disabled={hasOutOfStock}
            >
              {hasOutOfStock ? "Vui lòng kiểm tra giỏ hàng" : "Thanh toán"}
            </Button>
          </Link>

          {/* Trust badges */}
          <div className="mt-5 space-y-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            {[
              { icon: "🔒", label: "Thanh toán an toàn" },
              { icon: "↩", label: "Đổi trả trong 30 ngày" },
              { icon: "🚚", label: "Giao hàng nhanh chóng" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <span aria-hidden="true">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
