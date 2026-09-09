import type { SortStep } from './types.ts';

/**
 * Merge Sort — yields compare + set steps.
 * O(n log n) best/average/worst; O(n) space; stable.
 */
export function* mergeSort(arr: number[]): Generator<SortStep> {
  const a = arr.slice();

  function* ms(lo: number, hi: number, depth: number): Generator<SortStep> {
    if (lo >= hi) return;

    const mid = Math.floor((lo + hi) / 2);
    yield* ms(lo, mid, depth + 1);
    yield* ms(mid + 1, hi, depth + 1);
    yield* merge(lo, mid, hi, depth);
  }

  function* merge(lo: number, mid: number, hi: number, depth: number): Generator<SortStep> {
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    let i = 0;
    let j = 0;
    let k = lo;

    while (i < left.length && j < right.length) {
      yield { kind: 'compare', i: lo + i, j: mid + 1 + j };

      if (left[i] <= right[j]) {
        a[k] = left[i];
        i++;
      } else {
        a[k] = right[j];
        j++;
      }
      yield { kind: 'set', i: k, value: a[k] };
      // Only mark as sorted during the top-level merge (depth 0)
      if (depth === 0) {
        yield { kind: 'sorted', indices: [k] };
      }
      k++;
    }

    while (i < left.length) {
      a[k] = left[i];
      yield { kind: 'set', i: k, value: a[k] };
      if (depth === 0) {
        yield { kind: 'sorted', indices: [k] };
      }
      i++;
      k++;
    }

    while (j < right.length) {
      a[k] = right[j];
      yield { kind: 'set', i: k, value: a[k] };
      if (depth === 0) {
        yield { kind: 'sorted', indices: [k] };
      }
      j++;
      k++;
    }
  }

  yield* ms(0, a.length - 1, 0);
  yield { kind: 'done' };
}
