import { create } from 'zustand';
import { Adventurer, Beast, Item, Metadata } from '../types/game';
import { GameEvent } from '@/utils/events';
import { ItemUtils } from '@/utils/loot';

interface GameState {
  gameId: number | null;
  adventurer: Adventurer | null;
  bag: Item[];
  beast: Beast | null;
  marketSeed: bigint | null;
  newMarket: boolean;
  metadata: Metadata | null;
  exploreLog: GameEvent[];
  battleEvent: GameEvent | null;
  equipItems: Item[];
  dropItems: Item[];

  setGameId: (gameId: number) => void;
  exitGame: () => void;
  setAdventurer: (data: Adventurer | null) => void;
  setBag: (data: Item[]) => void;
  setBeast: (data: Beast | null) => void;
  setMarketSeed: (data: bigint | null) => void;
  setNewMarket: (data: boolean) => void;
  setMetadata: (data: Metadata | null) => void;
  setExploreLog: (data: GameEvent) => void;
  setBattleEvent: (data: GameEvent | null) => void;
  equipItem: (data: Item) => void;
  dropItem: (data: Item) => void;
  undoDropItem: (data: Item) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameId: null,
  metadata: null,
  adventurer: null,
  bag: [],
  beast: null,
  marketSeed: null,
  newMarket: false,
  exploreLog: [],
  battleEvent: null,
  equipItems: [],
  dropItems: [],

  setGameId: (gameId: number) => {
    set({ gameId });
  },
  exitGame: () => {
    set({
      gameId: null,
      adventurer: null,
      bag: [],
      beast: null,
      marketSeed: null,
      newMarket: false,
      metadata: null,
      exploreLog: [],
      battleEvent: null,
      equipItems: [],
      dropItems: [],
    });
  },

  setAdventurer: (data: Adventurer | null) => set({ adventurer: data }),
  setBag: (data: Item[]) => set({ bag: data }),
  setBeast: (data: Beast | null) => set({ beast: data }),
  setMarketSeed: (data: bigint | null) => set({ marketSeed: data }),
  setNewMarket: (data: boolean) => set({ newMarket: data }),
  setMetadata: (data: Metadata | null) => set({ metadata: data }),
  setExploreLog: (data: GameEvent) => set((state) => ({ exploreLog: [data, ...state.exploreLog] })),
  setBattleEvent: (data: GameEvent | null) => set({ battleEvent: data }),

  equipItem: (data: Item) => {
    let itemSlot = ItemUtils.getItemSlot(data.id);
    set((state) => {
      if (!state.adventurer) {
        return state;
      }
      return {
        adventurer: {
          ...state.adventurer,
          equipment: {
            ...state.adventurer.equipment,
            [itemSlot]: data
          }
        },
        equipItems: [data, ...state.equipItems.filter(item => ItemUtils.getItemSlot(item.id) !== itemSlot)]
      };
    });
  },

  dropItem: (data: Item) => {
    set((state) => ({
      dropItems: [data, ...state.dropItems.filter(item => item.id !== data.id)]
    }));
  },

  undoDropItem: (data: Item) => {
    set((state) => ({
      dropItems: state.dropItems.filter(item => item.id !== data.id)
    }));
  },
}));
