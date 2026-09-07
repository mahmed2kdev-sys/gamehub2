# Feature: Zustand Game Query Store

## 1. Purpose

Centralizes client filter state (`GameQuery`: `genreId`, `platformId`, `sortOrder`, `searchText`) in a zustand store, replacing `useState<GameQuery>` in `App.tsx` plus prop-drilling to 6 consumer components.

Why it was needed: every filter change re-rendered `App` and re-spread `{ ...gameQuery }` from a potentially stale closure across `NavBar`, `GenreList`, `PlatformSelector`, `SortSelector`, `GameGrid`, and `GameHeading`.

Problem it solves: single source of truth for filters with selective subscriptions, eliminating prop chains and stale-spread bugs. Server state (TanStack Query) is intentionally untouched.

## 2. Requirements

Required behavior:
- Store holds the 4 `GameQuery` fields with initial `{ sortOrder: "", searchText: "" }`.
- 4 explicit setters (`setSearchText`, `setGenreId`, `setPlatformId`, `setSortOrder`) that merge one field via `set((s) => ({ gameQuery: { ...s.gameQuery, X } }))`.
- `App.tsx` renders all consumers with zero props (no `useState`, no `GameQuery` import).
- Each consumer subscribes selectively (field selector + action selector), except `GameGrid` which needs the full object as the React Query `queryKey`.

Optional behavior (explicitly out of scope):
- `persist` / devtools middleware, generic `setQuery(Partial<GameQuery>)`, URL-sync / deep-linking, combining server state into zustand, GenreList deselect toggle, search debounce, `GameHeading` searchText display.

Constraints / assumptions:
- React 19 + strict TS (`tsc -b` must stay clean); curried `create<GameQueryStore>()(...)` typing per zustand v5 docs.
- `useGames(gameQuery)` keeps its parameter (stays pure/testable); only callers change.
- `ms("24h")` staleTime edits in `useGames` / `useGenres` / `usePlatforms` are pre-existing on this branch and unrelated to this feature.

## 3. Acceptance Criteria

- `zustand` is present in `package.json` dependencies.
- `src/store/useGameQueryStore.ts` exports `useGameQueryStore` with `gameQuery` plus the 4 setters, with `genreId?` / `platformId?: number | undefined` optional types.
- `App.tsx` contains no `useState`, no `GameQuery` import, and renders `<NavBar/> <GenreList/> <PlatformSelector/> <SortSelector/> <GameGrid/> <GameHeading/>` bare.
- `NavBar` calls `setSearchText(ref.value)` on form submit; `GenreList` calls `setGenreId(id)` on click; `PlatformSelector` maps `""` to `undefined` else `Number(value)`; `SortSelector` calls `setSortOrder(value)`; `GameGrid` passes store `gameQuery` to `useGames(gameQuery)`; `GameHeading` resolves names via `useGenre(genreId)` / `usePlatform(platformId)`.
- `npx tsc -b` exits 0, `npx eslint` on touched files exits 0, `npm run build` exits 0.

## 4. Expected Behavior

Normal operation: typing a query + Enter in `NavBar` updates `searchText`, which changes the `["games", gameQuery]` query key and refetches; picking a genre / platform / sort order updates only that field and preserves the others; heading and grid update accordingly.

Failure scenarios: no new failure modes introduced. Store updates are synchronous merges; React Query loading / error / empty states (`GameGrid` skeletons, retry button; `GenreList` / `PlatformSelector` spinner-or-null) behave exactly as before.

## 5. Implementation

- Added `zustand@5` and a single new module `src/store/useGameQueryStore.ts` using `create<GameQueryStore>()((set) => (...))` with 4 explicit setter actions. Deliberately no `persist`, devtools, or combined slices (`// ponytail:` comment marks this).
- `App.tsx`: removed `useState<GameQuery>` and all `selected*/onSelect*` / `gameQuery` props.
- `NavBar`, `GenreList`, `PlatformSelector`, `SortSelector`: deleted `Props` interfaces, subscribe via e.g. `useGameQueryStore((s) => s.gameQuery.genreId)` + `useGameQueryStore((s) => s.setGenreId)`.
- `GameGrid`: subscribes to full `s.gameQuery` and forwards it to the unchanged `useGames(gameQuery)` hook (keeps hook pure, minimal diff); existing `useEffect scrollTo` dep updated to store object.
- `GameHeading`: subscribes to `genreId` / `platformId` separately and calls existing `useGenre` / `usePlatform` lookups; removed now-unused `GameQuery` type import.
- Architectural decision: per-field selectors everywhere except `GameGrid` (needs the whole object as query key). No store read inside `useGames` itself.

## 6. Data Flow

```
UI event → store action (merge one field) → subscribed component re-render
  → useGames queryKey ["games", gameQuery] change
  → game-service params { genres, parent_platforms, ordering, search, page, page_size: 20 }
  → RAWG API → GameGrid list / GameHeading labels
```

Transformations: empty `sortOrder` / `searchText` become `undefined` in `game-service.ts` (pre-existing); `PlatformSelector ""` becomes `undefined`. No validation layer added.

## 7. Files Changed

- NEW `src/store/useGameQueryStore.ts` — the zustand store (only new application code).
- MOD `src/App.tsx` — removed state + prop passing.
- MOD `src/components/NavBar.tsx` — `onSearch` prop → `setSearchText` selector.
- MOD `src/components/GenreList.tsx` — `selectedGenreId` / `onSelectGenre` props → store selectors.
- MOD `src/components/PlatformSelector.tsx` — `selectedPlatformId` / `onSelectPlatform` props → store selectors.
- MOD `src/components/SortSelector.tsx` — `sortOrder` / `onSelectSortOrder` props → store selectors.
- MOD `src/components/GameGrid.tsx` — `gameQuery` prop → `useGameQueryStore((s) => s.gameQuery)`; `useGames` hook itself unchanged.
- MOD `src/components/GameHeading.tsx` — `gameQuery` prop → `genreId` / `platformId` selectors; dropped unused type import.
- MOD `package.json` + `package-lock.json` — added `zustand` (note: same diff hunks also contain pre-existing unrelated `ms` / `@types/ms` lines — ignore those).
- MOD `src/hooks/useGames.ts`, `src/hooks/useGenres.ts`, `src/hooks/usePlatforms.ts` — only the unrelated `ms("24h")` refactor, NOT part of this feature.
- UNTRACKED `src/store/` (new dir holding the store), `.commandcode/` (harness junk, ignore), `feature/` (this doc).

## 8. Edge Cases

- `undefined` genre / platform means "All" filter and is omitted from API params by the service.
- Empty-string `sortOrder` / `searchText` are normalized to `undefined` in `game-service.ts`.
- Rapid successive setter calls merge correctly via functional `set((s) => ...)`.
- No reset / clear-all action exists — filters can only be overwritten field-by-field.
- `GenreList` cannot deselect back to `undefined` (pre-existing limitation, marked `ponytail:` in code).
- `GameHeading` ignores `searchText` (pre-existing).

## 9. Error Handling

No new error handling added. No validation in setters (string / number passthrough; `Number()` cast on select value). API, loading, and empty states are handled exactly as before: `GameGrid` shows skeletons / error text / "No games found" / "Failed to load more" + Retry; `GenreList` / `PlatformSelector` return `null` on error, `Spinner` while loading.

## 10. Security Considerations

No meaningful security considerations. Client-only UI filter state; no authentication, authorization, sensitive data, file handling, or new network surface. The `search` text was already passed through as a query param before this change.

## 11. Testing

- Tests added / modified: none — repo has no unit tests (`**/*.test.*` and `**/*.spec.*` both absent).
- Tests executed: `npx tsc -b` → exit 0; `npx eslint` on the 8 touched source files → exit 0; `npm run build` (`tsc -b && vite build`) → exit 0 with only the pre-existing >500 kB chunk-size warning.
- Manual UI filter testing (search / genre / platform / sort + infinite scroll) was specified in the plan but not executed in this session.

## 12. Known Limitations

- No `persist` middleware: filters are lost on reload.
- No URL-share / deep-linking of filters; no `resetGameQuery` action.
- `GameGrid` subscribes to the full `gameQuery` object, so any field change re-renders it (accepted trade-off; it needs the whole key anyway).
- Branch diff noise: unrelated `ms` refactor, `.commandcode/` untracked files, and `dist/` build output are mixed into the working tree — reviewers should scope to §7.
- Heading ignores `searchText`; genre list has no deselect.

## 13. Important Review Notes

- Verify no stale `Props` interfaces or `GameQuery` prop imports remain in the 6 consumers (all were deleted; `GameHeading` needed a follow-up unused-import cleanup).
- Pay attention to `PlatformSelector`'s `"" → undefined` branch — the only type-coercion logic added.
- Confirm `useGames` signature is unchanged (`useGames(gameQuery)`) — the hook was deliberately kept pure.
- Confirm the store uses functional merges (`set((s) => ...)`) so concurrent field updates cannot clobber each other.
- Do not mistake `ms("24h")` hook edits or `.commandcode/` / `dist/` noise for feature code.
- No race-condition, consistency, or perf-sensitive code beyond the accepted `GameGrid` full-object subscription.
