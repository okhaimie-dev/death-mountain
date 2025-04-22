import { create } from 'zustand';
import { Adventurer, AdventurerEntropy, Item, Beast, Metadata } from '../types/game';
import { getBeast } from '../utils/beast';
import { MarketItem, generateMarketItems } from '../utils/market';

interface GameState {
  gameId: number | null;
  adventurer: Adventurer | null;
  bag: Item[] | null;
  entropy: AdventurerEntropy | null;
  beast: Beast | null;
  market: MarketItem[] | null;
  metadata: Metadata | null;

  setGameId: (gameId: number) => void;
  exitGame: () => void;

  setAdventurer: (data: Adventurer | null) => void;
  setBag: (data: Item[] | null) => void;
  setEntropy: (data: any) => void;
  setMetadata: (data: Metadata | null) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameId: null,
  metadata: null,
  adventurer: null,
  bag: null,
  entropy: null,
  beast: null,
  market: null,

  setGameId: (gameId: number) => {
    set({ gameId });
  },
  exitGame: () => {
    set({
      gameId: null,
      adventurer: null,
      bag: null,
      beast: null,
      market: null,
      entropy: null,
      metadata: null,
    });
  },

  setAdventurer: (data: Adventurer | null) => set({ adventurer: data }),
  setBag: (data: Item[] | null) => set({ bag: data }),
  setEntropy: (data: any) => {
    let adventurer = get().adventurer;
    if (adventurer) {
      set({
        beast: getBeast(BigInt(data.beast_seed), adventurer.xp),
        market: generateMarketItems(BigInt(data.market_seed), adventurer.stat_upgrades_available),
        entropy: data,
      });
    }
  },
  setMetadata: (data: Metadata | null) => set({ metadata: data }),
}));
