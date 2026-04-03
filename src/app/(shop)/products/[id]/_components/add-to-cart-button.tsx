'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { ProductPojo } from 'src/services/rest-api/app-api/types';
import type { CartProduct } from 'lib/shopify/types';
import { useCart } from 'components/cart/cart-context';

/** Build a CartProduct from a backend ProductPojo */
function toCartProduct(product: ProductPojo): CartProduct {
  const firstImage = product.images?.[0];
  return {
    id: product.barcode,
    handle: product.barcode,
    title: product.name,
    featuredImage: firstImage
      ? { url: firstImage.url, altText: product.name, width: 800, height: 800 }
      : { url: '', altText: product.name, width: 1, height: 1 },
  };
}

interface AddToCartButtonProps {
  product: ProductPojo;
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const { addCartItem } = useCart() as unknown as {
    addCartItem: (
      variant: { id: string; title: string; price: { amount: string; currencyCode: string }; availableForSale: boolean; selectedOptions: Array<{ name: string; value: string }> },
      product: CartProduct,
    ) => void;
  };
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    try {
      addCartItem(
        {
          id: product.barcode,
          title: 'Default',
          availableForSale: (product.currentStock ?? 0) > 0,
          selectedOptions: [],
          price: { amount: String(product.price), currencyCode: 'VND' },
        },
        toCartProduct(product),
      );
      toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className="w-full rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
    >
      {isAdding ? 'Đang thêm…' : disabled ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
    </button>
  );
}
