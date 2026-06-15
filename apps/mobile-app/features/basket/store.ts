import { create } from "zustand";
import { Product, BasketItem } from "@/types/database";

// import { persist, createJSONStorage } from "zustand/middleware";
// import AsyncStorage from "@react-native-async-storage/async-storage";

//TODO: Add persistence with AsyncStorage.

type BasketStore = {
  items: BasketItem[];

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearBasket: () => void;
  total: () => number;
  itemCount: () => number;
};

export const useBasketStore = create<BasketStore>()(
  // persist(
  (set, get) => ({
    items: [],

    addItem: (product, quantity = 1) => {
      const currentItems = get().items;
      const existingItem = currentItems.find(
        (item) => item.product_id === product.id,
      );

      if (existingItem) {
        // Update quantity if item exists
        set({
          items: currentItems.map((item) =>
            item.product_id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        });
      } else {
        // Add new item
        set({
          items: [
            ...currentItems,
            {
              product_id: product.id,
              product: {
                name: product.name,
                price: product.price,
                image_url: product.image_url,
              },
              quantity,
            },
          ],
        });
      }
    },

    removeItem: (productId) => {
      set({
        items: get().items.filter((item) => item.product_id !== productId),
      });
    },

    updateQuantity: (productId, quantity) => {
      if (quantity <= 0) {
        get().removeItem(productId);
        return;
      }

      set({
        items: get().items.map((item) =>
          item.product_id === productId ? { ...item, quantity } : item,
        ),
      });
    },

    clearBasket: () => {
      set({ items: [] });
    },

    total: () => {
      return get().items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );
    },

    itemCount: () => {
      return get().items.reduce((count, item) => count + item.quantity, 0);
    },
  }),
  /* 
  {
      name: "basket-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
  */
);
