
"use client";

import { create } from "zustand";
import type { ApiCartItem, ApiCartResponse } from "@/src/types/cart";

type CartStore = {
  items: ApiCartItem[];
  isLoading: boolean;
  error: string | null;

  loadCart: () => Promise<void>;
  addItem: (productVariantId: string, quantity?: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;

  getTotalItems: () => number;
  getSubtotal: () => number;
};

async function readError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string; message?: string };
    return data.error || data.message || "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  loadCart: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/cart", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401) {
          set({ items: [], isLoading: false, error: "Sign in to view your cart." });
          return;
        }

        throw new Error(await readError(response));
      }

      const cart = (await response.json()) as ApiCartResponse;
      set({ items: cart.items, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unable to load cart.",
      });
    }
  },

  addItem: async (productVariantId, quantity = 1) => {
    set({ error: null });

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productVariantId, quantity }),
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      await get().loadCart();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to add item to cart.";
      set({ error: message });
      throw error;
    }
  },

  removeItem: async (id) => {
    set({ error: null });

    try {
      const response = await fetch(`/api/cart/items/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      await get().loadCart();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to remove item.";
      set({ error: message });
      throw error;
    }
  },

  updateQuantity: async (id, quantity) => {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return;
    }

    set({ error: null });

    try {
      const response = await fetch(`/api/cart/items/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      await get().loadCart();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update quantity.";
      set({ error: message });
      throw error;
    }
  },

  clearCart: () => set({ items: [], error: null }),

  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),

  getSubtotal: () =>
    get().items.reduce((total, item) => total + item.lineTotal, 0),
}));