import { create } from 'zustand';

export interface GameToken {
    adventurer_id: number;
    player_name: string;
    settings_id: number;
    available_at: number;
    expires_at: number;
    xp: number;
    health: number;
}

interface AccountState {
    gameTokens: GameToken[] | null;
    lastMintedToken: GameToken | null;

    setGameTokens: (gameTokens: GameToken[]) => void;
    setLastMintedToken: (lastMintedToken: GameToken) => void;
}

export const useAccountStore = create<AccountState>((set, get) => ({
    gameTokens: [],
    lastMintedToken: null,

    setGameTokens: (gameTokens: GameToken[]) => {
        set({ gameTokens });
    },
    setLastMintedToken: (lastMintedToken: GameToken) => {
        set({ lastMintedToken });
    },
}));
