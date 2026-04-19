"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatMoney } from "@/lib/utils";
import { Minus, Plus } from "@phosphor-icons/react";
import { useCart } from "@/components/cart/cart-context";
import { VariantSelector } from "@/components/product/variant-selector";
import type { Product, ProductVariantPojo } from "@/types/product";

interface ProductDescriptionProps {
  product: Product;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const variants = (product as unknown as { variants?: ProductVariantPojo[] }).variants ?? [];
  const selectedVariant = variants.find((v) => v.sku === selectedSku) || null;
  const hasOptions = variants.some((v) => v.size || v.color);

  const handleVariantChange = (sku: string | null) => {
    setSelectedSku(sku);
  };

  const handleAddToCart = async () => {
    if (hasOptions && !selectedVariant) {
      toast.error("Vui lòng chọn phân loại sản phẩm");
      return;
    }
    const sku = selectedVariant?.sku ?? product.barcode;
    setIsPending(true);
    try {
      await addItem(sku, quantity);
      toast.success("Đã thêm vào giỏ hàng");
      setQuantity(1);
      router.refresh();
    } catch {
      toast.error("Không thể thêm sản phẩm. Vui lòng thử lại.");
    } finally {
      setIsPending(false);
    }
  };

  const displayPrice =
    selectedVariant?.finalPrice ??
    selectedVariant?.productBasePrice ??
    product.price;

  const rawStock = selectedVariant?.availableStock ?? product.currentStock ?? 0;
  const inStock = rawStock > 0;
  const isLowStock = inStock && rawStock <= 5;
  const canAddToCart = inStock && (!hasOptions || !!selectedVariant);

  const buttonLabel = () => {
    if (isPending) return "Đang thêm…";
    if (!inStock) return "Hết hàng";
    if (hasOptions && !selectedVariant) return "Chọn phân loại";
    return "Thêm vào giỏ";
  };

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="border-b border-neutral-200 pb-6 dark:border-neutral-800 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight leading-tight text-neutral-900 dark:text-white">
            {product.name}
          </h1>
          <button
            aria-label="Yêu thích"
            className="shrink-0 p-2 -m-2 text-neutral-400 hover:text-red-500 transition-colors dark:hover:text-red-400"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M10 17s-7-4.35-7-9a4 4 0 018 0 4 4 0 018 0c0 4.65-7 9-7 9z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Price row */}
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-neutral-900 dark:text-white">
              {formatMoney(displayPrice)}
            </span>
          </div>

          {product.averageRating != null && product.averageRating > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((n) => (
                  <svg key={n} width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M7 1l1.5 3.5L12 5l-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5L7 1z"
                      fill={n <= Math.round(product.averageRating!) ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-neutral-400"
                    />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-neutral-500">
                ({product.totalReviews ?? 0} đánh giá)
              </span>
            </div>
          )}
        </div>

        {isLowStock && (
          <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
            Chỉ còn {rawStock} sản phẩm — đặt ngay kẻo hết!
          </p>
        )}
      </div>

      {/* ── Variant selector ────────────────────────────────── */}
      <VariantSelector
        variants={variants}
        sizeKey="size"
        colorKey="color"
        onVariantChange={handleVariantChange}
      />

      {/* ── Description ────────────────────────────────────── */}
      {product.description && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Mô tả sản phẩm
          </p>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {product.description}
          </p>
        </div>
      )}

      {/* ── Quantity Selector ───────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
          Số lượng
        </p>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-32 items-center justify-between border border-neutral-200 px-3 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-1 text-neutral-500 hover:text-black disabled:opacity-30 dark:hover:text-white"
              aria-label="Giảm số lượng"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center text-base font-medium tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(rawStock || 99, quantity + 1))}
              disabled={quantity >= (rawStock || 99)}
              className="p-1 text-neutral-500 hover:text-black disabled:opacity-30 dark:hover:text-white"
              aria-label="Tăng số lượng"
            >
              <Plus size={16} />
            </button>
          </div>
          {rawStock > 0 && (
            <span className="text-sm text-neutral-500">
              {rawStock} sản phẩm có sẵn
            </span>
          )}
        </div>
      </div>

      {/* ── Add to cart — desktop ────────────────────────────── */}
      <div className="hidden md:block">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canAddToCart || isPending}
          className="w-full bg-black py-4 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Đang thêm…
            </span>
          ) : buttonLabel()}
        </button>
      </div>

      {/* ── Sticky mobile bar ─────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden dark:bg-neutral-950 dark:border-neutral-800 dark:shadow-none">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-neutral-900 dark:text-white truncate">
              {formatMoney(displayPrice)}đ
            </p>
            {!inStock && (
              <p className="text-xs text-red-500 font-medium">Hết hàng</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAddToCart || isPending}
            className="shrink-0 bg-black px-6 py-3 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-black"
          >
            {isPending ? "…" : buttonLabel()}
          </button>
        </div>
      </div>
    </div>
  );
}
