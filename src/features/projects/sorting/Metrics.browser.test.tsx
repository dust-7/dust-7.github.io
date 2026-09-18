import { useState } from 'react';
import { beforeEach, expect, test } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';

import Metrics from './Metrics.tsx';

function MetricsHarness() {
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  return (
    <div>
      <Metrics comparisons={comparisons} swaps={swaps} elapsedMs={elapsedMs} />
      <button data-testid="increment-comparisons" onClick={() => setComparisons((c) => c + 1)}>
        + Comp
      </button>
      <button data-testid="increment-swaps" onClick={() => setSwaps((s) => s + 1)}>
        + Swap
      </button>
      <button data-testid="set-elapsed" onClick={() => setElapsedMs(1234)}>
        Set Elapsed
      </button>
    </div>
  );
}

let screen: RenderResult;

beforeEach(async () => {
  screen = await render(<MetricsHarness />);
});

test('shows the three metric values', async () => {
  const comparisonsEl = screen.getByTestId('metric-comparisons');
  const swapsEl = screen.getByTestId('metric-swaps');
  const elapsedEl = screen.getByTestId('metric-elapsed');

  expect(comparisonsEl).toBeVisible();
  expect(swapsEl).toBeVisible();
  expect(elapsedEl).toBeVisible();
});

test('elapsed is rendered in seconds with exactly 1 decimal', async () => {
  await screen.getByTestId('set-elapsed').click();
  const elapsedEl = screen.getByTestId('metric-elapsed');
  await expect.element(elapsedEl).toHaveTextContent('1.2 s');
});

test('re-rendering with updated comparisons updates the displayed value', async () => {
  const comparisonsEl = screen.getByTestId('metric-comparisons');
  await expect.element(comparisonsEl).toHaveTextContent('0');

  await screen.getByTestId('increment-comparisons').click();
  await expect.element(comparisonsEl).toHaveTextContent('1');
});

test('re-rendering with updated swaps updates the displayed value', async () => {
  const swapsEl = screen.getByTestId('metric-swaps');
  await expect.element(swapsEl).toHaveTextContent('0');

  await screen.getByTestId('increment-swaps').click();
  await expect.element(swapsEl).toHaveTextContent('1');
});
