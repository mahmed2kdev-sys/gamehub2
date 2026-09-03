# Infinite Scroll with react-infinite-scroll-component (Window Mode) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Load More button with window-scroll infinite scroll via `react-infinite-scroll-component`.

**Architecture:** Keep `useInfiniteQuery` as-is. Install `react-infinite-scroll-component`, wrap `SimpleGrid` with `<InfiniteScroll dataLength={games.length} next={fetchNextPage} hasMore={!!hasNextPage} loader endMessage>` in window mode (no `scrollableTarget`, no `height`). Remove `h="100dvh"` / `gridTemplateRows` / `overflowY="auto"` from `App.tsx` so `window` scrolls.

**Tech Stack:** react-infinite-scroll-component (/ankeetmaini/react-infinite-scroll-component), @tanstack/react-query 5, Chakra UI Spinner, Vite + React 19, RAWG API.

**Spec:** User directive `use react infinite scroll component` + chose window scroll over nested `scrollableTarget`.

---

## Global Constraints
- No `scrollableTarget` or `height` props — window mode only.
- Keep `page_size:20`, `getNextPageParam: lastPage.next ? allPages.length+1 : undefined`.
- Preserve error banner, 6 skeletons on initial load, end message.
- No new abstractions.

---

## File Structure
- Modify: `src/App.tsx:14-31` — remove fixed viewport height and nested overflow.
- Modify: `src/components/GameGrid.tsx:1-46` — replace Button with InfiniteScroll.
- Install: `react-infinite-scroll-component` in `package.json`.
- No change: `src/hooks/useGames.ts`, `src/services/game-service.ts`.

---

### Task 1: Install Dependency

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: npm
- Produces: `node_modules/react-infinite-scroll-component`

- [ ] **Step 1: Install**
```bash
npm install react-infinite-scroll-component
```

- [ ] **Step 2: Verify build**
```bash
npm run build
```
Expected: `tsc -b` passes, vite build succeeds.

- [ ] **Step 3: Commit** (batch with Task 3 if preferred)
```bash
git add package.json package-lock.json
```

---

### Task 2: Update App.tsx to Window Scroll

**Files:**
- Modify: `src/App.tsx:14-31`

**Interfaces:**
- Consumes: Chakra Grid layout
- Produces: Window-scrollable document (Grid grows with content).

- [ ] **Step 1: Remove fixed height and nested overflow**
```tsx
// from
<Grid
  h="100dvh"
  templateAreas={...}
  gridTemplateRows={{ base: 'auto 1fr auto', lg: 'auto 1fr' }}
  gridTemplateColumns={{ base: '1fr', lg: '300px 1fr' }}
>
// to
<Grid
  templateAreas={...}
  gridTemplateColumns={{ base: '1fr', lg: '300px 1fr' }}
>

// from
<GridItem gridArea="main" bg={{ _light: 'gray.50', _dark: 'gray.800' }} color="fg" p="4" overflowY="auto">
// to
<GridItem gridArea="main" bg={{ _light: 'gray.50', _dark: 'gray.800' }} color="fg" p="4">
```

- [ ] **Step 2: Verify build**
```bash
npm run build
```

---

### Task 3: Update GameGrid.tsx to Use InfiniteScroll

**Files:**
- Modify: `src/components/GameGrid.tsx:1-46`

**Interfaces:**
- Consumes: `useGames(gameQuery)` returns `{data, error, isLoading, fetchNextPage, hasNextPage}`
- Produces: `<InfiniteScroll>` wrapping `SimpleGrid`

- [ ] **Step 1: Update imports**
```tsx
import { SimpleGrid, Text, Box, Spinner } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
```

- [ ] **Step 2: Replace JSX**
```tsx
export default function GameGrid({ gameQuery }: Props) {
  const { data, error, isLoading, fetchNextPage, hasNextPage } = useGames(gameQuery);
  if (error) return <Text color="red.500">{(error as Error).message}</Text>;
  const games = data?.pages.flatMap((p) => p.results) ?? [];
  if (isLoading) return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={6} padding="10px">
      {Array.from({ length: 6 }).map((_, i) => (
        <GameCardContainer key={i}><GameCardSkeleton /></GameCardContainer>
      ))}
    </SimpleGrid>
  );
  if (games.length === 0) return <Text>No games found.</Text>;
  return (
    <InfiniteScroll
      dataLength={games.length}
      next={() => fetchNextPage()}
      hasMore={!!hasNextPage}
      loader={<Box textAlign="center" py={4}><Spinner /></Box>}
      endMessage={<Text textAlign="center" color="fg.muted" mt={6}>Nothing more to load</Text>}
      scrollThreshold="200px"
    >
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={6} padding="10px">
        {games.map((game) => (
          <GameCardContainer key={game.id}><GameCard game={game} /></GameCardContainer>
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  );
}
```

- [ ] **Step 3: Manual verify**
```bash
npm run dev
```
Scroll window → Network `?page=2`, Spinner, endMessage, filter resets.

- [ ] **Step 4: Build & Lint**
```bash
npm run build
npm run lint
```

- [ ] **Step 5: Commit**
```bash
git add src/App.tsx src/components/GameGrid.tsx package.json package-lock.json docs/superpowers/plans/2026-09-03-infinite-scroll-window.md
git commit -m "feat: infinite scroll via react-infinite-scroll-component (window mode)"
```

---

## Self-Review
1. Spec coverage: window scroll ✅, library ✅, loader/endMessage ✅, hasMore from hasNextPage ✅.
2. Placeholder scan: none.
3. Type consistency: `hasMore={!!hasNextPage}` boolean, `next: ()=>void`.

## Risks
- Nav scrolls away — add `position: sticky` later if needed.
- Library `dataLength` must be games.length — done.
