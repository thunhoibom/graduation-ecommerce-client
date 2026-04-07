"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { useCart } from "./cart-context";
import type { Product } from "@/types/product";
import { toast } from "sonner";

interface AddToCartProps {
  product: Product;
  /** The sku (barcode) of the selected variant — resolved from URL params on PDP */
  selectedVariantSku?: string;
  quantity?: number;
}

export function AddToCart({ product, selectedVariantSku, quantity = 1 }: AddToCartProps) {
  const { addItem } = useCart();
  const [isPending, setIsPending] = useState(false);

  const isAvailable = product.currentStock == null || product.currentStock > 0;

  const handleAddToCart = async () => {
    if (!selectedVariantSku) {
      toast.error("Vui lòng chọn phân loại sản phẩm");
      return;
    }
    setIsPending(true);
    try {
      await addItem(selectedVariantSku, quantity);
      toast.success("Đã thêm vào giỏ hàng");
    } catch {
      toast.error("Không thể thêm sản phẩm. Vui lòng thử lại.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!isAvailable || !selectedVariantSku || isPending}
      className="relative flex w-full items-center justify-center gap-2 rounded-none bg-black px-6 py-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Đang thêm…
        </span>
      ) : !isAvailable ? (
        "Hết hàng"
      ) : !selectedVariantSku ? (
        "Chọn phân loại"
      ) : (
        <>
          <Plus className="size-4" />
          Thêm vào giỏ
        </>
      )}
    </button>
  );
}
