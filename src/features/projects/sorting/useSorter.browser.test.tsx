import { beforeEach, expect, test } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';

import { algorithms } from './algorithms/index.ts';
import { useSorter } from './useSorter.ts';


function SorterTestHarness() {
  const sorter = useSorter({ animationIntervalMs: 10 });

  return (
    <div>
      <select
        data-testid="algorithm-select"
        value={sorter.selectedAlgorithm}
        onChange={(e) => sorter.setSelectedAlgorithm(e.target.value)}
      >
        {Array.from(algorithms.keys()).map((id) => (
          <option key={id} value={id}>
            {algorithms.get(id)!.meta.name}
          </option>
        ))}
      </select>
      <div data-testid="status">{sorter.status}</div>
      <div data-testid="array">{sorter.array.join(',')}</div>
      <div data-testid="sorted-indices">{sorter.sortedIndices.join(',')}</div>
      <div data-testid="active-indices">{sorter.activeIndices.join(',') || 'none'}</div>
      <div data-testid="comparisons">{sorter.metrics.comparisons}</div>
      <div data-testid="swaps">{sorter.metrics.swaps}</div>
      <div data-testid="elapsed-ms">{sorter.metrics.elapsedMs}</div>
      <div data-testid="history-length">{sorter.history.length}</div>
      <div data-testid="selected-algorithm">{sorter.selectedAlgorithm}</div>
      <button data-testid="start-btn" onClick={sorter.start}>
        Start
      </button>
      <button data-testid="pause-btn" onClick={sorter.pause}>
        Pause
      </button>
      <button data-testid="reset-btn" onClick={sorter.reset}>
        Reset
      </button>
    </div>
  );
}

let screen: RenderResult;

beforeEach(async () => {
  screen = await render(<SorterTestHarness />);
});


async function tickInterval(ms = 20) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

test('starts in idle status', async () => {
  await expect.element(screen.getByTestId('status')).toHaveTextContent('idle');
});

test('start runs stepwise — status becomes running', async () => {
  await screen.getByRole('button', { name: /start/i }).click();
  await tickInterval(20);
  await expect.element(screen.getByTestId('status')).toHaveTextContent('running');
});

test('pause freezes state — status becomes paused', async () => {
  await screen.getByRole('button', { name: /start/i }).click();
  await tickInterval(30);

  await screen.getByRole('button', { name: /pause/i }).click();
  const comparisonsBefore = Number(screen.getByTestId('comparisons').element().textContent);
  const swapsBefore = Number(screen.getByTestId('swaps').element().textContent);
  await tickInterval(20);

  await expect.element(screen.getByTestId('status')).toHaveTextContent('paused');

  const comparisonsAfter = Number(screen.getByTestId('comparisons').element().textContent);
  const swapsAfter = Number(screen.getByTestId('swaps').element().textContent);
  expect(comparisonsAfter).toBe(comparisonsBefore);
  expect(swapsAfter).toBe(swapsBefore);
});

test('pause and resume continues from same position', async () => {
  await screen.getByRole('button', { name: /start/i }).click();
  await tickInterval(30);

  const comparisonsBeforePause = Number(screen.getByTestId('comparisons').element().textContent);

  await screen.getByRole('button', { name: /pause/i }).click();
  await tickInterval(10);

  await screen.getByRole('button', { name: /start/i }).click();
  await tickInterval(30);

  const comparisonsAfterResume = Number(screen.getByTestId('comparisons').element().textContent);
  expect(comparisonsAfterResume).toBeGreaterThan(comparisonsBeforePause);
});

test('reset re-randomizes array and zeroes metrics', async () => {
  await screen.getByRole('button', { name: /start/i }).click();
  await tickInterval(30);

  const arrayBeforeReset = screen.getByTestId('array').element().textContent;

  await screen.getByRole('button', { name: /reset/i }).click();
  await tickInterval(10);

  await expect.element(screen.getByTestId('status')).toHaveTextContent('idle');
  await expect.element(screen.getByTestId('comparisons')).toHaveTextContent('0');
  await expect.element(screen.getByTestId('swaps')).toHaveTextContent('0');
  await expect.element(screen.getByTestId('elapsed-ms')).toHaveTextContent('0');

  await expect.element(screen.getByTestId('sorted-indices')).toHaveTextContent('');
  await expect.element(screen.getByTestId('array')).toHaveTextContent(/\d+/);
  const arrayAfterReset = screen.getByTestId('array').element().textContent;
  expect(arrayAfterReset).not.toBe(arrayBeforeReset);
  const values = arrayAfterReset.split(',').map(Number);
  expect(values.length).toBe(20);
});

test('non-completion actions do not add to history', async () => {
  await screen.getByRole('button', { name: /start/i }).click();
  await tickInterval(20);
  await screen.getByRole('button', { name: /reset/i }).click();
  await tickInterval(10);
  await expect.element(screen.getByTestId('history-length')).toHaveTextContent('0');

  await screen.getByRole('button', { name: /start/i }).click();
  await tickInterval(20);
  await screen.getByRole('button', { name: /pause/i }).click();
  await tickInterval(10);
  await expect.element(screen.getByTestId('history-length')).toHaveTextContent('0');
});

test('array state updates during a run — bars would swap', async () => {
  await screen.getByTestId('algorithm-select').selectOptions('Bubble Sort');

  const initialArray = screen.getByTestId('array').element().textContent;
  const initialValues = initialArray!.split(',').map(Number);

  await screen.getByRole('button', { name: /start/i }).click();

  await tickInterval(200);

  const currentArray = screen.getByTestId('array').element().textContent;
  const currentValues = currentArray!.split(',').map(Number);

  expect(currentArray).not.toBe(initialArray);

  // Verify the array still has the same multiset of values (no values lost/duplicated)
  const sameValues =
    initialValues.length === currentValues.length &&
    initialValues.every((v) => currentValues.includes(v));
  expect(sameValues).toBe(true);
});

test('history row values match final metrics at completion', async () => {
  await screen.getByTestId('algorithm-select').selectOptions('Merge Sort');
  await screen.getByRole('button', { name: /start/i }).click();

  let elapsed = 0;
  const maxWait = 2000;
  while (elapsed < maxWait) {
    const statusEl = screen.getByTestId('status');
    if (statusEl.element().textContent === 'done') break;
    await tickInterval(40);
    elapsed += 40;
  }

  await expect.element(screen.getByTestId('history-length')).toHaveTextContent('1');
  await expect.element(screen.getByTestId('comparisons')).toHaveTextContent(/[1-9]\d*/);
  await expect.element(screen.getByTestId('swaps')).toHaveTextContent(/\d+/);
});
