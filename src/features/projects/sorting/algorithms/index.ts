import type { AlgorithmMeta, SortGenerator } from './types.ts';
import { bubbleSort } from './bubble.ts';
import { insertionSort } from './insertion.ts';
import { selectionSort } from './selection.ts';
import { quickSort } from './quick.ts';
import { mergeSort } from './merge.ts';

/** Registry mapping algorithm id to metadata and generator function. */
export const algorithms: ReadonlyMap<string, { meta: AlgorithmMeta; generator: SortGenerator }> = new Map([
  [
    'bubble',
    {
      meta: {
        name: 'Bubble Sort',
        timeMin: 'O(n)',
        timeAvg: 'O(n²)',
        timeMax: 'O(n²)',
        space: 'O(1)',
        stable: true,
      },
      generator: bubbleSort,
    },
  ],
  [
    'insertion',
    {
      meta: {
        name: 'Insertion Sort',
        timeMin: 'O(n)',
        timeAvg: 'O(n²)',
        timeMax: 'O(n²)',
        space: 'O(1)',
        stable: true,
      },
      generator: insertionSort,
    },
  ],
  [
    'selection',
    {
      meta: {
        name: 'Selection Sort',
        timeMin: 'O(n²)',
        timeAvg: 'O(n²)',
        timeMax: 'O(n²)',
        space: 'O(1)',
        stable: false,
      },
      generator: selectionSort,
    },
  ],
  [
    'quick',
    {
      meta: {
        name: 'Quick Sort',
        timeMin: 'O(n log n)',
        timeAvg: 'O(n log n)',
        timeMax: 'O(n²)',
        space: 'O(log n)',
        stable: false,
      },
      generator: quickSort,
    },
  ],
  [
    'merge',
    {
      meta: {
        name: 'Merge Sort',
        timeMin: 'O(n log n)',
        timeAvg: 'O(n log n)',
        timeMax: 'O(n log n)',
        space: 'O(n)',
        stable: true,
      },
      generator: mergeSort,
    },
  ],
]);
