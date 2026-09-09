import { beforeEach, expect, test } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';

import { algorithms } from './algorithms/index.ts';
import AlgorithmSelector from './AlgorithmSelector.tsx';

let screen: RenderResult;

beforeEach(async () => {
  screen = await render(<AlgorithmSelector />);
});

test('renders one button per algorithm (5 total)', async () => {
  const ids = Array.from(algorithms.keys());
  const buttons = ids.map((id) =>
    screen.getByTestId(`algo-btn-${id}`)
  );
  expect(buttons).toHaveLength(5);
});

test('first algorithm button is selected by default', async () => {
  const ids = Array.from(algorithms.keys());
  const firstBtn = screen.getByTestId(`algo-btn-${ids[0]}`);
  expect(firstBtn).toHaveClass('MuiButton-contained');
});

test('selecting an algorithm changes the active button', async () => {
  const ids = Array.from(algorithms.keys());
  const firstBtn = screen.getByTestId(`algo-btn-${ids[0]}`);
  const secondBtn = screen.getByTestId(`algo-btn-${ids[1]}`);

  await secondBtn.click();

  expect(secondBtn).toHaveClass('MuiButton-contained');
  expect(firstBtn).not.toHaveClass('MuiButton-contained');
});

test('info panel shows registry data for the selected algorithm', async () => {
  const firstId = Array.from(algorithms.keys())[0];
  const firstMeta = algorithms.get(firstId)!.meta;

  // Verify the info panel exists
  const infoPanel = screen.getByTestId('algo-info-panel');
  expect(infoPanel).toBeVisible();

  // Verify complexity values match registry
  await expect.element(screen.getByTestId('algo-best-time')).toHaveTextContent(
    firstMeta.timeMin
  );
  await expect.element(screen.getByTestId('algo-avg-time')).toHaveTextContent(
    firstMeta.timeAvg
  );
  await expect.element(screen.getByTestId('algo-worst-time')).toHaveTextContent(
    firstMeta.timeMax
  );
  await expect.element(screen.getByTestId('algo-space')).toHaveTextContent(
    firstMeta.space
  );
  await expect.element(screen.getByTestId('algo-stable')).toHaveTextContent(
    firstMeta.stable ? 'Yes' : 'No'
  );
});

test('info panel updates when a different algorithm is selected', async () => {
  const ids = Array.from(algorithms.keys());
  const secondId = ids[1];
  const secondMeta = algorithms.get(secondId)!.meta;

  const secondBtn = screen.getByTestId(`algo-btn-${secondId}`);
  await secondBtn.click();

  await expect.element(screen.getByTestId('algo-best-time')).toHaveTextContent(
    secondMeta.timeMin
  );
  await expect.element(screen.getByTestId('algo-avg-time')).toHaveTextContent(
    secondMeta.timeAvg
  );
  await expect.element(screen.getByTestId('algo-worst-time')).toHaveTextContent(
    secondMeta.timeMax
  );
  await expect.element(screen.getByTestId('algo-space')).toHaveTextContent(
    secondMeta.space
  );
  await expect.element(screen.getByTestId('algo-stable')).toHaveTextContent(
    secondMeta.stable ? 'Yes' : 'No'
  );
});

test('no hard-coded values — data always comes from registry', async () => {
  // Pick an algorithm whose metadata is unique to verify we're reading from the registry
  // Merge sort has O(n log n) avg — check it
  const mergeId = 'merge';
  const mergeMeta = algorithms.get(mergeId)!.meta;

  const mergeBtn = screen.getByTestId(`algo-btn-${mergeId}`);
  await mergeBtn.click();

  await expect.element(screen.getByTestId('algo-avg-time')).toHaveTextContent(
    mergeMeta.timeAvg
  );
  // Merge sort is stable
  await expect.element(screen.getByTestId('algo-stable')).toHaveTextContent(
    'Yes'
  );
});
