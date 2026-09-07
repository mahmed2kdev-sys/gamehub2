import { create } from 'zustand'
import type { GameQuery } from '../entities/GameQuery'

interface GameQueryStore {
  gameQuery: GameQuery
  setSearchText: (searchText: string) => void
  setGenreId: (genreId: number | undefined) => void
  setPlatformId: (platformId: number | undefined) => void
  setSortOrder: (sortOrder: string) => void
}

// ponytail: 4 explicit setters, no persist/devtools until needed
export const useGameQueryStore = create<GameQueryStore>()((set) => ({
  gameQuery: { sortOrder: "", searchText: "" },
  setSearchText: (searchText) =>
    set((s) => ({ gameQuery: { ...s.gameQuery, searchText } })),
  setGenreId: (genreId) =>
    set((s) => ({ gameQuery: { ...s.gameQuery, genreId } })),
  setPlatformId: (platformId) =>
    set((s) => ({ gameQuery: { ...s.gameQuery, platformId } })),
  setSortOrder: (sortOrder) =>
    set((s) => ({ gameQuery: { ...s.gameQuery, sortOrder } })),
}))
