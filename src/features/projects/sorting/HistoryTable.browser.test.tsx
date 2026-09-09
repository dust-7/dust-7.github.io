import { useState } from 'react';
import { expect, test } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';

import HistoryTable from './HistoryTable.tsx';
import type { SortResult } from './useSorter.ts';

const mockResults: SortResult[] = [
  { algorithm: 'Bubble Sort', comparisons: 190, swaps: 180, elapsedSeconds: 2.3 },
  { algorithm: 'Merge Sort', comparisons: 86, swaps: 42, elapsedSeconds: 0.8 },
  { algorithm: 'Quick Sort', comparisons: 72, swaps: 15, elapsedSeconds: 0.5 },
];

function HistoryTableHarness() {
  const [history, setHistory] = useState<SortResult[]>([]);
  const [clearCalls, setClearCalls] = useState(0);

  const handleClear = () => {
    setClearCalls((c) => c + 1);
    setHistory([]);
  };

  return (
    <div>
      <HistoryTable history={history} onClear={handleClear} />
      <div data-testid="clear-calls">{clearCalls}</div>
      <div data-testid="history-count">{history.length}</div>
      <button data-testid="add-history" onClick={() => setHistory(mockResults)}>
        Add History
      </button>
    </div>
  );
}

let screen: RenderResult;

test('empty history → no data rows and Clear disabled', async () => {
  screen = await render(<HistoryTableHarness />);

  const rows = screen.getByRole('row');
  // Header row only, no data rows
  expect(rows).toHaveLength(1);

  const clearBtn = screen.container.querySelector('[data-testid="clear-history-btn"]') as HTMLButtonElement;
  expect(clearBtn.disabled).toBe(true);
});

test('N results → N rows in order with correct values', async () => {
  screen = await render(<HistoryTableHarness />);

  // Restore history to populate rows
  await screen.getByTestId('add-history').click();

  const rows = screen.getByRole('row');

  // Header + 3 data rows
  expect(rows).toHaveLength(4);

  // Row 1: Bubble Sort
  const cells1 = rows.nth(1).getByRole('cell');
  await expect.element(cells1.nth(0)).toHaveTextContent('Bubble Sort');
  await expect.element(cells1.nth(1)).toHaveTextContent('190');
  await expect.element(cells1.nth(2)).toHaveTextContent('180');
  await expect.element(cells1.nth(3)).toHaveTextContent('2.3');

  // Row 2: Merge Sort
  const cells2 = rows.nth(2).getByRole('cell');
  await expect.element(cells2.nth(0)).toHaveTextContent('Merge Sort');
  await expect.element(cells2.nth(1)).toHaveTextContent('86');
  await expect.element(cells2.nth(2)).toHaveTextContent('42');
  await expect.element(cells2.nth(3)).toHaveTextContent('0.8');

  // Row 3: Quick Sort
  const cells3 = rows.nth(3).getByRole('cell');
  await expect.element(cells3.nth(0)).toHaveTextContent('Quick Sort');
  await expect.element(cells3.nth(1)).toHaveTextContent('72');
  await expect.element(cells3.nth(2)).toHaveTextContent('15');
  await expect.element(cells3.nth(3)).toHaveTextContent('0.5');
});

test('Clear invokes onClear once and is then disabled', async () => {
  screen = await render(<HistoryTableHarness />);

  // Add history to have data to clear
  await screen.getByTestId('add-history').click();

  const clearBtn = screen.getByTestId('clear-history-btn');
  const clearCallsEl = screen.getByTestId('clear-calls');

  // Initially enabled
  expect(clearBtn).toBeEnabled();

  await clearBtn.click();

  // Clear called exactly once
  await expect.element(clearCallsEl).toHaveTextContent('1');

  // No more data rows
  const rows = screen.getByRole('row');
  expect(rows).toHaveLength(1); // header only

  // Clear button should now be disabled
  expect(clearBtn).toBeDisabled();

  // Clicking disabled button should not increment (force click to bypass enabled check)
  await clearBtn.click({ force: true });
  await expect.element(clearCallsEl).toHaveTextContent('1');
});
