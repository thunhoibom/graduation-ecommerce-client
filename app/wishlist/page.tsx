"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/components/product/wishlist-context";
import { formatMoney } from "@/lib/utils";
import { Heart, ShoppingBag, Trash } from "@phosphor-icons/react";
import { useCart } from "@/components/cart/cart-context";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = async (barcode: string) => {
    try {
      await addItem(barcode, 1);
      toast.success("Đã thêm vào giỏ hàng");
    } catch {
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-8 dark:border-neutral-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Danh sách yêu thích
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {items.length === 0 
              ? "Bạn chưa lưu sản phẩm nào."
              : `Bạn đang có ${items.length} sản phẩm trong danh sách.`}
          </p>
        </div>
        <Link 
          href="/"
          className="text-sm font-medium text-black underline underline-offset-4 dark:text-white"
        >
          Tiếp tục mua sắm
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
          <div className="rounded-full bg-neutral-100 p-6 dark:bg-neutral-800">
            <Heart size={48} className="text-neutral-300" />
          </div>
          <p className="text-neutral-500">Danh sách của bạn đang trống.</p>
          <Link
            href="/new-arrivals"
            className="bg-black px-8 py-3 text-sm font-medium text-white dark:bg-white dark:text-black transition-opacity hover:opacity-85"
          >
            Khám phá ngay
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-8">
          {items.map((item) => (
            <div key={item.id} className="group relative flex flex-col">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 transition-all dark:bg-neutral-900">
                {item.featuredImage && (
                  <Image
                    src={item.featuredImage.url}
                    alt={item.productName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                )}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-neutral-500 backdrop-blur-sm transition-colors hover:bg-white hover:text-red-500"
                  aria-label="Xóa khỏi yêu thích"
                >
                  <Trash size={16} />
                </button>
              </div>

              <div className="mt-4 flex flex-1 flex-col space-y-2">
                <Link href={`/product/${item.slug}`} className="flex-1">
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-white transition-colors hover:text-neutral-500">
                    {item.productName}
                  </h3>
                </Link>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {formatMoney(item.price)}đ
                </p>
                
                <button
                  onClick={() => handleAddToCart(item.slug)}
                  className="mt-4 flex items-center justify-center gap-2 border border-neutral-200 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-black hover:text-white dark:border-neutral-800 dark:hover:bg-white dark:hover:text-black"
                >
                  <ShoppingBag size={16} />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
