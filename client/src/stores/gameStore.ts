import { create } from 'zustand';
import { Adventurer, Beast, Item, Metadata } from '../types/game';
import { GameEvent } from '@/utils/events';
import { ItemUtils } from '@/utils/loot';

interface GameState {
  gameId: number | null;
  adventurer: Adventurer | null;
  bag: Item[];
  beast: Beast | null;
  newMarket: boolean;
  marketItemIds: number[];
  newInventoryItems: number[];
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
  setMarketItemIds: (data: number[]) => void;
  setNewMarket: (data: boolean) => void;
  setNewInventoryItems: (data: number[]) => void;
  setMetadata: (data: Metadata | null) => void;
  setExploreLog: (data: GameEvent) => void;
  setBattleEvent: (data: GameEvent | null) => void;
  setDropItems: (data: Item[]) => void;
  setEquipItems: (data: Item[]) => void;
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
  newMarket: false,
  marketItemIds: [],
  newInventoryItems: [],
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
      newMarket: false,
      marketItemIds: [],
      newInventoryItems: [],
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
  setMarketItemIds: (data: number[]) => set({ marketItemIds: data }),
  setNewMarket: (data: boolean) => set({ newMarket: data }),
  setMetadata: (data: Metadata | null) => set({ metadata: data }),
  setNewInventoryItems: (data: number[]) => set({ newInventoryItems: data }),
  setExploreLog: (data: GameEvent) => set((state) => ({ exploreLog: [data, ...state.exploreLog] })),
  setBattleEvent: (data: GameEvent | null) => set({ battleEvent: data }),
  setDropItems: (data: Item[]) => set({ dropItems: data }),
  setEquipItems: (data: Item[]) => set({ equipItems: data }),

  equipItem: (data: Item) => {
    let itemSlot = ItemUtils.getItemSlot(data.id).toLowerCase() as keyof Adventurer['equipment'];
    set((state) => {
      if (!state.adventurer) {
        return state;
      }
      // Get the currently equipped item in this slot (if any)
      const currentEquippedItem = state.adventurer.equipment[itemSlot];
      
      // Remove the new item from the bag
      const updatedBag = state.bag.filter(item => item.id !== data.id);
      
      // If there was an item equipped in this slot, add it back to the bag
      if (currentEquippedItem && currentEquippedItem.id !== 0) {
        updatedBag.push(currentEquippedItem);
      }
      
      return {
        adventurer: {
          ...state.adventurer,
          equipment: {
            ...state.adventurer.equipment,
            [itemSlot]: data
          }
        },
        bag: updatedBag,
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
