import type { SortStep } from './types.ts';

/**
 * Bubble Sort — yields compare + swap steps.
 * O(n²) worst/average; O(1) space; stable.
 */
export function* bubbleSort(arr: number[]): Generator<SortStep> {
  const a = arr.slice();
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { kind: 'compare', i: j, j: j + 1 };

      if (a[j] > a[j + 1]) {
        const tmp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = tmp;
        yield { kind: 'swap', i: j, j: j + 1 };
      }
    }
    // After each pass, the element at n - 1 - i is in its final position
    yield { kind: 'sorted', indices: [n - 1 - i] };
  }
  // The last remaining element is also sorted
  yield { kind: 'sorted', indices: [0] };
  yield { kind: 'done' };
}
