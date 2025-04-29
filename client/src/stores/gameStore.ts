import { create } from 'zustand';
import { Adventurer, GameEvent, Item, Metadata } from '../types/game';

interface GameState {
  gameId: number | null;
  adventurer: Adventurer | null;
  bag: Item[] | null;
  beastSeed: bigint | null;
  marketSeed: bigint | null;
  metadata: Metadata | null;
  gameEvent: GameEvent | null;
  keepScreen: boolean;

  setGameId: (gameId: number) => void;
  exitGame: () => void;

  setAdventurer: (data: Adventurer | null) => void;
  setBag: (data: Item[] | null) => void;
  setEntropy: (data: any) => void;
  setMetadata: (data: Metadata | null) => void;
  setGameEvent: (data: GameEvent | null) => void;
  setKeepScreen: (screen: boolean) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameId: null,
  metadata: null,
  adventurer: null,
  bag: null,
  beastSeed: null,
  marketSeed: null,
  gameEvent: null,
  keepScreen: false,

  setGameId: (gameId: number) => {
    set({ gameId });
  },
  exitGame: () => {
    set({
      gameId: null,
      adventurer: null,
      bag: null,
      beastSeed: null,
      marketSeed: null,
      metadata: null,
      keepScreen: false,
    });
  },

  setAdventurer: (data: Adventurer | null) => set({ adventurer: data }),
  setBag: (data: Item[] | null) => set({ bag: data }),
  setEntropy: (data: any) => {
    set({
      beastSeed: data.beast_seed,
      marketSeed: data.market_seed,
    });
  },
  setMetadata: (data: Metadata | null) => set({ metadata: data }),
  setGameEvent: (data: GameEvent | null) => set({ gameEvent: data }),
  setKeepScreen: (screen: boolean) => set({ keepScreen: screen }),
}));
