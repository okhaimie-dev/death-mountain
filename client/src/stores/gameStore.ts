import { create } from 'zustand';
import { setupGameSubscription } from '../dojo/useGameSub';
import { Adventurer, AdventurerEntropy, Bag } from '../types/game';
import { Beast, generateBeast } from '../utils/beast';
import { MarketItem, generateMarketItems } from '../utils/market';

interface GameState {
  gameId: string | null;
  adventurer: Adventurer | null;
  bag: Bag | null;
  entropy: AdventurerEntropy | null;
  beast: Beast | null;
  market: MarketItem[] | null;

  setGameId: (gameId: string) => void;
  exitGame: () => void;

  setAdventurer: (data: Adventurer | null) => void;
  setBag: (data: Bag | null) => void;
  setEntropy: (data: any) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameId: null,
  adventurer: null,
  bag: null,
  entropy: null,
  beast: null,
  market: null,

  setGameId: (gameId: string) => {
    set({ gameId });
    setupGameSubscription(gameId)
  },
  exitGame: () => {
    set({
      gameId: null,
      adventurer: null,
      bag: null,
      beast: null,
      market: null,
      entropy: null,
    });
  },

  setAdventurer: (data: Adventurer | null) => set({ adventurer: data }),
  setBag: (data: Bag | null) => set({ bag: data }),
  setEntropy: (data: any) => {
    set({
      beast: generateBeast(data.beast_seed),
      market: generateMarketItems(BigInt(data.market_seed), get().adventurer?.stat_upgrades_available),
      entropy: data,
    });
  },
}));
