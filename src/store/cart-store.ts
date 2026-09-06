import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductVariant } from "@/src/components/products/data";

export type CartItem = {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  customText: string;
};

type CartStore = {
 items: CartItem[];

  addItem: (
    product: Product,
    variant: ProductVariant,
    quantity: number,
    customText: string
  ) => void;

  removeItem: (id: string) => void;

  updateQuantity: (id: string, quantity: number) => void;

  clearCart: () => void;

  getTotalItems: () => number;

  getSubtotal: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant, quantity, customText) => {
        const itemId = `${product.id}-${variant.color}-${customText.trim()}`;

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === itemId
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                    }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: itemId,
                product,
                variant,
                quantity,
                customText: customText.trim(),
              },
            ],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity,
                }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce(
          (total, item) => total + item.quantity,
          0
        );
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "mortiforge-cart",
    }
  )
);