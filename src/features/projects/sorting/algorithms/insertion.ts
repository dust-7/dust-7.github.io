import type { SortStep } from './types.ts';

/**
 * Insertion Sort — yields compare + swap steps.
 * O(n²) worst/average; O(1) space; stable.
 */
export function* insertionSort(arr: number[]): Generator<SortStep> {
  const a = arr.slice();
  const n = a.length;

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;

    while (j >= 0) {
      yield { kind: 'compare', i: j, j: i };

      if (a[j] > key) {
        a[j + 1] = a[j];
        yield { kind: 'swap', i: j, j: j + 1 };
        j--;
      } else {
        break;
      }
    }

    a[j + 1] = key;
    yield { kind: 'set', i: j + 1, value: key };
    // The sorted prefix 0..i is now in place
    const sortedPrefix = Array.from({ length: i + 1 }, (_, k) => k);
    yield { kind: 'sorted', indices: sortedPrefix };
  }
  yield { kind: 'done' };
}
