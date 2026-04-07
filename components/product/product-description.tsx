"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatMoney } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-context";
import type { Product, ProductVariantPojo } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductDescriptionProps {
  product: Product;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantPojo | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Extract unique sizes and colors from variants
  const sizes = Array.from(
    new Set(
      (product as unknown as { variants?: ProductVariantPojo[] }).variants?.map((v) => v.size).filter(Boolean) ?? []
    )
  );
  const colors = Array.from(
    new Set(
      (product as unknown as { variants?: ProductVariantPojo[] }).variants?.map((v) => v.color).filter(Boolean) as string[] ?? []
    )
  );

  const handleAddToCart = async () => {
    if (!selectedVariant && (sizes.length > 0 || colors.length > 0)) {
      toast.error("Vui lòng chọn phân loại sản phẩm");
      return;
    }
    const sku = selectedVariant?.sku ?? product.barcode;
    setIsPending(true);
    try {
      await addItem(sku, 1);
      toast.success("Đã thêm vào giỏ hàng");
    } catch {
      toast.error("Không thể thêm sản phẩm. Vui lòng thử lại.");
    } finally {
      setIsPending(false);
    }
  };

  const displayPrice = selectedVariant?.finalPrice ?? selectedVariant?.productBasePrice ?? product.price;
  const inStock = selectedVariant?.availableStock != null ? selectedVariant.availableStock > 0 : (product.currentStock ?? 0) > 0;
  const hasOptions = sizes.length > 0 || colors.length > 0;
  const canAddToCart = inStock && (!hasOptions || !!selectedVariant);

  return (
    <div className="space-y-6">
      <div className="flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.name}</h1>
        <div className="mr-auto flex items-center gap-2 rounded-full bg-black p-2 text-sm text-white dark:bg-white dark:text-black">
          <span>{formatMoney(displayPrice)}</span>
          <span>VND</span>
        </div>
      </div>

      {/* Size selector */}
      {sizes.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-wide">
            Kích thước
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isActive = selectedSize === size;
              const variantForSize = (product as unknown as { variants?: ProductVariantPojo[] }).variants?.find(
                (v) => v.size === size && (!selectedColor || v.color === selectedColor)
              );
              const outOfStock = !variantForSize?.availableStock;

              return (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    // Find matching variant
                    const v = (product as unknown as { variants?: ProductVariantPojo[] }).variants?.find(
                      (v) => v.size === size && (!selectedColor || v.color === selectedColor)
                    );
                    setSelectedVariant(v ?? null);
                  }}
                  disabled={outOfStock}
                  className={cn(
                    "min-w-[48px] rounded-full border px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : outOfStock
                        ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 line-through dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-600"
                        : "border-neutral-300 hover:border-black dark:border-neutral-700 dark:hover:border-white"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color selector */}
      {colors.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-wide">
            Màu sắc
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isActive = selectedColor === color;
              const variantForColor = (product as unknown as { variants?: ProductVariantPojo[] }).variants?.find(
                (v) => v.color === color && (!selectedSize || v.size === selectedSize)
              );
              const outOfStock = !variantForColor?.availableStock;

              return (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    const v = (product as unknown as { variants?: ProductVariantPojo[] }).variants?.find(
                      (v) => v.color === color && (!selectedSize || v.size === selectedSize)
                    );
                    setSelectedVariant(v ?? null);
                  }}
                  disabled={outOfStock}
                  className={cn(
                    "rounded-full border px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : outOfStock
                        ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 line-through dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-600"
                        : "border-neutral-300 hover:border-black dark:border-neutral-700 dark:hover:border-white"
                  )}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Description */}
      {product.description && (
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {product.description}
        </p>
      )}

      {/* Add to cart */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!canAddToCart || isPending}
        className="flex w-full items-center justify-center gap-2 bg-black px-6 py-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {isPending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Đang thêm…
          </>
        ) : !inStock ? (
          "Hết hàng"
        ) : hasOptions && !selectedVariant ? (
          "Chọn phân loại"
        ) : (
          "Thêm vào giỏ"
        )}
      </button>
    </div>
  );
}