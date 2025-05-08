import { create } from 'zustand';
import { Adventurer, Beast, Equipment, Item, Metadata } from '../types/game';
import { GameEvent } from '@/utils/events';
import { ItemUtils } from '@/utils/loot';
import { getNewItemsEquipped } from '@/utils/game';

interface GameState {
  gameId: number | null;
  adventurer: Adventurer | null;
  equipment: Equipment | null;
  bag: Item[];
  beast: Beast | null;
  newMarket: boolean;
  marketItemIds: number[];
  newInventoryItems: number[];
  metadata: Metadata | null;
  exploreLog: GameEvent[];
  battleEvent: GameEvent | null;
  dropItems: Item[];

  setGameId: (gameId: number) => void;
  exitGame: () => void;
  setAdventurer: (data: Adventurer | null) => void;
  setEquipment: (data: Equipment | null) => void;
  setBag: (data: Item[]) => void;
  setBeast: (data: Beast | null) => void;
  setMarketItemIds: (data: number[]) => void;
  setNewMarket: (data: boolean) => void;
  setNewInventoryItems: (data: number[]) => void;
  setMetadata: (data: Metadata | null) => void;
  setExploreLog: (data: GameEvent) => void;
  setBattleEvent: (data: GameEvent | null) => void;
  setDropItems: (data: Item[]) => void;
  equipItem: (data: Item) => void;
  undoEquipment: () => void;
  dropItem: (data: Item) => void;
  undoDropItem: (data: Item) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameId: null,
  metadata: null,
  adventurer: null,
  equipment: null,
  bag: [],
  beast: null,
  newMarket: false,
  marketItemIds: [],
  newInventoryItems: [],
  exploreLog: [],
  battleEvent: null,
  dropItems: [],

  setGameId: (gameId: number) => {
    set({ gameId });
  },
  exitGame: () => {
    set({
      gameId: null,
      adventurer: null,
      equipment: null,
      bag: [],
      beast: null,
      newMarket: false,
      marketItemIds: [],
      newInventoryItems: [],
      metadata: null,
      exploreLog: [],
      battleEvent: null,
      dropItems: [],
    });
  },

  setAdventurer: (data: Adventurer | null) => set((state) => {
    if (!data || !state.adventurer) {
      return { adventurer: data };
    }

    if (data.xp < state.adventurer.xp) {
      return state;
    }

    if (data.xp === state.adventurer.xp && data.beast_health === 0 && state.adventurer?.beast_health !== 0) {
      return state;
    }

    if (data.beast_health === 0) {
      return {
        adventurer: data,
        equipment: data.equipment,
        beast: null,
        battleEvent: null
      };
    }

    return { adventurer: data, equipment: data.equipment };
  }),
  setEquipment: (data: Equipment | null) => set({ equipment: data }),
  setBag: (data: Item[]) => set({ bag: data }),
  setBeast: (data: Beast | null) => set({ beast: data }),
  setMarketItemIds: (data: number[]) => set({ marketItemIds: data }),
  setNewMarket: (data: boolean) => set({ newMarket: data }),
  setMetadata: (data: Metadata | null) => set({ metadata: data }),
  setNewInventoryItems: (data: number[]) => set({ newInventoryItems: data }),
  setExploreLog: (data: GameEvent) => set((state) => ({ exploreLog: [data, ...state.exploreLog] })),
  setBattleEvent: (data: GameEvent | null) => set({ battleEvent: data }),
  setDropItems: (data: Item[]) => set({ dropItems: data }),

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
      };
    });
  },

  undoEquipment: () => {
    set((state) => {
      if (!state.adventurer || !state.equipment) {
        return state;
      }

      // Get the currently equipped item in this slot (if any)
      const newItemsEquipped = getNewItemsEquipped(state.adventurer?.equipment!, state.equipment!);

      // restore the bag
      const updatedBag = [
        ...state.bag.filter(item => !Object.values(state.equipment!).find(newItem => newItem.id === item.id)),
        ...newItemsEquipped,
      ];

      return {
        adventurer: {
          ...state.adventurer,
          equipment: state.equipment,
        },
        bag: updatedBag,
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
