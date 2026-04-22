"use client";

import React, { Fragment, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { X, Trash, Minus, Plus, ShoppingBag } from "@phosphor-icons/react";
import { useCart } from "./cart-context";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import { getPromotionReason, parseAppliedPromotions } from "@/lib/cart-promotions";

const CartItemRow = memo(function CartItemRow({
  item,
}: {
  item: NonNullable<NonNullable<ReturnType<typeof useCart>["cart"]>["items"]>[number];
}) {
  const { updateItem, removeItem } = useCart();
  const sku = item.variantSku || (item as any).sku || (item as any).variantSkuResolved;

  const sizeColor =
    [item.variantSize, item.variantColor].filter(Boolean).join(" / ") || undefined;

  return (
    <li className="flex w-full flex-col border-b border-neutral-100 py-4 last:border-0 dark:border-neutral-800 first:pt-0">
      <div className="flex gap-3">
        {/* Image */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
          {item.primaryImageUrl ? (
            <Image
              src={item.primaryImageUrl}
              alt={item.productName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag className="size-6 text-neutral-300 dark:text-neutral-700" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-between overflow-hidden">
          <div>
            <Link
              href={`/product/${item.productBarcode}`}
              className="line-clamp-2 text-sm font-medium leading-tight text-neutral-900 hover:underline dark:text-white"
            >
              {item.productName}
            </Link>
            {sizeColor && (
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                {sizeColor}
              </p>
            )}
          </div>
          <div className="flex items-end justify-between">
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {formatMoney(item.lineTotal)}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateItem(sku, item.quantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded border border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500"
                aria-label="Giảm số lượng"
              >
                <Minus className="size-3" />
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => updateItem(sku, item.quantity + 1)}
                className="flex h-7 w-7 items-center justify-center rounded border border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500"
                aria-label="Tăng số lượng"
              >
                <Plus className="size-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Remove */}
        <button
          onClick={() => removeItem(sku)}
          className="ml-1 self-start p-1 text-neutral-400 hover:text-red-500 dark:text-neutral-600 dark:hover:text-red-400"
          aria-label="Xóa sản phẩm"
        >
          <Trash className="size-4" />
        </button>
      </div>

      {/* Unit price */}
      <div className="mt-1 flex justify-end">
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          {formatMoney(item.unitPrice)} / cái
        </span>
      </div>
    </li>
  );
});

export default function CartModal() {
  const { cart, isOpen, setIsOpen, isLoading } = useCart();

  const itemCount = cart?.itemCount ?? 0;
  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const discountAmount = cart?.discountAmount ?? 0;
  const total = cart?.totalAfterDiscount ?? subtotal;
  const appliedPromotions = parseAppliedPromotions(cart?.appliedPromotionsJson);

  return (
    <>
      {/* Trigger */}
      <button
        aria-label={`Giỏ hàng (${itemCount} sản phẩm)`}
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-1.5"
      >
        <ShoppingBag className="size-5" />
        {itemCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white dark:bg-white dark:text-black">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          {/* Panel */}
          <Transition.Child
            as={Fragment}
            enter="transition-transform duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex w-full flex-col border-l border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-950 md:w-[390px]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
                <Dialog.Title className="text-base font-semibold text-neutral-900 dark:text-white">
                  Giỏ hàng của tôi
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Đóng giỏ hàng"
                  className="flex h-9 w-9 items-center justify-center rounded border border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Body */}
              {isLoading && !cart ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5">
                  <ShoppingBag className="size-16 text-neutral-200 dark:text-neutral-800" />
                  <p className="text-lg font-medium text-neutral-500 dark:text-neutral-400">
                    Giỏ hàng trống
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                    Tiếp tục mua sắm
                  </Button>
                </div>
              ) : (
                <>
                  <ul className="flex-1 overflow-y-auto px-5 py-4">
                    {items.map((item) => {
                      const itemSku = item.variantSku || (item as any).sku || (item as any).variantSkuResolved;
                      return <CartItemRow key={itemSku} item={item} />;
                    })}
                  </ul>

                  {/* Summary */}
                  <div className="border-t border-neutral-100 px-5 py-4 dark:border-neutral-800">
                    {appliedPromotions.length > 0 && (
                      <div className="mb-3 rounded border border-neutral-200 bg-neutral-50 p-2.5 dark:border-neutral-800 dark:bg-neutral-900/40">
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                          Ưu đãi áp dụng
                        </p>
                        <div className="space-y-1">
                          {appliedPromotions.map((line, idx) => (
                            <div key={`${line.promotionRuleId ?? line.couponCode ?? "promo"}-${idx}`} className="flex items-start justify-between gap-2 text-xs">
                              <span className="text-neutral-600 dark:text-neutral-300">{getPromotionReason(line)}</span>
                              <span className="font-medium text-green-600 dark:text-green-400">
                                {line.freeShipping ? "Free ship" : `-${formatMoney(line.discountAmount ?? 0)}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-neutral-500 dark:text-neutral-400">Giảm giá</span>
                        <span className="text-green-600 dark:text-green-400">
                          -{formatMoney(discountAmount)}
                        </span>
                      </div>
                    )}
                    <div className="mb-4 flex justify-between">
                      <span className="font-medium text-neutral-900 dark:text-white">Tổng cộng</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {formatMoney(total)}
                      </span>
                    </div>
                    <p className="mb-1 text-xs text-neutral-400 dark:text-neutral-500">
                      Phí vận chuyển được tính khi thanh toán.
                    </p>
                    <Link href="/checkout" onClick={() => setIsOpen(false)}>
                      <Button className="mt-3 w-full" size="lg">
                        Thanh toán
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
