import { describe, expect, test } from 'vitest';
import { algorithms } from './index.ts';
import type { SortStep } from './types.ts';

/** Collect all steps from a generator. */
function collectSteps(generator: Generator<SortStep>): SortStep[] {
  const steps: SortStep[] = [];
  let result = generator.next();
  while (!result.done) {
    steps.push(result.value);
    result = generator.next();
  }
  return steps;
}

/** Replay steps over an array copy, returning the final state. */
function replaySteps(arr: number[], steps: SortStep[]): number[] {
  const a = arr.slice();
  for (const step of steps) {
    switch (step.kind) {
      case 'swap': {
        const tmp = a[step.i];
        a[step.i] = a[step.j];
        a[step.j] = tmp;
        break;
      }
      case 'set': {
        a[step.i] = step.value;
        break;
      }
      case 'compare':
      case 'sorted':
        break; // informational only
      case 'done':
        break;
    }
  }
  return a;
}

/** Generate a random array of given length with values in [0, 999]. */
function randomArray(n: number, maxVal: number = 999): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * (maxVal + 1)));
}

describe('algorithms registry', () => {
  test('registry metadata is correct for each algorithm', () => {
    const expected: Record<string, Partial<{ name: string; stable: boolean }>> = {
      bubble: { name: 'Bubble Sort', stable: true },
      insertion: { name: 'Insertion Sort', stable: true },
      selection: { name: 'Selection Sort', stable: false },
      quick: { name: 'Quick Sort', stable: false },
      merge: { name: 'Merge Sort', stable: true },
    };

    for (const [id, exp] of Object.entries(expected)) {
      const entry = algorithms.get(id);
      expect(entry).toBeDefined();
      expect(entry!.meta.name).toBe(exp.name);
      expect(entry!.meta.stable).toBe(exp.stable);
      expect(entry!.meta.timeMin).toMatch(/^O\(/);
      expect(entry!.meta.timeAvg).toMatch(/^O\(/);
      expect(entry!.meta.timeMax).toMatch(/^O\(/);
      expect(entry!.meta.space).toMatch(/^O\(/);
    }
  });

});

describe.each([
  { id: 'bubble' },
  { id: 'insertion' },
  { id: 'selection' },
  { id: 'quick' },
  { id: 'merge' },
])('${id} sorts correctly', ({ id }) => {
  test('sorted array stays sorted', () => {
    const sorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const entry = algorithms.get(id)!;
    const steps = collectSteps(entry.generator(sorted));
    const result = replaySteps(sorted, steps);
    expect(result).toEqual(sorted);
  });

  test('reverse-sorted array becomes sorted', () => {
    const reverse = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    const entry = algorithms.get(id)!;
    const steps = collectSteps(entry.generator(reverse));
    const result = replaySteps(reverse, steps);
    expect(result).toEqual([...reverse].sort((a, b) => a - b));
  });

  test('random arrays sort correctly', () => {
    const entry = algorithms.get(id)!;
    for (let trial = 0; trial < 5; trial++) {
      const arr = randomArray(20, 500);
      const steps = collectSteps(entry.generator(arr));
      const result = replaySteps(arr, steps);
      expect(result).toEqual([...arr].sort((a, b) => a - b));
    }
  });

});

describe('algorithm correctness on edge cases', () => {
  test('empty array (n=0) — each algorithm handles gracefully', () => {
    algorithms.forEach(({ generator }) => {
      expect(() => collectSteps(generator([]))).not.toThrow();
    });
  });

});
