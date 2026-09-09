import { useState } from 'react';
import { beforeEach, expect, test } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';

import Controls from './Controls.tsx';
import type { SortStatus } from './useSorter.ts';

function ControlsHarness() {
  const [status, setStatus] = useState<SortStatus>('idle');
  const [startCalls, setStartCalls] = useState(0);
  const [pauseCalls, setPauseCalls] = useState(0);
  const [resetCalls, setResetCalls] = useState(0);

  return (
    <div>
      <Controls
        status={status}
        onStart={() => {
          setStartCalls((c) => c + 1);
          setStatus('running');
        }}
        onPause={() => {
          setPauseCalls((c) => c + 1);
          setStatus('paused');
        }}
        onReset={() => {
          setResetCalls((c) => c + 1);
          setStatus('idle');
        }}
      />
      <div data-testid="start-calls">{startCalls}</div>
      <div data-testid="pause-calls">{pauseCalls}</div>
      <div data-testid="reset-calls">{resetCalls}</div>
      <div data-testid="current-status">{status}</div>
      <button data-testid="set-running" onClick={() => setStatus('running')}>
        Set Running
      </button>
      <button data-testid="set-done" onClick={() => setStatus('done')}>
        Set Done
      </button>
      <button data-testid="set-paused" onClick={() => setStatus('paused')}>
        Set Paused
      </button>
    </div>
  );
}

let screen: RenderResult;

beforeEach(async () => {
  screen = await render(<ControlsHarness />);
});

test('shows Start button when status is idle', async () => {
  const startBtn = screen.getByTestId('start-btn');
  expect(startBtn).toBeVisible();
  await expect.element(startBtn).toHaveTextContent('Start');
});

test('clicking Start invokes onStart', async () => {
  const harness = screen.getByTestId('start-calls');
  const startBtn = screen.getByTestId('start-btn');
  await startBtn.click();
  await expect.element(harness).toHaveTextContent('1');
});

test('shows Pause button when status is running', async () => {
  await screen.getByTestId('set-running').click();
  await expect.element(screen.getByTestId('current-status')).toHaveTextContent('running');
  const pauseBtn = screen.getByTestId('pause-btn');
  expect(pauseBtn).toBeVisible();
  await expect.element(pauseBtn).toHaveTextContent('Pause');
});

test('clicking Pause invokes onPause', async () => {
  await screen.getByTestId('set-running').click();
  const harness = screen.getByTestId('pause-calls');
  const pauseBtn = screen.getByTestId('pause-btn');
  await pauseBtn.click();
  await expect.element(harness).toHaveTextContent('1');
});

test('Start button is disabled when status is done', async () => {
  await screen.getByTestId('set-done').click();
  const startBtn = screen.getByTestId('start-btn');
  expect(startBtn).toBeDisabled();
});

test('clicking Reset invokes onReset', async () => {
  const harness = screen.getByTestId('reset-calls');
  const resetBtn = screen.getByTestId('reset-btn');
  await resetBtn.click();
  await expect.element(harness).toHaveTextContent('1');
});

test('Reset button is always enabled', async () => {
  const resetBtn = screen.getByTestId('reset-btn');
  expect(resetBtn).toBeEnabled();

  await screen.getByTestId('set-done').click();
  const resetBtnDone = screen.getByTestId('reset-btn');
  expect(resetBtnDone).toBeEnabled();
});

test('paused status shows Start button and not Pause', async () => {
  await screen.getByTestId('set-paused').click();
  expect(screen.getByTestId('start-btn')).toBeVisible();
  await expect.element(screen.getByTestId('current-status')).toHaveTextContent('paused');
});
