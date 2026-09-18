/**
 * Step types yielded by each sorting algorithm generator.
 */
export type SortStep =
  | { kind: 'compare'; i: number; j: number }
  | { kind: 'swap'; i: number; j: number }
  | { kind: 'set'; i: number; value: number }
  | { kind: 'sorted'; indices: number[] }
  | { kind: 'done' };

/** Metadata about a sorting algorithm, used by the registry and UI. */
export interface AlgorithmMeta {
  name: string;
  timeMin: string;
  timeAvg: string;
  timeMax: string;
  space: string;
  stable: boolean;
}

/** A generator function that yields SortStep sequences for a given array. */
export type SortGenerator = (arr: number[]) => Generator<SortStep>;
