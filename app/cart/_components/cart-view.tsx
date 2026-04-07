"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash, ArrowLeft, ShoppingBag } from "@phosphor-icons/react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";

function CartItemRow({
  item,
}: {
  item: NonNullable<NonNullable<ReturnType<typeof useCart>["cart"]>["items"]>[number];
}) {
  const { updateItem, removeItem } = useCart();

  const sizeColor =
    [item.variantSize, item.variantColor].filter(Boolean).join(" / ") || undefined;

  return (
    <div className="flex gap-4 border-b border-neutral-100 py-5 last:border-0 dark:border-neutral-800">
      {/* Image placeholder */}
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
        <ShoppingBag className="size-8 text-neutral-300 dark:text-neutral-700" />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/product/${item.productBarcode}`}
            className="font-medium hover:underline"
          >
            {item.productName}
          </Link>
          {sizeColor && (
            <p className="mt-0.5 text-sm text-neutral-500">{sizeColor}</p>
          )}
          <p className="mt-1 text-sm text-neutral-400">
            {formatMoney(item.unitPrice)} / cái
          </p>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateItem(item.variantSku, item.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500"
              aria-label="Giảm"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => updateItem(item.variantSku, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500"
              aria-label="Tăng"
            >
              <Plus className="size-3" />
            </button>
          </div>

          {/* Line total */}
          <span className="font-semibold">{formatMoney(item.lineTotal)}</span>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.variantSku)}
        className="self-start p-1 text-neutral-400 hover:text-red-500 dark:text-neutral-600 dark:hover:text-red-400"
        aria-label="Xóa sản phẩm"
      >
        <Trash className="size-4" />
      </button>
    </div>
  );
}

export function CartView() {
  const { cart, isLoading } = useCart();

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const discountAmount = cart?.discountAmount ?? 0;
  const total = cart?.totalAfterDiscount ?? subtotal;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <ShoppingBag className="size-16 text-neutral-200 dark:text-neutral-800" />
        <p className="text-lg font-medium text-neutral-500">Giỏ hàng trống</p>
        <Link href="/collections/all">
          <Button variant="outline">Tiếp tục mua sắm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Items list */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
          <span className="text-sm text-neutral-500">
            {cart?.itemCount ?? 0} sản phẩm
          </span>
          <Link
            href="/collections/all"
            className="flex items-center gap-1 text-sm text-neutral-500 hover:text-black dark:hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Tiếp tục mua sắm
          </Link>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {items.map((item) => (
            <CartItemRow key={item.variantSku} item={item} />
          ))}
        </div>
      </div>

      {/* Summary */}
      <div>
        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="mb-4 text-lg font-semibold">Tổng cộng</h2>

          <div className="space-y-3 text-sm">
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

            <div className="flex justify-between border-t border-neutral-100 pt-3 text-base font-semibold dark:border-neutral-800">
              <span>Thành tiền</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>

          <p className="mb-4 mt-2 text-xs text-neutral-400">
            Phí vận chuyển và thuế được tính khi thanh toán.
          </p>

          <Link href="/checkout">
            <Button className="w-full" size="lg">
              Thanh toán
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
