import { create } from 'zustand';
import { Adventurer, GameEvent, Item, Metadata } from '../types/game';

interface GameState {
  gameId: number | null;
  adventurer: Adventurer | null;
  bag: Item[] | null;
  beastSeed: number | null;
  marketSeed: number | null;
  metadata: Metadata | null;
  gameEvent: GameEvent | null;

  setGameId: (gameId: number) => void;
  exitGame: () => void;

  setAdventurer: (data: Adventurer | null) => void;
  setBag: (data: Item[] | null) => void;
  setEntropy: (data: any) => void;
  setMetadata: (data: Metadata | null) => void;
  setGameEvent: (data: GameEvent | null) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameId: null,
  metadata: null,
  adventurer: null,
  bag: null,
  beastSeed: null,
  marketSeed: null,
  gameEvent: null,

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
}));
