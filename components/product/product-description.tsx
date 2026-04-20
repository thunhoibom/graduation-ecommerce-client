"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatMoney } from "@/lib/utils";
import { Minus, Plus } from "@phosphor-icons/react";
import { useCart } from "@/components/cart/cart-context";
import { VariantSelector } from "@/components/product/variant-selector";
import { useWishlist } from "@/components/product/wishlist-context";
import type { Product, ProductVariantPojo } from "@/types/product";
import { Heart } from "@phosphor-icons/react";

interface ProductDescriptionProps {
  product: Product;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isFavorite = product.id ? isInWishlist(product.id) : false;

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

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    if (!isFavorite) {
      toast.success("Đã lưu vào danh sách yêu thích");
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
            aria-label={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
            onClick={handleToggleWishlist}
            className={`shrink-0 p-2 -m-2 transition-colors ${
              isFavorite ? "text-red-500" : "text-neutral-400 hover:text-red-500 dark:hover:text-red-400"
            }`}
          >
            <Heart size={24} weight={isFavorite ? "fill" : "regular"} />
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

      {/* ── Tabs/Info Hierarchy ───────────────────────────── */}
      <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
        {[
          {
            id: "desc",
            title: "Chi tiết sản phẩm",
            content: product.description || "Đang cập nhật...",
          },
          {
            id: "size",
            title: "Bảng size & Thông số",
            content: (
              <div className="space-y-3">
                <p>Mẫu cao 1m85, nặng 75kg đang mặc size L.</p>
                <div className="grid grid-cols-3 gap-2 text-[11px] uppercase tracking-wider text-neutral-500">
                  <div className="border border-neutral-100 p-2 text-center">Size S: 50-60kg</div>
                  <div className="border border-neutral-100 p-2 text-center">Size M: 60-70kg</div>
                  <div className="border border-neutral-100 p-2 text-center">Size L: 70-85kg</div>
                </div>
                <button className="text-xs font-semibold text-neutral-900 underline underline-offset-4 dark:text-white">
                  Xem bảng quy đổi chi tiết
                </button>
              </div>
            ),
          },
          {
            id: "care",
            title: "Hướng dẫn bảo quản",
            content: "Giặt máy ở nhiệt độ thường. Không sử dụng thuốc tẩy. Phơi trong bóng râm. Ủi ở nhiệt độ thấp.",
          },
        ].map((item) => (
          <details key={item.id} className="group border-b border-neutral-100 pb-4 dark:border-neutral-900" open={item.id === "desc"}>
            <summary className="flex cursor-pointer items-center justify-between list-none text-sm font-medium text-neutral-900 dark:text-white">
              {item.title}
              <span className="transition-transform group-open:rotate-180">
                <Plus size={14} className="group-open:hidden" />
                <Minus size={14} className="hidden group-open:block" />
              </span>
            </summary>
            <div className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {item.content}
            </div>
          </details>
        ))}
      </div>

      {/* ── Quantity Selector ───────────────────────────────── */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Số lượng
          </p>
          {rawStock > 0 && (
            <div className="flex items-center gap-1.5">
               <span className={`size-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
               <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-tight">
                 {isLowStock ? "Sắp hết hàng" : inStock ? "Sẵn sàng giao ngay" : "Hết hàng"}
               </span>
            </div>
          )}
        </div>
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
          <span className="text-xs text-neutral-400">
            {rawStock} sản phẩm tại kho
          </span>
        </div>
      </div>

      {/* ── Add to cart — desktop ────────────────────────────── */}
      <div className="hidden md:grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canAddToCart || isPending}
          className="w-full border border-black bg-white py-4 text-sm font-medium text-black transition-all hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-black dark:text-white dark:border-white"
        >
          {isPending ? "Đang xử lý…" : "Thêm vào giỏ"}
        </button>
        <button
          type="button"
          onClick={() => {
            handleAddToCart();
            router.push("/cart");
          }}
          disabled={!canAddToCart || isPending}
          className="w-full bg-black py-4 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black"
        >
          Mua ngay
        </button>
      </div>

      {/* ── Trust Badges ────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        {[
          { icon: "🛡️", label: "Chính hãng 100%" },
          { icon: "🔄", label: "15 ngày đổi trả" },
          { icon: "🚚", label: "Freeship từ 500k" },
        ].map((badge, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1.5 p-3 bg-neutral-50 dark:bg-neutral-900/50"
          >
            <span className="text-xl">{badge.icon}</span>
            <span className="text-[10px] font-medium text-neutral-500 text-center leading-tight uppercase tracking-wider">
              {badge.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Sticky mobile bar ─────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/80 backdrop-blur-md px-4 py-3 md:hidden dark:bg-neutral-950/80 dark:border-neutral-800">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
              {formatMoney(displayPrice)}đ
            </p>
            <p className="text-[10px] text-neutral-500 font-medium">Free Shipping</p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAddToCart || isPending}
            className="shrink-0 bg-black px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white disabled:opacity-40 dark:bg-white dark:text-black"
          >
            {isPending ? "…" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </div>
  );
}
