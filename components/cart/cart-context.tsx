"use client";

import {
  createContext,
  useContext,
  useOptimistic,
  useState,
  useEffect,
  useCallback,
  useRef,
  useTransition,
  type ReactNode,
} from "react";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  calculateCartPricing,
} from "@/services/rest-api/cart/cart";
import type { Cart, CartItem, PromotionNearMiss } from "@/types/cart";

type CartContextType = {
  cart: Cart | null;
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  refreshCart: () => Promise<void>;
  /** Gần đạt ngưỡng khuyến mãi (sau lần tính giá gần nhất) */
  promotionNearMisses: PromotionNearMiss[];
  addItem: (variantSku: string, quantity?: number) => void;
  updateItem: (variantSku: string, quantity: number) => void;
  removeItem: (variantSku: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── Optimistic reducer ──────────────────────────────────────────────────────

type CartAction =
  | { type: "SET_CART"; payload: Cart }
  | { type: "OPTIMISTIC_ADD"; payload: CartItem }
  | { type: "OPTIMISTIC_UPDATE"; payload: { variantSku: string; quantity: number } }
  | { type: "OPTIMISTIC_REMOVE"; payload: { variantSku: string } };

function cartReducer(state: Cart | null, action: CartAction): Cart | null {
  if (!state) return null;

  switch (action.type) {
    case "SET_CART":
      return action.payload;

    case "OPTIMISTIC_ADD": {
      const newItem = action.payload;
      const existing = state.items.find((i) => i.variantSku === newItem.variantSku);
      const items = existing
        ? state.items.map((i) =>
            i.variantSku === newItem.variantSku
              ? { ...i, quantity: i.quantity + newItem.quantity }
              : i,
          )
        : [...state.items, newItem];
      return recalc(state, items);
    }

    case "OPTIMISTIC_UPDATE": {
      const { variantSku, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: "OPTIMISTIC_REMOVE", payload: { variantSku } });
      }
      const items = state.items.map((i) =>
        i.variantSku === variantSku ? { ...i, quantity } : i,
      );
      return recalc(state, items);
    }

    case "OPTIMISTIC_REMOVE": {
      const items = state.items.filter((i) => i.variantSku !== action.payload.variantSku);
      return recalc(state, items);
    }

    default:
      return state;
  }
}

function recalc(cart: Cart, items: CartItem[]): Cart {
  const updatedItems = items.map((item) => ({
    ...item,
    lineTotal: item.unitPrice * item.quantity,
  }));

  const itemCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalUnits = itemCount;
  const subtotal = updatedItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const totalAfterDiscount = cart.discountAmount
    ? subtotal - cart.discountAmount
    : subtotal;

  return { ...cart, items: updatedItems, itemCount, totalUnits, subtotal, totalAfterDiscount };
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [promotionNearMisses, setPromotionNearMisses] = useState<PromotionNearMiss[]>([]);
  const [optimisticCart, dispatch] = useOptimistic(cart, cartReducer);
  const [, startTransition] = useTransition();

  const prevCountRef = useRef(0);

  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const fresh = await getCart();
      setCart(fresh);
      if (fresh?.items?.length) {
        try {
          const pricing = await calculateCartPricing(fresh.appliedDiscountCode);
          setPromotionNearMisses(pricing.promotionNearMisses ?? []);
        } catch {
          setPromotionNearMisses([]);
        }
      } else {
        setPromotionNearMisses([]);
      }
    } catch {
      setCart(null);
      setPromotionNearMisses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  useEffect(() => {
    if (!optimisticCart) return;
    const count = optimisticCart.itemCount ?? 0;
    const prev = prevCountRef.current;
    prevCountRef.current = count;
    if (prev === 0 && count > 0 && !isOpen) {
      setIsOpen(true);
    }
  }, [optimisticCart?.itemCount, isOpen]);

  const recalculatePricingAndRefresh = useCallback(async (fallbackCart: Cart) => {
    try {
      const pricing = await calculateCartPricing(fallbackCart.appliedDiscountCode);
      setPromotionNearMisses(pricing.promotionNearMisses ?? []);
      const refreshed = await getCart();
      setCart(refreshed ?? fallbackCart);
    } catch {
      setCart(fallbackCart);
      setPromotionNearMisses([]);
    }
  }, []);

  const addItem = useCallback(
    async (variantSku: string, quantity = 1) => {
      startTransition(async () => {
        dispatch({ type: "OPTIMISTIC_ADD", payload: buildTempItem(variantSku, quantity) });
        try {
          const updated = await addToCart({ variantSku, quantity });
          await recalculatePricingAndRefresh(updated);
        } catch {
          await refreshCart();
        }
      });
    },
    [dispatch, recalculatePricingAndRefresh, refreshCart],
  );

  const removeItem = useCallback(
    async (variantSku: string) => {
      startTransition(async () => {
        dispatch({ type: "OPTIMISTIC_REMOVE", payload: { variantSku } });
        try {
          const updated = await removeFromCart(variantSku);
          await recalculatePricingAndRefresh(updated);
        } catch {
          await refreshCart();
        }
      });
    },
    [dispatch, recalculatePricingAndRefresh, refreshCart],
  );

  const updateItem = useCallback(
    (variantSku: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(variantSku);
        return;
      }
      startTransition(async () => {
        dispatch({ type: "OPTIMISTIC_UPDATE", payload: { variantSku, quantity } });
        try {
          const updated = await updateCartItem(variantSku, quantity);
          await recalculatePricingAndRefresh(updated);
        } catch {
          await refreshCart();
        }
      });
    },
    [dispatch, recalculatePricingAndRefresh, refreshCart, removeItem],
  );

  return (
    <CartContext.Provider
      value={{
        cart: optimisticCart,
        isLoading,
        isOpen,
        setIsOpen,
        refreshCart,
        promotionNearMisses,
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

// ─── Temp item for optimistic update ────────────────────────────────────────

function buildTempItem(variantSku: string, quantity: number): CartItem {
  return {
    id: Math.random(),
    variantSku,
    quantity,
    productName: "",
    productBarcode: "",
    productBasePrice: 0,
    unitPrice: 0,
    lineTotal: 0,
  };
}
