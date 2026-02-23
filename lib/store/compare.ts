import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE = 4;

interface CompareStore {
  items: string[];
  addItem: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => boolean;
  isInCompare: (productId: string) => boolean;
  clearAll: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId: string) => {
        const { items } = get();
        if (items.includes(productId)) return true;
        if (items.length >= MAX_COMPARE) return false;
        set({ items: [...items, productId] });
        return true;
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));
      },

      toggleItem: (productId: string) => {
        const { items } = get();
        if (items.includes(productId)) {
          get().removeItem(productId);
          return true;
        }
        return get().addItem(productId);
      },

      isInCompare: (productId: string) => {
        return get().items.includes(productId);
      },

      clearAll: () => set({ items: [] }),
    }),
    {
      name: "compare-storage",
    }
  )
);
