import { create } from 'zustand';
import { Adventurer, Beast, Item, Metadata } from '../types/game';
import { GameEvent } from '@/utils/events';
import { ItemUtils } from '@/utils/loot';
import { getNewItemsEquipped } from '@/utils/game';

interface GameState {
  gameId: number | null;
  adventurer: Adventurer | null;
  adventurerState: Adventurer | null;
  bag: Item[];
  beast: Beast | null;
  showBeastRewards: boolean;
  newMarket: boolean;
  marketItemIds: number[];
  newInventoryItems: number[];
  metadata: Metadata | null;
  exploreLog: GameEvent[];
  battleEvent: GameEvent | null;

  setGameId: (gameId: number) => void;
  exitGame: () => void;
  setAdventurer: (data: Adventurer | null) => void;
  setAdventurerState: (data: Adventurer | null) => void;
  setBag: (data: Item[]) => void;
  setBeast: (data: Beast | null) => void;
  setShowBeastRewards: (data: boolean) => void;
  setMarketItemIds: (data: number[]) => void;
  setNewMarket: (data: boolean) => void;
  setNewInventoryItems: (data: number[]) => void;
  setMetadata: (data: Metadata | null) => void;
  setExploreLog: (data: GameEvent) => void;
  setBattleEvent: (data: GameEvent | null) => void;
  equipItem: (data: Item) => void;
  undoEquipment: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameId: null,
  metadata: null,
  adventurer: null,
  adventurerState: null,
  bag: [],
  beast: null,
  showBeastRewards: false,
  newMarket: false,
  marketItemIds: [],
  newInventoryItems: [],
  exploreLog: [],
  battleEvent: null,

  setGameId: (gameId: number) => {
    set({ gameId });
  },
  exitGame: () => {
    set({
      gameId: null,
      adventurer: null,
      adventurerState: null,
      bag: [],
      beast: null,
      showBeastRewards: false,
      newMarket: false,
      marketItemIds: [],
      newInventoryItems: [],
      metadata: null,
      exploreLog: [],
      battleEvent: null,
    });
  },

  setAdventurer: (data: Adventurer | null) => set((state) => {
    if (!data || !state.adventurer) {
      return { adventurer: data, adventurerState: data };
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
        adventurerState: data,
        beast: null,
        battleEvent: null
      };
    }

    return { adventurer: data, adventurerState: data };
  }),
  setAdventurerState: (data: Adventurer | null) => set({ adventurerState: data }),
  setBag: (data: Item[]) => set({ bag: data }),
  setBeast: (data: Beast | null) => set({ beast: data }),
  setShowBeastRewards: (data: boolean) => set({ showBeastRewards: data }),
  setMarketItemIds: (data: number[]) => set({ marketItemIds: data }),
  setNewMarket: (data: boolean) => set({ newMarket: data }),
  setMetadata: (data: Metadata | null) => set({ metadata: data }),
  setNewInventoryItems: (data: number[]) => set({ newInventoryItems: data }),
  setExploreLog: (data: GameEvent) => set((state) => ({ exploreLog: [data, ...state.exploreLog] })),
  setBattleEvent: (data: GameEvent | null) => set({ battleEvent: data }),

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

      let updatedStats = { ...state.adventurer.stats };
      if (currentEquippedItem) {
        updatedStats = ItemUtils.removeItemBoosts(currentEquippedItem, state.adventurer.item_specials_seed, updatedStats);
      }
      updatedStats = ItemUtils.addItemBoosts(data, state.adventurer.item_specials_seed, updatedStats);

      return {
        adventurer: {
          ...state.adventurer,
          equipment: {
            ...state.adventurer.equipment,
            [itemSlot]: data
          },
          stats: updatedStats,
        },
        bag: updatedBag,
      };
    });
  },

  undoEquipment: () => {
    set((state) => {
      if (!state.adventurer || !state.adventurerState) {
        return state;
      }

      // Get the currently equipped item in this slot (if any)
      const newItemsEquipped = getNewItemsEquipped(state.adventurer?.equipment!, state.adventurerState?.equipment!);

      // restore the bag
      const updatedBag = [
        ...state.bag.filter(item => !Object.values(state.adventurerState?.equipment!).find(newItem => newItem.id === item.id)),
        ...newItemsEquipped,
      ];

      return {
        adventurer: {
          ...state.adventurer,
          equipment: state.adventurerState?.equipment,
        },
        stats: state.adventurerState?.stats,
        bag: updatedBag,
      };
    });
  },
}));
