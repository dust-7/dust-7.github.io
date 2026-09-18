import { useCallback, useRef, useState } from 'react';

import { algorithms } from './algorithms/index.ts';
import type { SortStep } from './algorithms/types.ts';

/** Result recorded after a sort completes, used for history entries. */
export interface SortResult {
  algorithm: string;
  comparisons: number;
  swaps: number;
  elapsedSeconds: number;
}

/** Lifecycle states for a sort run. */
export type SortStatus = 'idle' | 'running' | 'paused' | 'done';

interface Metrics {
  comparisons: number;
  swaps: number;
  elapsedMs: number;
}

const ARRAY_LENGTH = 20;

const MAX_VALUE = 100;

export const ANIMATION_INTERVAL_MS = 50;

function randomInt(max: number): number {
  return 5 + Math.floor(Math.random() * (max - 4));
}

/** Generate a random array of given length, ensuring it differs from `existing` if provided. */
function generateRandomArray(length: number, maxVal: number, existing?: number[]): number[] {
  const result = Array.from({ length }, () => randomInt(maxVal));
  if (existing && result.length === existing.length) {
    const same = result.every((val, i) => val === existing[i]);
    if (same) return generateRandomArray(length, maxVal, existing);
  }
  return result;
}

/**
 * Hook that drives a sorting algorithm's step generator with animation timing.
 *
 * Public API:
 *   array, sortedIndices, activeIndices, status, metrics, history,
 *   selectedAlgorithm, start, pause, reset, clearHistory
 */
export function useSorter({ animationIntervalMs = ANIMATION_INTERVAL_MS }: { animationIntervalMs?: number } = {}) {
  const [array, setArray] = useState<number[]>(() => generateRandomArray(ARRAY_LENGTH, MAX_VALUE));
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>(() => Array.from(algorithms.keys())[0]);
  const [status, setStatus] = useState<SortStatus>('idle');
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ comparisons: 0, swaps: 0, elapsedMs: 0 });
  const [history, setHistory] = useState<SortResult[]>([]);

  const generatorRef = useRef<Generator<SortStep> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedElapsedRef = useRef<number>(0);
  const metricsRef = useRef<Metrics>({ comparisons: 0, swaps: 0, elapsedMs: 0 });
  const doneRef = useRef<boolean>(false);
  const pausedRef = useRef<boolean>(false);

  /** Advance the algorithm generator by one step, updating indices and metrics accordingly. */
  const advanceStep = useCallback(() => {
    const gen = generatorRef.current;
    if (!gen || doneRef.current) return;

    const result = gen.next();

    if (result.done) {
      return;
    }

    const step = result.value;

    switch (step.kind) {
      case 'compare': {
        metricsRef.current.comparisons++;
        setActiveIndices([step.i, step.j]); // Highlight both elements being compared
        break;
      }
      case 'swap': {
        metricsRef.current.swaps++;
        setActiveIndices([step.i, step.j]); // Highlight elements being swapped
        setArray(prev => {
          const next = [...prev];
          [next[step.i], next[step.j]] = [next[step.j], next[step.i]];
          return next;
        });
        break;
      }
      case 'set': {
        setActiveIndices([step.i]); // Highlight a single element
        setArray(prev => {
          const next = [...prev];
          next[step.i] = step.value;
          return next;
        });
        break;
      }
      case 'sorted': {
        setSortedIndices(prev => [...new Set([...prev, ...step.indices])]);
        setActiveIndices([]);
        break;
      }
      case 'done': {
        doneRef.current = true;

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        const elapsedSeconds = Math.round((pausedElapsedRef.current / 1000) * 10) / 10;
        const finalMetrics = { ...metricsRef.current };
        setMetrics(finalMetrics);
        setSortedIndices(Array.from({ length: ARRAY_LENGTH }, (_, k) => k));
        setActiveIndices([]);
        setStatus('done');

        setHistory((prev) => [
          ...prev,
          {
            algorithm: algorithms.get(selectedAlgorithm)!.meta.name,
            comparisons: finalMetrics.comparisons,
            swaps: finalMetrics.swaps,
            elapsedSeconds,
          },
        ]);
        break;
      }
    }
  }, [selectedAlgorithm, setArray]);

  const start = useCallback(() => {
    if (status === 'done') return;

    if (status === 'idle' || !generatorRef.current) {
      // Fresh start — create a new generator from current array
      const entry = algorithms.get(selectedAlgorithm);
      if (!entry) return;
      generatorRef.current = entry.generator(array);
      metricsRef.current = { comparisons: 0, swaps: 0, elapsedMs: 0 };
      pausedElapsedRef.current = 0;
      doneRef.current = false;
      pausedRef.current = false;
      startTimeRef.current = performance.now();
      setSortedIndices([]);
      setActiveIndices([]);
      setMetrics({ comparisons: 0, swaps: 0, elapsedMs: 0 });
    } else {
      // Resuming from pause
      doneRef.current = false;
      pausedRef.current = false;
      startTimeRef.current = performance.now() - pausedElapsedRef.current;
    }

    setStatus('running');

    intervalRef.current = setInterval(() => {
      if (pausedRef.current) return;
      const elapsed = performance.now() - startTimeRef.current;
      pausedElapsedRef.current = elapsed;
      metricsRef.current.elapsedMs = elapsed;

      advanceStep();
      setMetrics({ ...metricsRef.current });
    }, animationIntervalMs);
  }, [status, array, selectedAlgorithm, advanceStep, animationIntervalMs]);

  /** Pause the current sort animation. */
  const pause = useCallback(() => {
    if (status !== 'running') return;

    pausedRef.current = true;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    pausedElapsedRef.current = performance.now() - startTimeRef.current;
    metricsRef.current.elapsedMs = pausedElapsedRef.current;
    setMetrics({ ...metricsRef.current });

    setStatus('paused');
  }, [status]);

  /** Reset: re-randomize array, clear all state. */
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    generatorRef.current = null;
    doneRef.current = false;
    setArray(generateRandomArray(ARRAY_LENGTH, MAX_VALUE, array));
    setSortedIndices([]);
    setActiveIndices([]);
    setMetrics({ comparisons: 0, swaps: 0, elapsedMs: 0 });
    setStatus('idle');
  }, [array]);

  /** Clear the sort history. */
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    array,
    sortedIndices,
    activeIndices,
    status,
    metrics,
    history,
    selectedAlgorithm,
    setSelectedAlgorithm,
    start,
    pause,
    reset,
    clearHistory,
  };
}
