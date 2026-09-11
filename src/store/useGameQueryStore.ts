import { create } from 'zustand'
import type GameQuery from '../entities/GameQuery'

interface GameQueryStore {
  gameQuery: GameQuery
  setSearchText: (searchText: string) => void
  setGenreId: (genreId: number | undefined) => void
  setPlatformId: (platformId: number | undefined) => void
  setSortOrder: (sortOrder: string) => void
}

// ponytail: search resets other filters so queryKey is search-only; empty search -> {}
export const useGameQueryStore = create<GameQueryStore>()((set) => ({
  gameQuery: {},
  setSearchText: (searchText) =>
    set(
      searchText?.trim()
        ? { gameQuery: { searchText: searchText.trim() } }
        : { gameQuery: {} }
    ),
  setGenreId: (genreId) =>
    set((s) => ({ gameQuery: { ...s.gameQuery, genreId } })),
  setPlatformId: (platformId) =>
    set((s) => ({ gameQuery: { ...s.gameQuery, platformId } })),
  setSortOrder: (sortOrder) =>
    set((s) => ({ gameQuery: { ...s.gameQuery, sortOrder } })),
}))
