"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { formatMoney } from "@/lib/utils";
import {
  Minus,
  Plus,
  Heart,
  ShieldCheck,
  ArrowsClockwise,
  Truck,
} from "@phosphor-icons/react";
import { useCart } from "@/components/cart/cart-context";
import { VariantSelector } from "@/components/product/variant-selector";
import { ProductSizeGuide } from "@/components/product/product-size-guide";
import { useWishlist } from "@/components/product/wishlist-context";
import type { Product, ProductVariantPojo } from "@/types/product";
import { getOrCreateDeviceId } from "@/lib/device-id";
import { postBehaviorEvent } from "@/services/rest-api/behavior";

interface ProductDescriptionProps {
  product: Product;
}

function variantOnHand(v: ProductVariantPojo): number {
  return v.availableStock ?? v.currentStock ?? 0;
}

function pickSkuFromVariants(
  variants: ProductVariantPojo[],
  sizeParam: string | null,
  colorParam: string | null
): string | null {
  if (!variants.length) return null;
  const hasOpts = variants.some((v) => v.size || v.color);
  if (!hasOpts) return null;

  const inStock = (v: ProductVariantPojo) => variantOnHand(v) > 0;

  const candidates = variants.filter((v) => {
    const sz = sizeParam == null || v.size === sizeParam;
    const cl = colorParam == null || v.color === colorParam;
    return sz && cl && inStock(v);
  });

  if (candidates.length === 1) return candidates[0]!.sku;

  if (sizeParam && colorParam) {
    const exact = variants.find(
      (v) => v.size === sizeParam && v.color === colorParam && inStock(v)
    );
    return exact?.sku ?? null;
  }
  if (sizeParam) {
    return variants.find((v) => v.size === sizeParam && inStock(v))?.sku ?? null;
  }
  if (colorParam) {
    return variants.find((v) => v.color === colorParam && inStock(v))?.sku ?? null;
  }
  return null;
}

function pickOnlyInStockSku(variants: ProductVariantPojo[]): string | null {
  const hasOpts = variants.some((v) => v.size || v.color);
  if (!hasOpts) return null;
  const stocked = variants.filter((v) => variantOnHand(v) > 0);
  return stocked.length === 1 ? stocked[0]!.sku : null;
}

function formatPromoEnd(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("vi-VN", { day: "numeric", month: "short", year: "numeric" });
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isFavorite = product.id ? isInWishlist(product.id) : false;

  const variants = (product as unknown as { variants?: ProductVariantPojo[] }).variants ?? [];

  const variantKey = useMemo(
    () =>
      variants
        .map((v) => `${v.sku}:${v.availableStock ?? 0}:${v.size ?? ""}:${v.color ?? ""}`)
        .join("|"),
    [variants]
  );

  useEffect(() => {
    const sizeParam = searchParams.get("size");
    const colorParam = searchParams.get("color");
    const fromUrl = pickSkuFromVariants(variants, sizeParam, colorParam);
    if (fromUrl) {
      setSelectedSku(fromUrl);
      return;
    }
    const only = pickOnlyInStockSku(variants);
    if (only) {
      setSelectedSku(only);
      return;
    }
    setSelectedSku(null);
  }, [searchParams, variantKey, variants]);

  const selectedVariant = variants.find((v) => v.sku === selectedSku) || null;
  const hasOptions = variants.some((v) => v.size || v.color);

  const handleVariantChange = useCallback((sku: string | null) => {
    setSelectedSku(sku);
  }, []);

  const handleAddToCart = async (opts?: { thenGoToCart?: boolean }) => {
    if (hasOptions && !selectedVariant) {
      toast.error("Vui lòng chọn phân loại sản phẩm");
      return;
    }
    const sku = selectedVariant?.sku ?? product.barcode;
    setIsPending(true);
    try {
      await addItem(sku, quantity);
      toast.success("Đã thêm vào giỏ hàng");
      const deviceId = getOrCreateDeviceId();
      if (deviceId) {
        postBehaviorEvent({
          deviceId,
          eventType: "ADD_TO_CART",
          payload: {
            productId: product.id,
            barcode: product.barcode,
            categoryCode: product.category?.code,
            quantity,
            placement: "pdp",
          },
        }).catch(() => undefined);
      }
      setQuantity(1);
      if (opts?.thenGoToCart) {
        router.push("/cart");
        return;
      }
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
    product.currentPrice;

  const salePrice = displayPrice;
  let listPrice: number | null = null;
  if (selectedVariant) {
    const base = selectedVariant.productBasePrice;
    const fin = selectedVariant.finalPrice ?? salePrice;
    if (base != null && base > fin) listPrice = base;
  } else if (product.hasDiscount && product.originalPrice != null && product.originalPrice > salePrice) {
    listPrice = product.originalPrice;
  }

  const showDiscountPercent =
    !selectedVariant && product.hasDiscount && (product.discountPercent ?? 0) > 0;

  const rawStock = selectedVariant
    ? variantOnHand(selectedVariant)
    : (product.currentStock ?? 0);
  const inStock = rawStock > 0;
  const isLowStock = inStock && rawStock <= 5;
  const canAddToCart = inStock && (!hasOptions || !!selectedVariant);

  const promoEndLabel = formatPromoEnd(product.discountActiveUntil);

  const hasSizeVariants = variants.some((v) => Boolean(v.size));

  const attributesText = selectedVariant?.attributes?.trim();

  return (
    <div className="space-y-6">
      <div className="space-y-3 border-b border-neutral-200 pb-6 dark:border-neutral-800">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-medium leading-tight tracking-tight text-neutral-900 dark:text-white md:text-4xl">
            {product.name}
          </h1>
          <button
            aria-label={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
            onClick={handleToggleWishlist}
            className={`shrink-0 p-2 -m-2 transition-colors ${
              isFavorite
                ? "text-red-500"
                : "text-neutral-400 hover:text-red-500 dark:hover:text-red-400"
            }`}
          >
            <Heart size={24} weight={isFavorite ? "fill" : "regular"} />
          </button>
        </div>

        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4">
          <div className="flex flex-wrap items-baseline gap-2">
            {listPrice != null && listPrice > salePrice && (
              <span className="text-base text-neutral-400 line-through dark:text-neutral-500">
                {formatMoney(listPrice)}
              </span>
            )}
            <span className="text-2xl font-semibold text-neutral-900 dark:text-white">
              {formatMoney(salePrice)}
            </span>
            {showDiscountPercent && (
              <span className="rounded-none bg-neutral-900 px-2 py-0.5 text-xs font-semibold text-white dark:bg-white dark:text-black">
                -{product.discountPercent}%
              </span>
            )}
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
              <span className="text-xs text-neutral-500">({product.totalReviews ?? 0} đánh giá)</span>
            </div>
          )}
        </div>

        {promoEndLabel && product.hasDiscount && (
          <p className="text-xs text-neutral-500">Ưu đãi đến hết {promoEndLabel}</p>
        )}

        {isLowStock && (
          <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
            Chỉ còn {rawStock} sản phẩm — đặt ngay kẻo hết!
          </p>
        )}
      </div>

      <VariantSelector
        variants={variants}
        sizeKey="size"
        colorKey="color"
        onVariantChange={handleVariantChange}
      />

      <ProductSizeGuide visible={hasSizeVariants} />

      {attributesText ? (
        <div className="space-y-2 border-t border-neutral-100 pt-4 dark:border-neutral-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Thuộc tính phân loại
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {attributesText}
          </p>
        </div>
      ) : null}

      {product.description ? (
        <details
          className="group border-b border-neutral-100 pb-4 dark:border-neutral-900"
          open
        >
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-neutral-900 dark:text-white">
            Chi tiết sản phẩm
            <span className="transition-transform group-open:rotate-180">
              <Plus size={14} className="group-open:hidden" />
              <Minus size={14} className="hidden group-open:block" />
            </span>
          </summary>
          <div className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            <p className="whitespace-pre-wrap">{product.description}</p>
          </div>
        </details>
      ) : null}

      <details className="group border-b border-neutral-100 pb-4 dark:border-neutral-900">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-neutral-900 dark:text-white">
          Chính sách mua hàng
          <span className="transition-transform group-open:rotate-180">
            <Plus size={14} className="group-open:hidden" />
            <Minus size={14} className="hidden group-open:block" />
          </span>
        </summary>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          <p>
            Đổi trả và vận chuyển theo{" "}
            <Link
              href="/help/return-policy"
              className="font-medium text-neutral-900 underline underline-offset-2 dark:text-white"
            >
              chính sách trả hàng
            </Link>{" "}
            và{" "}
            <Link
              href="/help/shipping"
              className="font-medium text-neutral-900 underline underline-offset-2 dark:text-white"
            >
              chính sách vận chuyển
            </Link>
            .
          </p>
        </div>
      </details>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Số lượng
          </p>
          {rawStock > 0 && (
            <div className="flex items-center gap-1.5">
              <span className={`size-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
              <span className="text-[11px] font-medium uppercase tracking-tight text-neutral-500">
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
            <span className="w-8 text-center text-base font-medium tabular-nums">{quantity}</span>
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
          <span className="text-xs text-neutral-400">{rawStock} sản phẩm tại kho</span>
        </div>
      </div>

      <div className="hidden grid-cols-2 gap-3 pt-2 md:grid">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canAddToCart || isPending}
          className="w-full border border-black bg-white py-4 text-sm font-medium text-black transition-all hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white dark:bg-black dark:text-white"
        >
          {isPending ? "Đang xử lý…" : "Thêm vào giỏ"}
        </button>
        <button
          type="button"
          onClick={() => void handleAddToCart({ thenGoToCart: true })}
          disabled={!canAddToCart || isPending}
          className="w-full bg-black py-4 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black"
        >
          Mua ngay
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2">
        <Link
          href="/help/return-policy"
          className="flex flex-col items-center gap-1.5 bg-neutral-50 p-3 transition-colors hover:bg-neutral-100 dark:bg-neutral-900/50 dark:hover:bg-neutral-900"
        >
          <ShieldCheck className="size-6 text-neutral-600 dark:text-neutral-300" aria-hidden />
          <span className="text-center text-[10px] font-medium uppercase leading-tight tracking-wider text-neutral-500">
            Chính hãng
          </span>
        </Link>
        <Link
          href="/help/return-policy"
          className="flex flex-col items-center gap-1.5 bg-neutral-50 p-3 transition-colors hover:bg-neutral-100 dark:bg-neutral-900/50 dark:hover:bg-neutral-900"
        >
          <ArrowsClockwise className="size-6 text-neutral-600 dark:text-neutral-300" aria-hidden />
          <span className="text-center text-[10px] font-medium uppercase leading-tight tracking-wider text-neutral-500">
            Đổi trả 15 ngày
          </span>
        </Link>
        <Link
          href="/help/shipping"
          className="flex flex-col items-center gap-1.5 bg-neutral-50 p-3 transition-colors hover:bg-neutral-100 dark:bg-neutral-900/50 dark:hover:bg-neutral-900"
        >
          <Truck className="size-6 text-neutral-600 dark:text-neutral-300" aria-hidden />
          <span className="text-center text-[10px] font-medium uppercase leading-tight tracking-wider text-neutral-500">
            Freeship từ 500k
          </span>
        </Link>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/80 px-4 py-3 backdrop-blur-md md:hidden dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">
              {formatMoney(displayPrice)}
            </p>
            <p className="text-[10px] font-medium text-neutral-500">
              Miễn phí ship đơn từ 500k ·{" "}
              <Link href="/help/shipping" className="underline underline-offset-2">
                Điều kiện
              </Link>
            </p>
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
