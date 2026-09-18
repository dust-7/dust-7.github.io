import type { SortStep } from './types.ts';

/**
 * Quick Sort (Lomuto partition) — yields compare + swap steps.
 * O(n log n) best/average; O(n²) worst; O(log n) space; not stable.
 */
export function* quickSort(arr: number[]): Generator<SortStep> {
  const a = arr.slice();

  function* qs(lo: number, hi: number): Generator<SortStep> {
    if (lo >= hi) {
      if (lo >= 0) {
        yield { kind: 'sorted', indices: [lo] };
      }
      return;
    }

    const pivotIdx = yield* partition(lo, hi);
    // The pivot is now in its final position
    yield { kind: 'sorted', indices: [pivotIdx] };

    yield* qs(lo, pivotIdx - 1);
    yield* qs(pivotIdx + 1, hi);
  }

  function* partition(lo: number, hi: number): Generator<SortStep> {
    const pivot = a[hi];

    let i = lo - 1;

    for (let j = lo; j < hi; j++) {
      yield { kind: 'compare', i: j, j: hi };

      if (a[j] <= pivot) {
        i++;
        if (i !== j) {
          const tmp = a[i];
          a[i] = a[j];
          a[j] = tmp;
          yield { kind: 'swap', i: i, j: j };
        }
      }
    }

    const tmp = a[i + 1];
    a[i + 1] = a[hi];
    a[hi] = tmp;
    yield { kind: 'swap', i: i + 1, j: hi };

    return i + 1;
  }

  yield* qs(0, a.length - 1);
  yield { kind: 'done' };
}
