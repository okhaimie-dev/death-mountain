import { create } from 'zustand'

interface UIState {
  isGameSettingsOpen: boolean
  setGameSettingsOpen: (isOpen: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isGameSettingsOpen: false,
  setGameSettingsOpen: (isOpen) => set({ isGameSettingsOpen: isOpen }),
}))
