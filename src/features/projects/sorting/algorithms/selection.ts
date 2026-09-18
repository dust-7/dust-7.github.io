import type { SortStep } from './types.ts';

/**
 * Selection Sort — yields compare + swap steps.
 * O(n²) worst/average; O(1) space; not stable.
 */
export function* selectionSort(arr: number[]): Generator<SortStep> {
  const a = arr.slice();
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      yield { kind: 'compare', i: minIdx, j };

      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      const tmp = a[i];
      a[i] = a[minIdx];
      a[minIdx] = tmp;
      yield { kind: 'swap', i: i, j: minIdx };
    }
    // After each pass, the element at i is in its final position
    yield { kind: 'sorted', indices: [i] };
  }
  // The last remaining element is also sorted
  yield { kind: 'sorted', indices: [n - 1] };
  yield { kind: 'done' };
}
