import { create } from 'zustand'

interface UIState {
  isGameSettingsOpen: boolean
  setGameSettingsOpen: (isOpen: boolean) => void
  isGameSettingsDialogOpen: boolean
  setGameSettingsDialogOpen: (isOpen: boolean) => void
  gameSettingsMode: 'create' | 'view' | false
  setGameSettingsMode: (mode: 'create' | 'view' | false) => void
  selectedSettingsId?: number
  setSelectedSettingsId: (id?: number) => void
}

export const useUIStore = create<UIState>((set) => ({
  isGameSettingsOpen: false,
  setGameSettingsOpen: (isOpen) => set({ isGameSettingsOpen: isOpen }),
  isGameSettingsDialogOpen: false,
  setGameSettingsDialogOpen: (isOpen) => set({ isGameSettingsDialogOpen: isOpen }),
  gameSettingsMode: false,
  setGameSettingsMode: (mode) => set({ gameSettingsMode: mode }),
  selectedSettingsId: undefined,
  setSelectedSettingsId: (id) => set({ selectedSettingsId: id })
}))
