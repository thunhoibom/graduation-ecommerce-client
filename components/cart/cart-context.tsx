"use client";

import type { Cart, CartItem } from "@/types/cart";
import type { ProductVariant, Product } from "@/types/product";
import React, {
  createContext,
  useContext,
  useOptimistic,
  useState,
  useEffect,
} from "react";
import { getCart } from "@/services/rest-api/cart/cart";

type UpdateType = "plus" | "minus" | "delete";

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { variantId: number; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: { variant: ProductVariant; product: Product };
    }
  | {
      type: "SET_CART";
      payload: Cart;
    };

type CartContextType = {
  cart: Cart | null;
  isLoading: boolean;
  updateCartItem: (variantId: number, updateType: UpdateType) => void;
  addCartItem: (variant: ProductVariant, product: Product) => void;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function updateCartItem(
  item: CartItem,
  updateType: UpdateType,
): CartItem | null {
  if (updateType === "delete") return null;

  const newQuantity =
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount =
    Number(item.totalPrice.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemAmount.toString(),
  );

  return {
    ...item,
    quantity: newQuantity,
    totalPrice: {
      ...item.totalPrice,
      amount: newTotalAmount,
    },
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product,
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(
    quantity,
    variant.price.amount,
  );

  return {
    id: existingItem?.id ?? 0,
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      featuredImage: product.images[0],
    },
    variant: {
      id: variant.id ?? 0,
      barcode: variant.barcode,
      title: variant.title,
      sku: variant.sku,
      price: variant.price,
      image: variant.image,
      selectedOptions: variant.selectedOptions,
    },
    quantity,
    unitPrice: variant.price,
    totalPrice: {
      amount: totalAmount,
      currencyCode: variant.price.currencyCode,
    },
  };
}

function recalculateTotals(lines: CartItem[]): Pick<Cart, "itemCount" | "subtotal" | "total"> {
  const itemCount = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.totalPrice.amount),
    0,
  );
  const currencyCode = lines[0]?.totalPrice.currencyCode ?? "VND";

  return {
    itemCount,
    subtotal: { amount: totalAmount.toString(), currencyCode },
    total: { amount: totalAmount.toString(), currencyCode },
  };
}

function createEmptyCart(): Cart {
  return {
    id: 0,
    items: [],
    itemCount: 0,
    subtotal: { amount: "0", currencyCode: "VND" },
    total: { amount: "0", currencyCode: "VND" },
  };
}

function cartReducer(state: Cart | null, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case "SET_CART":
      return action.payload;

    case "UPDATE_ITEM": {
      const { variantId, updateType } = action.payload;
      const updatedItems = currentCart.items
        .map((item) =>
          item.variant.id === variantId
            ? updateCartItem(item, updateType)
            : item,
        )
        .filter(Boolean) as CartItem[];

      if (updatedItems.length === 0) {
        return { ...currentCart, items: [], itemCount: 0, total: { amount: "0", currencyCode: "VND" } };
      }

      return {
        ...currentCart,
        ...recalculateTotals(updatedItems),
        items: updatedItems,
      };
    }

    case "ADD_ITEM": {
      const { variant, product } = action.payload;
      const existingItem = currentCart.items.find(
        (item) => item.variant.id === variant.id,
      );
      const updatedItem = createOrUpdateCartItem(existingItem, variant, product);

      const updatedItems = existingItem
        ? currentCart.items.map((item) =>
            item.variant.id === variant.id ? updatedItem : item,
          )
        : [...currentCart.items, updatedItem];

      return {
        ...currentCart,
        ...recalculateTotals(updatedItems),
        items: updatedItems,
      };
    }

    default:
      return currentCart;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    cart,
    cartReducer,
  );

  useEffect(() => {
    getCart()
      .then((fetchedCart: Cart | null) => {
        setCart(fetchedCart);
      })
      .catch(() => {
        setCart(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const refreshCart = async () => {
    setIsLoading(true);
    try {
      const fetchedCart = await getCart();
      setCart(fetchedCart);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = (variantId: number, updateType: UpdateType) => {
    updateOptimisticCart({ type: "UPDATE_ITEM", payload: { variantId, updateType } });
  };

  const addCartItem = (variant: ProductVariant, product: Product) => {
    updateOptimisticCart({ type: "ADD_ITEM", payload: { variant, product } });
  };

  return (
    <CartContext.Provider
      value={{
        cart: optimisticCart ?? createEmptyCart(),
        isLoading,
        updateCartItem,
        addCartItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
