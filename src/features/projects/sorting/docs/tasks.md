# Task List

Implements `plan.md`. All work lives in `src/features/projects/sorting/`.

**Conventions**
- Colocated tests: a test file sits next to its source (browser-mode tests `*.browser.test.tsx`, regular node tests `*.test.ts`) using vitest with `vitest-browser-react` — matching e.g. `home/Home.browser.test.tsx`.
- **Every task includes tests that verify its acceptance criteria.** A task is not done until its tests pass.

**Key design decision:** algorithms run as **generators that yield discrete steps** (compare / swap / set / mark-sorted / done) rather than mutating in place. This keeps algorithm code pure and unit-testable (no React, no timing) and makes step-by-step animation and per-step metrics trivial (task 2).

Step types (defined in task 1):

```ts
type SortStep =
  | { kind: 'compare'; i: number; j: number }
  | { kind: 'swap'; i: number; j: number }
  | { kind: 'set'; i: number; value: number } // merge sort copies
  | { kind: 'sorted'; indices: number[] }
  | { kind: 'done' };
```

---

## 1. Algorithm core (pure TS, no React)

- `algorithms/types.ts` — `SortStep` and the algorithm metadata interface.
- One file per algorithm, each exporting a generator yielding `SortStep`s: `algorithms/bubble.ts`, `algorithms/insertion.ts`, `algorithms/selection.ts`, `algorithms/quick.ts`, `algorithms/merge.ts`.
- `algorithms/index.ts` — registry mapping each algorithm to its display name, generator function, and metadata (time complexity min/avg/max, space complexity, `stable: boolean`). Textbook values; the single source of truth read by task 4 (no hardcoding in components).

**Tests** (`algorithms/algorithms.test.ts`, plain vitest): replaying each algorithm's steps over random unsorted arrays yields a correctly sorted array ending in `done` with all indices marked sorted; step counts plausible; merge sort stable; registry metadata correct.

**Acceptance:** tests pass.

## 2. `useSorter` animation driver hook

`useSorter.ts` — owns all mutable run state: `array` (20 elements), `selectedAlgorithm`, `status` (`'idle' | 'running' | 'paused' | 'done'`), `activeIndices`, `sortedIndices`, `metrics: { comparisons, swaps, elapsedMs }`, `history: SortResult[]`.

```ts
type SortResult = { algorithm: string; comparisons: number; swaps: number; elapsedSeconds: number };
```

- Drives the selected algorithm's generator one step at a time (animation frame / short interval); `start`/`pause` resume mid-run.
- `reset` re-randomizes the array and clears highlights/metrics.
- Metrics update as steps execute; elapsed accumulates only while running.
- On the `done` step, appends exactly one `SortResult` to history (`elapsedSeconds` rounded to 1 decimal).

**Public API** (consumed by tasks 3–7): `{ array, sortedIndices, activeIndices, status, metrics, history, selectedAlgorithm, start, pause, reset, clearHistory }`.

**Tests** (`useSorter.browser.test.tsx`): start runs stepwise; pause freezes and resumes from the same position; reset re-randomizes and zeroes metrics; exactly one history row on completion matching final metrics, none from pause/reset.

**Acceptance:** tests pass.

## 3. `SortBars` visualization component

`SortBars.tsx` — renders `array` (task 2) as 20 vertical bars per plan §6: height ∝ value; blue/orange/green for unsorted/active/sorted with lightness by magnitude; hover/focus glowing outline + size value.

**Tests** (`SortBars.browser.test.tsx`): 20 bars with heights reflecting values; correct color per state; lightness increases with value; hover/focus shows the size value and a glow.

**Acceptance:** tests pass.

## 4. `AlgorithmSelector` component

`AlgorithmSelector.tsx` — one MUI button per algorithm with the selection indicated; selecting an algorithm renders its info panel (time complexity min/avg/max, space complexity, stability) from the task 1 registry — no hardcoding in the component.

**Tests** (`AlgorithmSelector.browser.test.tsx`): one button per algorithm (5 total) with the selection indicated; info panel matches registry data for the currently selected algorithm.

**Acceptance:** tests pass.

## 5. `Controls` component

`Controls.tsx` — Start/Pause toggle (label flips by `status`; disabled when there is nothing to start/pause, e.g. at `done`) and Reset, wired to the `useSorter` API (task 2) via props.

**Tests** (`Controls.browser.test.tsx`): for each status the correct label is shown and clicking invokes `start`/`pause`/`reset` as expected.

**Acceptance:** tests pass.

## 6. `Metrics` component

`Metrics.tsx` — displays Comparisons, Swaps, and Elapsed time (seconds, rounded to 1 decimal) from props, updating live each render.

**Tests** (`Metrics.browser.test.tsx`): shows the three values; elapsed rendered in seconds with exactly 1 decimal; re-rendering with updated props updates the displayed values.

**Acceptance:** tests pass.

## 7. `HistoryTable` component

`HistoryTable.tsx` — MUI `Table` with one row per `SortResult` (Algorithm, Comparisons, Swaps, Elapsed s) in completion order (presentational — task 2 appends). **Clear** button calls `clearHistory`; disabled when history is empty.

**Tests** (`HistoryTable.browser.test.tsx`): empty history → no data rows and Clear disabled; N results → N rows in order with correct values; Clear invokes `clearHistory` once and is then disabled.

**Acceptance:** tests pass.

## 8. `Sorting` page assembly + responsive layout + route

`Sorting.tsx` — composes the three plan sections, each in a card/panel:
1. **Controls**: `AlgorithmSelector` + `Controls`.
2. **Metrics & Visualization**: `Metrics` + `SortBars`.
3. **History**: `HistoryTable`.

Instantiates `useSorter` once at this level and passes slices down (props only); responsive layout per plan §7 (stacked on mobile from xs, left-to-right on large screens at md and beyond); `<title>Sorting | ian</title>` matching the `Checkpoint.tsx` convention. Wires the route in `src/main.tsx`: `<Route path="sorting" element={<Sorting />} />` under `projects`.

**Tests** (`Sorting.browser.test.tsx` — `MemoryRouter` + `render`, matching `home/Home.browser.test.tsx`): all three sections render; selecting an algorithm shows its complexity info; Start toggles to Pause; Reset re-randomizes and zeroes metrics; on completion a history row appears, Clear enables, then disables after clearing.

**Acceptance:** tests pass; page reachable at `#/projects/sorting`; layout stacked at mobile width and left-to-right at desktop width (viewport check).

## 9. Dark-theme styling pass

- Consistent professional dark theme (root theme is already `mode: 'dark'`): panel backgrounds/borders, typographic hierarchy, spacing, bar palette and hover glow tuned for the dark background (glow must not clip), consistent accent usage matching site style.

**Acceptance:** visual QA — no white flashes, no clipped glows, readable contrast at mobile and desktop sizes.

## 10. Final verification

- `npm test` (all colocated tests from tasks 1–8), `npm run lint`, and `npm run build` all pass.
- Manual QA checklist:
  - [ ] Exactly 20 bars, re-randomized on Reset.
  - [ ] All 5 algorithms complete to a fully green, sorted array.
  - [ ] Orange highlights visible during swaps; blue → green transitions correct.
  - [ ] Elapsed time sane per algorithm (bubble noticeably slower than merge).
  - [ ] History row values match the live metrics at completion.
  - [ ] Mobile: sections stacked; Desktop: left-to-right.

---

## Dependency order

```
1 (algorithms + tests) ──► 2 (useSorter + tests) ──┬─► 3 (SortBars)  ─┐
   └─ registry metadata ──► 4 (AlgorithmSelector) ──┼─► 8 (page + tests) ─► 9 (theme) ─► 10
                    2 ─► 5 (Controls)   ─┐           │
                    2 ─► 6 (Metrics)    ─┼───────────┤
                    2 ─► 7 (History)    ─┘───────────┘
```

Tasks 3–7 are independent of each other once task 2 exists. Each task is delivered with its tests; the global suite only grows green as tasks land.
