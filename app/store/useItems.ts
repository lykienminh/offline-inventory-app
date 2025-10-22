import AsyncStorage from "@react-native-async-storage/async-storage";
import randomID from "react-native-uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Draft, Item, ItemId, Patch } from "../types";
import { MOCK_ITEMS } from "./constants";

type ItemsState = {
  items: Item[];
  sortBy: "name" | "updatedAt";
  sortDir: "asc" | "desc";
  search: string;

  // Actions
  hydrate: () => Promise<void>;
  add: (draft: Draft) => Promise<void>;
  update: (id: ItemId, patch: Patch) => Promise<void>;
  remove: (id: ItemId) => Promise<void>;
  setSort: (by: "name" | "updatedAt") => void;
  setSearch: (q: string) => void;
};

const useInventoryStore = create<ItemsState>()(
  persist(
    (set, get) => ({
      items: [...MOCK_ITEMS],
      sortBy: "updatedAt",
      sortDir: "desc",
      search: "",

      hydrate: async () => {
        const state = get();
        set({ ...state });
      },

      add: async (draft) => {
        const newItem: Item = {
          ...draft,
          id: randomID.v4().toString(),
          updatedAt: Date.now(),
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },

      update: async (id, patch) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...patch, updatedAt: Date.now() } : item
          ),
        }));
      },

      remove: async (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      setSort: (by) => {
        set((state) => ({
          sortBy: by,
          sortDir:
            state.sortBy === by
              ? state.sortDir === "asc"
                ? "desc"
                : "asc"
              : "asc",
        }));
      },

      setSearch: (q) => {
        set(() => ({ search: q }));
      },
    }),
    {
      name: "inventory-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
        sortBy: state.sortBy,
        sortDir: state.sortDir,
      }),
    }
  )
);

export default useInventoryStore;
