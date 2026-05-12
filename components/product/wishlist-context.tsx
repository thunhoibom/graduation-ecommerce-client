"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { WishlistItem } from "@/types/common";
import type { Product } from "@/types/product";

type WishlistContextType = {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Load from localeStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mono_wishlist");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load wishlist", e);
      }
    }
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    localStorage.setItem("mono_wishlist", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product) => {
    if (!product.id) return;
    if (items.some((i) => i.productId === product.id)) return;

    const newItem: WishlistItem = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      slug: product.barcode, // using barcode as slug for now
      price: product.currentPrice,
      featuredImage: product.images?.[0],
      addedAt: new Date().toISOString(),
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const isInWishlist = (productId: number) => {
    return items.some((i) => i.productId === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (!product.id) return;
    if (isInWishlist(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, clearWishlist, isInWishlist, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
