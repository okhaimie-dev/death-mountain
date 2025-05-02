import { create } from 'zustand';
import { Adventurer, Item, Metadata } from '../types/game';
import { BattleEvent, ExploreEvent } from '../utils/events';

interface GameState {
  gameId: number | null;
  newGame: boolean;
  adventurer: Adventurer | null;
  bag: Item[] | null;
  beastSeed: bigint | null;
  marketSeed: bigint | null;
  metadata: Metadata | null;
  exploreLog: ExploreEvent[];
  battleLog: BattleEvent[];
  keepScreen: boolean;

  setGameId: (gameId: number) => void;
  setNewGame: (newGame: boolean) => void;
  exitGame: () => void;

  setAdventurer: (data: Adventurer | null) => void;
  setBag: (data: Item[] | null) => void;
  setEntropy: (data: any) => void;
  setMetadata: (data: Metadata | null) => void;
  setExploreLog: (data: ExploreEvent[]) => void;
  setBattleLog: (data: BattleEvent[]) => void;
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
  keepScreen: false,
  exploreLog: [],
  battleLog: [],

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
      keepScreen: false,
      exploreLog: [],
      battleLog: [],
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
  setExploreLog: (data: ExploreEvent[]) => set((state) => ({ exploreLog: [...data, ...state.exploreLog] })),
  setBattleLog: (data: BattleEvent[]) => set({ battleLog: data }),
  setKeepScreen: (screen: boolean) => set({ keepScreen: screen }),
}));
