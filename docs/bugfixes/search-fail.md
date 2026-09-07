# Bugfix: search-fail

## Bug Summary
Search combined with stale genre/platform/sort filters, so results looked unfiltered or wrong ("search not working"). The React Query key also carried empty-string placeholders: `["games", {sortOrder:"", searchText:""}]` on load, and `["games", {sortOrder:"name", searchText:"hello", genreId:4, platformId:2}]` after filtering plus search.

## User/System Impact
- Searching while any filter was set returned over-filtered results (search appeared broken).
- Cache keys were noisy (empty-string fields present), reducing cache-hit clarity in devtools.

## Root Cause
`useGameQueryStore.setSearchText` merged one field (`{ ...s.gameQuery, searchText }`), preserving stale `genreId` / `platformId` / `sortOrder`. `game-service.ts` then sent `genres` + `parent_platforms` + `ordering` + `search` together. Additionally, `GameQuery` required `sortOrder: string` / `searchText: string`, forcing `""` placeholders in the initial state and therefore in the queryKey.

## Behavior Before the Fix
- Initial key: `["games", {sortOrder:"", searchText:""}]`
- After genre + platform + sort + search "hello": `["games", {sortOrder:"name", searchText:"hello", genreId:4, platformId:2}]`
- API call combined all four params.

## Behavior After the Fix
- Initial key: `["games", {}]`
- After search "hello" (regardless of prior filters): `["games", {searchText:"hello"}]`; API sends only `search`.
- Empty or whitespace-only search resets to `["games", {}]`.
- Leading/trailing whitespace is trimmed (`"  hello  "` → `{searchText:"hello"}`).

## Requirements
- Search must not depend on genre/platform/sortOrder; submitting a search resets them.
- Initial query state must be `{}` (all `GameQuery` fields optional).
- Genre / platform / sort combinations must still merge with each other (only search wipes).

## Acceptance Criteria
- `useGameQueryStore` initial `gameQuery` deep-equals `{}`.
- `setSearchText("hello")` after genre/platform/sort are set yields `{searchText:"hello"}` only.
- `setSearchText("")` and `setSearchText("  ")` yield `{}`.
- `setSearchText("  hello  ")` yields `{searchText:"hello"}` (trimmed).
- `npx tsc --noEmit` exits 0; `npm run build` succeeds.

## Expected Behavior
Typing a query + Enter in `NavBar` replaces the whole query with search-only state; heading falls back to "Games"; genre/platform/sort selectors show cleared. Clearing the search returns to the unfiltered list. Picking genre/platform/sort preserves the other non-search fields.

## Fix Implementation
- `src/entities/GameQuery.ts`: `sortOrder` / `searchText` changed from required `string` to optional (`sortOrder?: string; searchText?: string;`).
- `src/store/useGameQueryStore.ts`: initial `gameQuery: {}`; `setSearchText` replaced the functional merge with a replacing `set()` that branches on `searchText?.trim()` — truthy trims and stores `{searchText}`, falsy stores `{}`. Comment updated to `// ponytail: search resets other filters so queryKey is search-only; empty search -> {}`.
- `src/components/SortSelector.tsx`: `value={sortOrder}` → `value={sortOrder ?? ""}` to handle the new `undefined` case.
- `src/services/game-service.ts`: unchanged — `ordering: gameQuery.sortOrder || undefined` and `search: gameQuery.searchText || undefined` already handle optionals.

## Files Changed
- MOD `src/entities/GameQuery.ts` — required strings → optional.
- MOD `src/store/useGameQueryStore.ts` — `{}` init + search-reset logic (only file with behavior change).
- MOD `src/components/SortSelector.tsx` — `?? ""` fallback.
- NEW `docs/bugfixes/search-fail.md` — this document.

## Data Flow
```
NavBar submit → setSearchText → gameQuery = {searchText} (or {}) → ["games", gameQuery] key change → game-service { search } only → RAWG API → GameGrid list / GameHeading fallback
```

## Regression Risks
- Search intentionally discards prior filters; there is no "restore filters after search" without reselecting.
- `GameGrid` subscribes to the full `gameQuery` object, so any field change re-renders it (pre-existing, unchanged).
- Genre/platform setters still merge, so non-search flows can produce keys with explicit `undefined` values (e.g. `{searchText, genreId: undefined}`); accepted as harmless.

## Edge Cases
- `undefined` genre / platform means "All" and is omitted from API params by the service.
- Whitespace-only input is treated as clear (`{}`), not as a search for `" "`.
- `GameHeading` ignores `searchText` (pre-existing); `GenreList` still has no deselect toggle (pre-existing).

## Testing
- Repo has no unit-test framework (`**/*.test.*`, `**/*.spec.*` absent).
- Executed: `npx tsc --noEmit` → exit 0; `npm run build` (`tsc -b && vite build`) → pass with only the pre-existing >500 kB chunk-size warning; node inline assert on the trim/empty/whitespace branches → pass.
- Manual UI smoke (genre + platform + sort, then search; confirm devtools key and cleared selectors) was specified but not executed in this session.

## Known Limitations
- No `persist` middleware, no URL-sync / deep-linking, no generic reset-all action.
- Genre list cannot deselect back to `undefined` (pre-existing).

## Important Review Areas
- Confirm reset-on-search is the desired UX versus ignoring filters at the service layer while keeping the UI selections visible.
- Confirm the non-functional `set()` in `setSearchText` cannot clobber concurrent updates in an undesired way (search is a discrete submit event that intentionally replaces all state).
- Confirm `SortSelector` is the only consumer that was `undefined`-unsafe (`GenreList` / `PlatformSelector` already handle `undefined`; `game-service` already normalizes with `|| undefined`).
