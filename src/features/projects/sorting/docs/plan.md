# Implementation Plan

React page that animates sorting algorithms in real time, with controls, live metrics, and a run history.

## 1. Algorithms
User-selectable: Bubble Sort, Insertion Sort, Selection Sort, Quick Sort, Merge Sort.

## 2. Array
- Exactly 20 elements, each with a random size/height.
- Re-randomized on Reset.

## 3. Controls
- **Algorithm Selector** (buttons). When an algorithm is selected, show its:
  - Time complexity (min / avg / max)
  - Space complexity
  - Stable (yes / no)
- **Start/Pause**: toggle button to begin/pause the animation.
- **Reset**: stop, reset, and re-randomize the array.

## 4. Live Metrics (updated during sorting)
- Comparisons performed
- Swaps performed
- Elapsed time (seconds, rounded to 1 decimal)

## 5. History Table
- On sort completion, append a row: algorithm name, comparisons, swaps, elapsed time (seconds).
- Clear-history button; disabled when history is empty.

## 6. Visual Design
- Dark theme; modern, professional, visually appealing.
- Elements rendered as vertical bars.
- Color coding: **blue** = unsorted, **orange** = currently swapping, **green** = sorted.
- Color intensity: larger elements lighter, smaller elements darker.
- Hover: glowing outline + show the element's size.

## 7. Layout
- Mobile-responsive. Three sections: stacked top-to-bottom on small screens (from xs), left-to-right on larger screens (md and beyond).
  1. **Controls**: algorithm selector (with complexities/stability info), Start/Pause + Reset.
  2. **Metrics & Visualization**: live metrics, animated bar chart.
  3. **History Table**: completed sorts + clear button.

## 8. Technical Constraints
- All components in `./src/features/projects/sorting/`.
- Mobile-responsive layout.
