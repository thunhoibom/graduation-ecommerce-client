"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CaretRight, Heart, ShoppingBag, Trash } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useCart } from "@/components/cart/cart-context";
import { useWishlist } from "@/components/product/wishlist-context";
import { ForYouRail } from "@/components/product/for-you-rail";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import {
  addToCart,
  calculateCartPricing,
} from "@/services/rest-api/cart/cart";

function formatSavedAt(iso?: string): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return null;
  }
}

export function WishlistView() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { refreshCart } = useCart();
  const [bulkAdding, setBulkAdding] = useState(false);

  const estimatedSubtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0),
    [items],
  );

  const railQuery = useMemo(
    () => items.slice(0, 2).map((i) => i.productName).join(" "),
    [items],
  );

  const excludeIds = useMemo(
    () =>
      items
        .map((i) => (i.productId != null ? String(i.productId) : ""))
        .filter((id) => id.length > 0),
    [items],
  );

  const handleAddToCart = async (variantSku: string) => {
    try {
      await addToCart({ variantSku, quantity: 1 });
      await calculateCartPricing();
      await refreshCart();
      toast.success("Đã thêm vào giỏ hàng");
    } catch {
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  const handleAddAllToCart = async () => {
    if (items.length === 0 || bulkAdding) return;
    setBulkAdding(true);
    let ok = 0;
    let fail = 0;
    for (const item of items) {
      try {
        await addToCart({ variantSku: item.slug, quantity: 1 });
        ok++;
      } catch {
        fail++;
      }
    }
    try {
      await calculateCartPricing();
    } catch {
      /* pricing optional */
    }
    await refreshCart();
    setBulkAdding(false);
    if (ok > 0 && fail === 0) {
      toast.success(`Đã thêm ${ok} sản phẩm vào giỏ hàng`);
    } else if (ok > 0 && fail > 0) {
      toast.success(`Đã thêm ${ok} sản phẩm vào giỏ`, {
        description:
          fail > 0
            ? `${fail} sản phẩm không thể thêm — vui lòng kiểm tra lại.`
            : undefined,
      });
    } else {
      toast.error("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  const handleClearAll = () => {
    if (
      !window.confirm(
        "Xóa toàn bộ sản phẩm khỏi danh sách yêu thích? Thao tác này không thể hoàn tác.",
      )
    ) {
      return;
    }
    clearWishlist();
    toast.success("Đã xóa danh sách yêu thích");
  };

  return (
    <div className="pb-16">
      <div className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1 text-xs text-neutral-500"
          >
            <Link
              href="/"
              className="shrink-0 whitespace-nowrap transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              Trang chủ
            </Link>
            <CaretRight
              className="size-3 shrink-0 text-neutral-300 dark:text-neutral-700"
              aria-hidden
            />
            <span className="text-neutral-900 dark:text-white">
              Danh sách yêu thích
            </span>
          </nav>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white lg:text-4xl">
            Danh sách yêu thích
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <div className="rounded-full bg-neutral-100 p-6 dark:bg-neutral-800">
              <Heart size={48} className="text-neutral-300 dark:text-neutral-600" />
            </div>
            <div className="max-w-md space-y-2">
              <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
                Chưa có sản phẩm nào được lưu
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Dạo một vòng bộ sưu tập hoặc hàng mới, nhấn biểu tượng trái tim
                trên trang sản phẩm để giữ lại những món bạn thích.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/collections/all">
                <Button className="rounded-none px-8">Khám phá bộ sưu tập</Button>
              </Link>
              <Link href="/new-arrivals">
                <Button variant="outline" className="rounded-none px-8">
                  Hàng mới về
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4 dark:border-neutral-800">
                  <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {items.length} sản phẩm
                  </span>
                  <Link
                    href="/collections/all"
                    className="text-sm font-medium text-neutral-600 underline underline-offset-4 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  >
                    Tiếp tục mua sắm
                  </Link>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => {
                    const savedLabel = formatSavedAt(item.addedAt);
                    return (
                      <div key={item.id} className="group relative flex flex-col">
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 transition-all dark:bg-neutral-900">
                        {item.featuredImage && (
                          <Image
                            src={item.featuredImage.url}
                            alt={item.productName}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-neutral-500 backdrop-blur-sm transition-colors hover:bg-white hover:text-red-500"
                          aria-label="Xóa khỏi yêu thích"
                        >
                          <Trash size={16} />
                        </button>
                      </div>

                      <div className="mt-4 flex flex-1 flex-col space-y-2">
                        <Link href={`/product/${item.slug}`} className="flex-1">
                          <h2 className="text-sm font-medium text-neutral-900 transition-colors hover:text-neutral-500 dark:text-white dark:hover:text-neutral-400">
                            {item.productName}
                          </h2>
                        </Link>
                        {savedLabel && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-500">
                            Đã lưu {savedLabel}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {formatMoney(item.price)}đ
                        </p>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(item.slug)}
                          className="mt-4 flex items-center justify-center gap-2 border border-neutral-200 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-black hover:text-white dark:border-neutral-800 dark:hover:bg-white dark:hover:text-black"
                        >
                          <ShoppingBag size={16} />
                          Thêm vào giỏ
                        </button>
                      </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800">
                  <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                    Tóm tắt
                  </h2>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Giá hiển thị là ước tính theo lúc bạn lưu; giá tại giỏ và
                    thanh toán có thể thay đổi theo khuyến mãi hoặc sản phẩm.
                  </p>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        Số lượng mục
                      </span>
                      <span className="text-neutral-900 dark:text-white">
                        {items.length}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                      <span className="font-medium text-neutral-900 dark:text-white">
                        Tạm tính ước lượng
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {formatMoney(estimatedSubtotal)}đ
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <Button
                      type="button"
                      className="w-full rounded-none py-4 text-sm font-medium"
                      size="lg"
                      disabled={bulkAdding}
                      onClick={() => void handleAddAllToCart()}
                    >
                      {bulkAdding ? "Đang thêm…" : "Thêm tất cả vào giỏ"}
                    </Button>
                    <Link href="/cart" className="block">
                      <Button
                        variant="outline"
                        className="w-full rounded-none py-4 text-sm font-medium"
                        size="lg"
                      >
                        Đến giỏ hàng
                      </Button>
                    </Link>
                    <Link
                      href="/collections/all"
                      className="block text-center text-sm text-neutral-600 underline underline-offset-4 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    >
                      Tiếp tục mua sắm
                    </Link>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-center text-xs font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Xóa tất cả khỏi danh sách
                    </button>
                  </div>

                  <div className="mt-6 space-y-2 border-t border-neutral-100 pt-5 dark:border-neutral-800">
                    {[
                      { icon: "🔒", label: "Thanh toán an toàn" },
                      { icon: "↩", label: "Đổi trả trong 30 ngày" },
                      { icon: "🚚", label: "Giao hàng nhanh chóng" },
                    ].map(({ icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400"
                      >
                        <span aria-hidden>{icon}</span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>

            <ForYouRail variant="cart" query={railQuery} excludeIds={excludeIds} />
          </div>
        )}
      </div>
    </div>
  );
}
