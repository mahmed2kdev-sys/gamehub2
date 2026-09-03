# Platform/Genre Lookup Hooks (platformId/genreId) Implementation

**Date:** 2026-09-03  
**Branch:** `lookup-hook`  
**Status:** Implemented, `npx tsc --noEmit` + `npm run build` pass

## Goal
Provide singular lookup hooks `usePlatform(platformId?)` and `useGenre(genreId?)` that resolve a single `Platform`/`Genre` from already-cached lists, storing only IDs in `GameQuery` (`src/entities/GameQuery.ts:1`).

User request: "implement platform and genre hook using platformID, genreId" with Option A (two new files) + simple return.

## Architecture
- No new dependencies, no new network calls.
- Derive from existing list hooks `usePlatforms` (`src/hooks/usePlatforms.ts:5`) and `useGenres` (`src/hooks/useGenres.ts:5`) which are seeded with `initialData` from `src/data/platforms.ts:1` / `src/data/genres.ts:1` and `staleTime: 24h`. Lists are always available synchronously.
- Singular hooks do a linear `Array.find` — `n≈14` platforms, `n≈19` genres, O(n) is trivial.
- Simple return `T | undefined` (not `{data, isLoading}`) — consumer handles `undefined` as "not found / no filter".

```
GameQuery { platformId?, genreId? } → usePlatform(id) / useGenre(id) → Platform|undefined / Genre|undefined
                                    ↘ usePlatforms / useGenres (cached)
```

## Files

| File | Change | Lines |
|------|--------|-------|
| `src/hooks/usePlatform.ts` | **New** — singular lookup | `src/hooks/usePlatform.ts:1-7` |
| `src/hooks/useGenre.ts` | **New** — singular lookup | `src/hooks/useGenre.ts:1-7` |
| `src/components/GameHeading.tsx` | **Modify** — consume new hooks, delete inline `.find()` | `src/components/GameHeading.tsx:1-20` |
| `src/hooks/usePlatforms.ts` | No change | — |
| `src/hooks/useGenres.ts` | No change | — |
| `src/entities/GameQuery.ts` | No change (already `genreId?`/`platformId?`) | `src/entities/GameQuery.ts:1-6` |

## API

### `usePlatform(id?: number): Platform | undefined`
```ts
// src/hooks/usePlatform.ts:3
import usePlatform from "../hooks/usePlatform";
const platform = usePlatform(gameQuery.platformId); // Platform | undefined
const name = platform?.name ?? "";
```
- `id` is `undefined` → returns `undefined` (no filter).
- `id` not found → returns `undefined` (graceful fallback).

### `useGenre(id?: number): Genre | undefined`
```ts
// src/hooks/useGenre.ts:3
import useGenre from "../hooks/useGenre";
const genre = useGenre(gameQuery.genreId);
const name = genre?.name ?? "";
```

## Usage — `GameHeading`

**Before** (`src/components/GameHeading.tsx:11-14` old):
```ts
const { genres } = useGenres();
const { platforms } = usePlatforms();
const genreName = genres.find((g) => g.id === gameQuery.genreId)?.name ?? "";
const platformName = platforms.find((p) => p.id === gameQuery.platformId)?.name ?? "";
```

**After** (`src/components/GameHeading.tsx:10-13`):
```ts
import useGenre from "../hooks/useGenre";
import usePlatform from "../hooks/usePlatform";

export default function GameHeading({ gameQuery }: Props) {
  const genre = useGenre(gameQuery.genreId);
  const platform = usePlatform(gameQuery.platformId);
  const heading = `${platform?.name ?? ""} ${genre?.name ?? ""} Games`.replace(/\s+/g, " ").trim();
  // ponytail: simple join+trim
}
```

Heading examples: `undefined+undefined → "Games"`, `PC+Action → "PC Action Games"`.

Other consumers can reuse:
```ts
// PlatformSelector / GenreList already iterate lists; singular hooks for detail views:
const platform = usePlatform(selectedPlatformId);
```

## Implementation Details

**`src/hooks/usePlatform.ts:1-7`:**
```ts
import usePlatforms from "./usePlatforms";

export default function usePlatform(id?: number) {
  const { platforms } = usePlatforms();
  // ponytail: linear scan, n≈14, Map if n>>100
  return platforms.find((p) => p.id === id);
}
```

**`src/hooks/useGenre.ts:1-7`:**
```ts
import useGenres from "./useGenres";

export default function useGenre(id?: number) {
  const { genres } = useGenres();
  // ponytail: linear scan, n≈19, Map if n>>100
  return genres.find((g) => g.id === id);
}
```

No `useQuery` per ID, no `staleTime`, no `ApiClient.get(id)` — reuse guarantees zero extra renders beyond list hook's cache.

## Verification
```bash
npx tsc --noEmit  # PASS (no output)
npm run build     # PASS — vite 8.2.2, 2061 modules, 574kB JS
```
Manual: `npm run dev`, select genre + platform → heading updates; clear filter → "Games"; no network for lookup.

## Skipped / When to Add
- **Skipped** single-entity fetch `ApiClient.get(id)` + `useQuery(["platform", id])`: would duplicate cache. Add when `src/data/*` snapshot is stale, detail fields diverge from list, or ID may not be in list (e.g., deep link to unknown ID → fetch fallback).
- **Skipped** `{ platform, isLoading, error }` wrapper: list hooks already expose loading. Add if singular hook needs independent loading (e.g., after adding fetch fallback).
- **Skipped** `Map<number, T>` cache: linear scan <20 items is faster than Map overhead. Add if RAWG adds 100+ parents/genres.
- **Skipped** modifying `usePlatforms`/`useGenres` to accept `id` param: keeps list hook pure per Single Responsibility.

## Risks
- If `src/data/platforms.ts` / `genres.ts` emptied, lookup returns `undefined` → heading falls back to `""` (graceful). Mitigation: fetch fallback noted above.
