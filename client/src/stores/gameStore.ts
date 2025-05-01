import { create } from 'zustand';
import { Adventurer, GameEvent, Item, Metadata } from '../types/game';

interface GameState {
  gameId: number | null;
  newGame: boolean;
  adventurer: Adventurer | null;
  bag: Item[] | null;
  beastSeed: bigint | null;
  marketSeed: bigint | null;
  metadata: Metadata | null;
  gameEvents: GameEvent[] | null;
  keepScreen: boolean;

  setGameId: (gameId: number) => void;
  setNewGame: (newGame: boolean) => void;
  exitGame: () => void;

  setAdventurer: (data: Adventurer | null) => void;
  setBag: (data: Item[] | null) => void;
  setEntropy: (data: any) => void;
  setMetadata: (data: Metadata | null) => void;
  setGameEvents: (data: GameEvent[] | null) => void;
  setKeepScreen: (screen: boolean) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameId: null,
  newGame: false,
  metadata: null,
  adventurer: null,
  bag: null,
  beastSeed: null,
  marketSeed: null,
  gameEvents: null,
  keepScreen: false,

  setGameId: (gameId: number) => {
    set({ gameId });
  },
  setNewGame: (newGame: boolean) => set({ newGame }),
  exitGame: () => {
    set({
      gameId: null,
      newGame: false,
      adventurer: null,
      bag: null,
      beastSeed: null,
      marketSeed: null,
      metadata: null,
      gameEvents: null,
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
  setGameEvents: (data: GameEvent[] | null) => set({ gameEvents: data }),
  setKeepScreen: (screen: boolean) => set({ keepScreen: screen }),
}));
