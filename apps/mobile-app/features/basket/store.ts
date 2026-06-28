import { create } from "zustand";
import type { Product } from "@/types/database";

export type BasketItem = {
  product: Product;
  quantity: number;
  selectedSize: "Small" | "Large" | null; // null = no variants
  resolvedPrice: number; // the actual price paid
  basketItemId: string; // unique per product+size combo
};

type BasketStore = {
  items: BasketItem[];
  addItem: (product: Product, selectedSize: "Small" | "Large" | null) => void;
  removeItem: (basketItemId: string) => void;
  incrementItem: (basketItemId: string) => void;
  decrementItem: (basketItemId: string) => void;
  clearBasket: () => void;
  total: () => number;
  itemCount: () => number;
};

function resolvePrice(
  product: Product,
  size: "Small" | "Large" | null,
): number {
  if (size === "Large" && product.large_price != null) {
    return product.large_price;
  }
  return product.price;
}

function makeBasketItemId(productId: string, size: "Small" | "Large" | null) {
  return size ? `${productId}-${size}` : productId;
}

export const useBasketStore = create<BasketStore>((set, get) => ({
  items: [],

  addItem: (product, selectedSize) => {
    const basketItemId = makeBasketItemId(product.id, selectedSize);
    const existing = get().items.find((i) => i.basketItemId === basketItemId);

    if (existing) {
      set((state) => ({
        items: state.items.map((i) =>
          i.basketItemId === basketItemId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        ),
      }));
    } else {
      set((state) => ({
        items: [
          ...state.items,
          {
            product,
            quantity: 1,
            selectedSize,
            resolvedPrice: resolvePrice(product, selectedSize),
            basketItemId,
          },
        ],
      }));
    }
  },

  removeItem: (basketItemId) => {
    set((state) => ({
      items: state.items.filter((i) => i.basketItemId !== basketItemId),
    }));
  },

  incrementItem: (basketItemId) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.basketItemId === basketItemId
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      ),
    }));
  },

  decrementItem: (basketItemId) => {
    set((state) => ({
      items: state.items
        .map((i) =>
          i.basketItemId === basketItemId
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        )
        .filter((i) => i.quantity > 0),
    }));
  },

  clearBasket: () => set({ items: [] }),

  total: () =>
    get().items.reduce((sum, i) => sum + i.resolvedPrice * i.quantity, 0),

  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
