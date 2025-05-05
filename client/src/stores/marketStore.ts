import { create } from 'zustand';
import { MarketItem } from '@/utils/market';

interface MarketState {
  cart: {
    potions: number;
    items: MarketItem[];
  };
  slotFilter: string | null;
  typeFilter: string | null;

  setSlotFilter: (filter: string | null) => void;
  setTypeFilter: (filter: string | null) => void;
  addToCart: (item: MarketItem) => void;
  removeFromCart: (item: MarketItem) => void;
  setPotions: (count: number) => void;
  clearCart: () => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  cart: {
    potions: 0,
    items: [],
  },
  slotFilter: null,
  typeFilter: null,

  setSlotFilter: (filter) => set({ slotFilter: filter }),
  setTypeFilter: (filter) => set({ typeFilter: filter }),
  addToCart: (item) => set((state) => ({
    cart: {
      ...state.cart,
      items: [...state.cart.items, item],
    },
  })),
  removeFromCart: (item) => set((state) => ({
    cart: {
      ...state.cart,
      items: state.cart.items.filter((i) => i.id !== item.id),
    },
  })),
  setPotions: (count) => set((state) => ({
    cart: {
      ...state.cart,
      potions: count,
    },
  })),
  clearCart: () => set({
    cart: {
      potions: 0,
      items: [],
    },
  }),
})); 