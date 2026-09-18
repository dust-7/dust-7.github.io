import { beforeEach, expect, test } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';
import { MemoryRouter } from 'react-router';

import Sorting from './Sorting.tsx';

let screen: RenderResult;

async function tickInterval(ms = 20) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

beforeEach(async () => {
  screen = await render(
    <MemoryRouter>
      <Sorting />
    </MemoryRouter>
  );
});

test('all three sections render', async () => {
  const controlsSection = screen.getByTestId('controls-section');
  const visualizationSection = screen.getByTestId('visualization-section');
  const historySection = screen.getByTestId('history-section');

  expect(controlsSection).toBeVisible();
  expect(visualizationSection).toBeVisible();
  expect(historySection).toBeVisible();
});

test('algorithm selector renders all 5 algorithms', async () => {
  const algoButtons = ['bubble', 'insertion', 'selection', 'quick', 'merge'];
  for (const id of algoButtons) {
    const btn = screen.getByTestId(`algo-btn-${id}`);
    expect(btn).toBeVisible();
  }
});

test('selecting an algorithm shows its complexity info', async () => {
  const secondBtn = screen.getByTestId('algo-btn-insertion');
  await secondBtn.click();

  const infoPanel = screen.getByTestId('algo-info-panel');
  expect(infoPanel).toBeVisible();
  await expect.element(screen.getByTestId('algo-best-time')).toHaveTextContent('O(n)');
  await expect.element(screen.getByTestId('algo-avg-time')).toHaveTextContent('O(n²)');
  await expect.element(screen.getByTestId('algo-worst-time')).toHaveTextContent('O(n²)');
});

test('Start toggles to Pause during execution', async () => {
  const startBtn = screen.getByRole('button', { name: /start/i });
  await startBtn.click();

  const pauseBtn = screen.getByRole('button', { name: /pause/i });
  expect(pauseBtn).toBeVisible();
});

test('Reset re-randomizes and zeroes metrics', async () => {
  await screen.getByRole('button', { name: /start/i }).click();
  await tickInterval(100);

  await expect.element(screen.getByTestId('metric-comparisons')).not.toHaveTextContent('0');
  await expect.element(screen.getByTestId('metric-swaps')).not.toHaveTextContent('0');

  await screen.getByRole('button', { name: /reset/i }).click();
  await expect.element(screen.getByTestId('metric-comparisons')).toHaveTextContent('0');
  await expect.element(screen.getByTestId('metric-swaps')).toHaveTextContent('0');
});

test('visualization renders SortBars with 20 bars', async () => {
  // SortBars renders bars as divs with data-testid="bar-{index}"
  const bars = screen.getByTestId(/bar-/);
  expect(bars).toHaveLength(20);
});

test('empty history → Clear button is disabled', async () => {
  const clearBtn = screen.getByTestId('clear-history-btn');
  expect(clearBtn).toBeDisabled();
});

test('history table shows no data rows when empty', async () => {
  const rows = screen.getByTestId('history-table-body').getByRole('row');
  // Only header row, no data rows
  expect(rows).toHaveLength(1);
});

test('on completion a history row appears, Clear removes row', async () => {
  await screen.getByTestId('algo-btn-quick').click();
  await screen.getByRole('button', { name: /start/i }).click();

  // Wait for completion by checking for data rows in the history table
  const rows = screen.getByTestId('history-table-body').getByRole('row');
  let elapsed = 0;
  const maxWait = 10000;
  while (elapsed < maxWait) {
    // First row is header, data rows start from index 1
    if (rows.length > 1) break;

    await tickInterval(100);
    elapsed += 100;
  }

  // Clear button should be enabled after history has entries
  const clearBtn = screen.getByTestId('clear-history-btn');
  expect(clearBtn).toBeEnabled();

  await clearBtn.click();
  expect(rows).toHaveLength(1);
  expect(clearBtn).toBeDisabled();
});
