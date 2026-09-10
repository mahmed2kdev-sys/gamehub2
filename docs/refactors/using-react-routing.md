# Refactor: React Router with Home and Game Detail Routes

## Purpose

Introduce client-side routing to the GameHub app via `react-router` (data-router API),
splitting the single-screen `App` into a `Layout` + `HomePage` composition and adding a
`games/:slug` detail page. Homepage behavior must remain unchanged; the detail page and
URL-addressable navigation are new behavior added as part of this work.

## Problem / Motivation

The app rendered one screen unconditionally (`main.tsx` mounted `<App />` directly), so
individual games were not linkable, the browser back button had no route semantics, and
any future deep-linking (shareable game URLs) had no foundation. The user requested
react-router installation and full setup including a game detail route, using the data
router (`createBrowserRouter` + `RouterProvider`) and a `routes.tsx` module name.

## Requirements

Sources: (U) explicit user request; (I) implementation choice made during the work.

1. (U) Install `react-router` and complete setup in the existing React 19 + Vite app.
2. (U) Use the data-router API (`createBrowserRouter`, `RouterProvider`), not the
   declarative `<BrowserRouter>` component.
3. (U) Name the route module `src/routes.tsx` (renamed from the initially proposed
   `router.tsx` at user request).
4. (U) Include a game detail route `games/:slug` in the initial setup.
5. (I) Homepage at `/` must render exactly the previous `App` UI (NavBar, genre list,
   heading, selectors, game grid) with no behavior change.
6. (I) Unknown URLs must render an error page with a path home instead of a blank screen.
7. Constraints: React 19, strict TS (`tsc -b` clean), ChakraProvider + QueryClientProvider
   wrappers preserved; no framework mode (`@react-router/dev` plugin) and no
   loaders/actions — React Query remains the data layer.
8. Uncertainty: no requirement was stated for which game fields the detail page must
   show; the implemented set (name, image, `description_raw`) is an implementation
   choice, not a requirement. Filter-URL sync (genre/platform/sort/search in the URL)
   was never requested — see Non-Goals.

## Non-Goals

- `react-router` framework mode and the `@react-router/dev` Vite plugin.
- Route loaders/actions; data fetching stays in React Query (`useGames`, `useGame`).
- Syncing zustand filter state to URL search params / deep-linking filtered lists.
- Deleting the now-unused `src/App.tsx` / `src/App.css` (deferred cleanup, still tracked).
- Additional routes (e.g. genre pages), pagination-in-URL, scroll restoration.
- New unit tests (repo has no test framework; see Verification).

## Acceptance Criteria

1. `/` renders the previous homepage UI (nav, aside genre list on `lg`, heading,
   platform + sort selectors, game grid).
2. Clicking a game card navigates to `/games/:slug` and shows the game's detail.
3. The logo in `NavBar` navigates back to `/`.
4. An unknown URL renders the error page with a "Go home" link.
5. `npm run lint` exits 0 and `npm run build` (`tsc -b && vite build`) exits 0.
6. No application behavior outside routing changes (filters, search, infinite scroll
   work as before).

Criteria 1–4 were verified by code inspection against the implementation, not by
executed browser tests (see Verification).

## Expected Behavior

- First load at `/`: identical layout to the pre-change app; filters/search/infinite
  scroll behave as before.
- Game card click: URL becomes `/games/<slug>` (falls back to numeric id when `slug`
  is absent) and the detail page shows a spinner while loading, then title, cropped
  image, and description text when available.
- Logo click or "Back"/"Go home" links return to `/`.
- Unknown path or route error: error page showing "404" for 404 responses (else
  "Oops") plus the route error text and a home link.

## Preserved Behavior

- `HomePage` is a verbatim move of the `App.tsx` grid (same Chakra `templateAreas`,
  colors, padding, `hideBelow="lg"` aside); all filter/store/React Query logic in
  `GameGrid`, `GameHeading`, selectors, and `NavBar` search is untouched.
- Provider stack in `main.tsx` (QueryClient, Chakra `system`, ColorMode,
  ReactQueryDevtools) is unchanged; only `<App />` was swapped for
  `<RouterProvider router={router} />`.
- `ApiClient.get` / `getAll` semantics unchanged; `game-service.ts` untouched.

## Implementation Summary

- Added `react-router@8.3.1` dependency (note: v8; planning docs consulted described v7,
  but the used APIs — `createBrowserRouter`, `RouterProvider`, `Outlet`, `useParams`,
  `Link`, `useRouteError`, `isRouteErrorResponse` — are the same).
- New `src/routes.tsx`: single `createBrowserRouter` table; `/` → `Layout` with
  `errorElement: <ErrorPage />`, children `index → HomePage`, `games/:slug →
  GameDetailPage`.
- New `src/pages/Layout.tsx`: Chakra grid shell (moved from `App.tsx`) with `NavBar`
  plus `<Outlet />`.
- New `src/pages/HomePage.tsx`: aside + main `GridItem`s moved verbatim from `App.tsx`.
- New `src/pages/GameDetailPage.tsx`: `useParams()` → `useGame(slug)`; spinner /
  error text / title + image + `description_raw`.
- New `src/pages/ErrorPage.tsx`: `useRouteError()` + `isRouteErrorResponse` guard.
- New `src/hooks/useGame.ts`: `useQuery({ queryKey: ["game", slug], enabled: !!slug,
  staleTime: ms("24h") })` over `ApiClient("/games").get(slug)` (the pre-existing
  `get(id)` method — no new network code).
- Modified `src/entities/Game.ts`: added required `slug: string` and optional
  `description_raw?: string`.
- Modified `src/components/GameCard.tsx`: whole card wrapped in
  `<RouterLink to={\`/games/${game.slug ?? game.id}\`}>`.
- Modified `src/components/NavBar.tsx`: logo image wrapped in `<RouterLink to="/">`.
- Modified `src/main.tsx`: `<App />` → `<RouterProvider router={router} />`.

## Data Flow

```
/                     → Layout (NavBar) + Outlet → HomePage
  → GameGrid → useGames(gameQuery) → game-service → RAWG /games → cards
  → card Link → /games/:slug → GameDetailPage → useGame(slug)
  → ApiClient("/games").get(slug) → RAWG /games/:slug → detail render
Unknown path / route throw → errorElement → ErrorPage
```

Query keys: list `["games", gameQuery]`, detail `["game", slug]`; both `staleTime`
`ms("24h")`, consistent with existing hooks.

## Error Handling

- Detail page: `isLoading` → `Spinner`; `error || !game` → red error `Text` with the
  query error message or "Game not found."
- Route level: `errorElement` catches loader/render errors and no-match; distinguishes
  404 (`isRouteErrorResponse && status === 404`) from generic failures.
- No new validation: `slug` param is passed through; `ApiClient.get` rejects on HTTP
  error and React Query surfaces it. `game.slug ?? game.id` fallback covers list items
  lacking `slug`.

## Security Considerations

No new trust boundaries. Routes are static (no user-controlled route construction
beyond the `slug` path param, which is URL-encoded by the router and sent as a path
segment to the pre-existing RAWG client). No auth, no user input handling, no secrets
(`VITE_RAWG_API_KEY` usage unchanged). No `dangerouslySetInnerHTML`; description
renders as plain text.

## Edge Cases

- List item without `slug`: link falls back to numeric `id`; `useGame` then fetches
  `/games/<id>`, which the RAWG API also serves. UNCLEAR (unverified against live API
  in this session) whether every list response includes `slug`.
- `description_raw` absent: detail page omits the paragraph, shows title + image only.
- Direct navigation / refresh on `/games/:slug`: requires server fallback to
  `index.html`; Vite dev handles this, production static hosts need a rewrite rule
  (see Risks).
- `GameDetailPage` renders a plain `Box` as an `Outlet` child with no `gridArea`, so
  on `lg` screens grid auto-placement puts it in the `main` column; on `base` it
  follows the nav. No visual regression check was run in a browser.
- `useGame` uses `slug!` narrowed by `enabled: !!slug`; the non-null assertion is
  contained but worth noting (see Review Focus).

## Files Changed

Committed on `refactor/using-react-routing` as `f731f9f`
(`feat: add react-router with home and game detail routes`), base `main` @ `7d322ad`:

- NEW `src/routes.tsx` — route table (17 lines).
- NEW `src/pages/Layout.tsx` — grid shell + `Outlet` (moved from `App.tsx`).
- NEW `src/pages/HomePage.tsx` — aside/main content (moved from `App.tsx`).
- NEW `src/pages/GameDetailPage.tsx` — detail view.
- NEW `src/pages/ErrorPage.tsx` — route error view.
- NEW `src/hooks/useGame.ts` — detail query hook.
- NEW `docs/refactors/using-react-routing.md` — this document (docs-only follow-up).
- MOD `package.json` + `package-lock.json` — added `react-router@8.3.1`.
- MOD `src/main.tsx` — `RouterProvider`; `App` import removed.
- MOD `src/entities/Game.ts` — `slug`, `description_raw`.
- MOD `src/components/GameCard.tsx` — card link.
- MOD `src/components/NavBar.tsx` — logo link.
- NOT changed (deliberately): `src/App.tsx`, `src/App.css` — dead but still tracked.

Worktree at documentation time is clean except untracked `.commandcode/` (harness
junk, unrelated).

## Verification

| Check | Command | Result |
|-------|---------|--------|
| Lint | `npm run lint` (`eslint .`) | PASS, exit 0, no warnings |
| Typecheck + build | `npm run build` (`tsc -b && vite build`) | PASS, exit 0; only pre-existing >500 kB chunk-size warning (`index-*.js` 668 kB, pre-existing bundle size) |
| Unit tests | — | NOT RUN — repo has no test framework (`**/*.test.*`, `**/*.spec.*` absent); no tests added |
| Browser smoke (`/` renders, card → detail, bad URL → error page) | manual `npm run dev` | NOT RUN in this session |

Acceptance criteria 5 is satisfied by evidence above; criteria 1–4 rest on code
inspection and are marked accordingly, not claimed as executed.

## Risks and Limitations

- Dead code: `src/App.tsx` / `src/App.css` remain tracked and unreferenced; should be
  deleted in a follow-up to avoid confusion.
- Production deep-links: `BrowserRouter` needs an `index.html` fallback rewrite on
  static hosts; without it, refresh on `/games/:slug` 404s at the server.
- Docs drift: installed `react-router@8.3.1`, but setup guidance was read from v7-era
  docs; APIs used match, but future v8-specific behavior should be confirmed from v8
  docs.
- Bundle size warning is pre-existing (668 kB chunk); routing added negligible weight
  but no code-splitting (`React.lazy`) was introduced — detail page ships in the main
  chunk.
- Route-error UX: non-404 failures show raw `statusText` / "Something went wrong"
  with no retry action.
- Unverified assumption: RAWG list items always carry `slug` (fallback to `id` exists
  but is untested).

## Review Focus

- `src/routes.tsx` — table shape, `errorElement` placement, `index: true` child.
- `Layout` vs old `App` grid: confirm identical areas/columns/colors (moved code).
- `GameDetailPage` grid placement: plain `Box` under `Outlet` without `gridArea` —
  confirm intended column behavior on `lg` vs `base`.
- `useGame.ts`: `enabled: !!slug` + `slug!` pairing; `["game", slug]` key hygiene.
- `GameCard` link `game.slug ?? game.id` vs `Game.slug` now required — the fallback
  is dead-typing unless API omits it; decide whether to keep or simplify.
- `Game.ts` required `slug`: confirm no other constructors/mocks of `Game` break
  (build passes, but check fixtures if added later).
- Confirm `App.tsx`/`App.css` deletion is acceptable as a follow-up.
- No auth/concurrency/migration concerns in this change.

## Documentation Notes

- Work type `refactor` chosen per branch-prefix convention (user decision 1–2);
  the detail route is new observable behavior and is scoped as such in Requirements
  rather than reclassifying the branch as `feature`.
- Requirements distinguish user-stated (U) from implementation-choice (I) items;
  detail-page field set is recorded as a choice, with the gap called out.
- Verification claims limited to executed commands with exit codes; browser criteria
  explicitly marked inspection-only.
- No application/source code was modified for this document; only
  `docs/refactors/using-react-routing.md` (new) was created.
