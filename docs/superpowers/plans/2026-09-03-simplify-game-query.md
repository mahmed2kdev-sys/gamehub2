# Simplify GameQuery to genreId / platformId Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `GameQuery.genre: Genre | null` / `platform: Platform | null` with `genreId?: number` / `platformId?: number` so the query object stores only IDs.

**Architecture:** Store only IDs in `App` state; leaf components emit IDs; `game-service.ts` passes IDs straight to API params; `GameHeading` resolves display names via existing cached `useGenres`/`usePlatforms` hooks (no new data fetching).

**Tech Stack:** React 19 + TypeScript, Chakra UI, TanStack Query 5 (existing), Vite, RAWG API.

**Spec:** User request: "simplyfy the game query object, implement generID and platFormId instead gener and platform object" — interpreted as `genreId`/`platformId` (conventional casing; adjust if literal `generID`/`platFormId` required).

## Global Constraints

- No new dependencies — use already-installed `useGenres`/`usePlatforms` (which have `initialData` from `src/data/*`).
- `undefined` (not `null`) means "no filter" so axios omits the param.
- Keep `sortOrder` and `searchText` unchanged.
- Preserve behavior: filtering, heading text, build passes (`npx tsc --noEmit`, `npm run build`).

---

## File Structure

- Modify: `src/entities/GameQuery.ts:1-9` — new shape, drop `Genre`/`Platform` imports.
- Modify: `src/App.tsx:12,26,31` — init state + handlers to IDs.
- Modify: `src/components/GenreList.tsx:1-33` — `selectedGenreId` + `onSelectGenre(id: number)`.
- Modify: `src/components/PlatformSelector.tsx:1-24` — `selectedPlatformId` + `onSelectPlatform(id: number|undefined)`, delete `.find()` lookup.
- Modify: `src/services/game-service.ts:10-11` — use IDs directly.
- Modify: `src/components/GameHeading.tsx:1-11` — ID → name lookup via cached hooks.
- No change: `src/hooks/useGames.ts`, `src/components/GameGrid.tsx`, `src/components/SortSelector.tsx`, `src/components/NavBar.tsx` (pass-through `GameQuery`).

---

### Task 1: `GameQuery` entity

**Files:**
- Modify: `src/entities/GameQuery.ts:1-9`

**Interfaces:**
- Consumes: nothing (removes `Genre`, `Platform` imports)
- Produces: `export interface GameQuery { genreId?: number; platformId?: number; sortOrder: string; searchText: string }` consumed by all following tasks

- [ ] **Step 1: Change interface to IDs**

```ts
export interface GameQuery {
  genreId?: number;
  platformId?: number;
  sortOrder: string;
  searchText: string;
}
```

Delete the `import type { Genre }` / `import type { Platform }` lines entirely.

- [ ] **Step 2: Verify types still parse**

Run: `npx tsc --noEmit`
Expected: errors in consumers that still reference `.genre`/`.platform` (confirms scope, next tasks will fix).

- [ ] **Step 3: Commit**

```bash
git add src/entities/GameQuery.ts
git commit -m "refactor: change GameQuery to genreId/platformId"
```

---

### Task 2: `App.tsx` state + wiring

**Files:**
- Modify: `src/App.tsx:12,26,31`

**Interfaces:**
- Consumes: `GameQuery` from Task 1 (now `genreId?` / `platformId?`)
- Produces: `gameQuery: GameQuery` + ID-based callbacks consumed by GenreList/PlatformSelector/GameHeading/GameGrid

- [ ] **Step 1: New initial state + handlers**

```tsx
const [gameQuery, setGameQuery] = useState<GameQuery>({ sortOrder: "", searchText: "" });
```

```tsx
<GenreList selectedGenreId={gameQuery.genreId} onSelectGenre={(genreId) => setGameQuery({ ...gameQuery, genreId })} />
```

```tsx
<PlatformSelector selectedPlatformId={gameQuery.platformId} onSelectPlatform={(platformId) => setGameQuery({ ...gameQuery, platformId })} />
```

No `genre: null` / `platform: null` left.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: errors now in `GenreList`, `PlatformSelector`, `game-service`, `GameHeading` (next tasks fix).

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: App wires genreId/platformId"
```

---

### Task 3: `GenreList` takes/returns ID

**Files:**
- Modify: `src/components/GenreList.tsx:1-33`

**Interfaces:**
- Consumes: `selectedGenreId?: number` from App (Task 2)
- Produces: `onSelectGenre: (genreId: number) => void` back to App

- [ ] **Step 1: Change props + compare + emit**

```tsx
interface Props {
  selectedGenreId?: number;
  onSelectGenre: (genreId: number) => void;
}
```

```tsx
export default function GenreList({ selectedGenreId, onSelectGenre }: Props) {
```

```tsx
fontWeight={genre.id === selectedGenreId ? "bold" : "normal"}
onClick={() => onSelectGenre(genre.id)}
```

Delete `import type { Genre }` if unused after (only used in old Props).

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: GenreList errors resolved.

- [ ] **Step 3: Commit**

```bash
git add src/components/GenreList.tsx
git commit -m "refactor: GenreList uses genreId"
```

---

### Task 4: `PlatformSelector` takes/returns ID (deletes lookup)

**Files:**
- Modify: `src/components/PlatformSelector.tsx:1-24`

**Interfaces:**
- Consumes: `selectedPlatformId?: number` and `platforms` from `usePlatforms()` for `<option>` rendering
- Produces: `onSelectPlatform: (platformId: number | undefined) => void` back to App

- [ ] **Step 1: Change props + passthrough**

```tsx
interface Props {
  selectedPlatformId?: number;
  onSelectPlatform: (platformId: number | undefined) => void;
}

export default function PlatformSelector({ selectedPlatformId, onSelectPlatform }: Props) {
  const { platforms, error, isLoading } = usePlatforms();
  // ...
        value={selectedPlatformId ?? ""}
        onChange={(e) => onSelectPlatform(e.target.value ? Number(e.target.value) : undefined)}
```

Delete `import type { Platform }` and the `platforms.find(...)` line. `usePlatforms` stays (still populates `<option>`s).

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PlatformSelector errors resolved.

- [ ] **Step 3: Commit**

```bash
git add src/components/PlatformSelector.tsx
git commit -m "refactor: PlatformSelector uses platformId"
```

---

### Task 5: `game-service.ts` uses IDs directly

**Files:**
- Modify: `src/services/game-service.ts:10-11`

**Interfaces:**
- Consumes: `GameQuery` with `genreId` / `platformId` from Task 1
- Produces: `getGames` params `genres` and `parent_platforms` as `number | undefined`

- [ ] **Step 1: Replace optional-chained `.id` with scalar**

```ts
genres: gameQuery.genreId,
parent_platforms: gameQuery.platformId,
```

Full context:

```ts
const getGames = (gameQuery: GameQuery, page: number, signal?: AbortSignal) =>
  client.getAll({
    params: {
      genres: gameQuery.genreId,
      parent_platforms: gameQuery.platformId,
      ordering: gameQuery.sortOrder || undefined,
      search: gameQuery.searchText || undefined,
      page,
      page_size: 20,
    },
    signal,
  });
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: service errors resolved.

- [ ] **Step 3: Commit**

```bash
git add src/services/game-service.ts
git commit -m "refactor: game-service uses genreId/platformId"
```

---

### Task 6: `GameHeading` resolves names from IDs

**Files:**
- Modify: `src/components/GameHeading.tsx:1-11`

**Interfaces:**
- Consumes: `GameQuery` with IDs + `useGenres()` / `usePlatforms()` (cached, seeded with `initialData` so no extra fetch)
- Produces: `heading: string` like `"PC Action Games"` rendered in `<Heading>`

- [ ] **Step 1: Lookup via cached hooks (no new deps)**

```tsx
import { Heading } from "@chakra-ui/react";
import type { GameQuery } from "../entities/GameQuery";
import useGenres from "../hooks/useGenres";
import usePlatforms from "../hooks/usePlatforms";

export default function GameHeading({ gameQuery }: Props) {
  const { genres } = useGenres();
  const { platforms } = usePlatforms();
  const genreName = genres.find((g) => g.id === gameQuery.genreId)?.name ?? "";
  const platformName = platforms.find((p) => p.id === gameQuery.platformId)?.name ?? "";
  const heading = `${platformName} ${genreName} Games`.replace(/\s+/g, " ").trim();
```

Keep existing `// ponytail: simple join+trim, add "for"/searchText prefix when needed` comment.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/GameHeading.tsx
git commit -m "refactor: GameHeading resolves names from IDs"
```

---

### Task 7: Verify (no test framework in repo)

**Files:**
- Verify all modified files together

- [ ] **Step 1: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (no output).

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS (vite build succeeds).

- [ ] **Step 3: Manual smoke**

Run: `npm run dev`, select a genre + platform, confirm grid filters + heading shows e.g. "PC Action Games", select "All Platforms" clears filter. Confirm no console errors and queryKey `["games", gameQuery]` now keys on primitives (fewer re-renders).

---

## Self-Review

1. **Spec coverage:** All 6 `GameQuery` consumers found via grep (`App`, `useGames` passthrough, `game-service`, `GameHeading`, `GameGrid` passthrough) covered. `useGames`/`GameGrid` need no change (pass-through). Name lookup moved to `GameHeading` only.
2. **Placeholder scan:** No `TBD`, `TODO`, or vague steps — every step has exact code.
3. **Type consistency:** `genreId?: number` / `platformId?: number | undefined` across all tasks; `undefined` (not `null`) = "no filter", lets `PlatformSelector` drop `?? null` mapping and `game-service` pass `undefined` straight to axios (param omitted). `onSelectGenre: (genreId: number) => void` matches `GenreList` emit; `onSelectPlatform: (platformId: number | undefined) => void` matches "All Platforms" clearing.

## Risks

- `GameHeading` now depends on `useGenres`/`usePlatforms` initialData — safe because both hooks seed `initialData` from `src/data/genres.ts` / `platforms.ts`; if those files are emptied, heading shows fallback `""` (graceful).
- QueryKey now uses primitives — better for cache hits; if full objects were needed for display elsewhere, they'd need re-adding.
