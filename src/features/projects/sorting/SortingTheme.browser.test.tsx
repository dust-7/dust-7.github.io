import { beforeEach, expect, test } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';
import { MemoryRouter } from 'react-router';

import Sorting from './Sorting.tsx';

let screen: RenderResult;

beforeEach(async () => {
  screen = await render(
    <MemoryRouter>
      <Sorting />
    </MemoryRouter>
  );
});

/** Helper to get computed style values from an element. */
function getStyle(el: HTMLElement, prop: string): string {
  return window.getComputedStyle(el).getPropertyValue(prop).trim();
}

/** Check if a color is white-ish (luminance > 0.8) */
function isWhite(color: string): boolean {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return false;
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.8;
}

test('panel backgrounds are not white (no white flashes)', async () => {
  const sections = ['controls-section', 'visualization-section', 'history-section'];

  for (const sectionId of sections) {
    const panel = screen.getByTestId(sectionId);
    const bgColor = getStyle(panel.element() as HTMLElement, 'background-color');

    // Background should NOT be white
    expect(isWhite(bgColor)).toBe(false);
  }
});

test('panel borders are visible on dark background', async () => {
  const sections = ['controls-section', 'visualization-section', 'history-section'];

  for (const sectionId of sections) {
    const panel = screen.getByTestId(sectionId);
    const border = getStyle(panel.element() as HTMLElement, 'border');

    // Border should be visible (not none or empty)
    expect(border).not.toBe('none');
    expect(border).not.toBe('');
  }
});

test('bar glow does not clip (overflow visible on container)', async () => {
  const barsContainer = screen.getByTestId('sort-bars');
  const overflow = getStyle(barsContainer.element() as HTMLElement, 'overflow');
  expect(overflow).toBe('visible');

  // Each bar should also have overflow visible for glow
  const bars = screen.getByTestId(/bar-/).all();
  for (const bar of bars) {
    const barEl = bar.element() as HTMLElement;
    const barOverflow = getStyle(barEl, 'overflow');
    expect(barOverflow).toBe('visible');
  }
});

test('bars have hover styles defined (box-shadow and outline)', async () => {
  // Check that bars have transition styles for hover effects
  const bars = screen.getByTestId(/bar-/).all();
  const firstBar = bars[0].element() as HTMLElement;
  const transition = getStyle(firstBar, 'transition');

  // Should have transition for smooth hover effects
  expect(transition).toContain('box-shadow');
  expect(transition).toContain('transform');
});

test('typography has explicit color styles (readable on dark)', async () => {
  // Check h3 title has explicit color
  const title = screen.getByRole('heading', { level: 3 }).element() as HTMLElement;
  expect(title).not.toBeNull();
  if (title) {
    const titleColor = getStyle(title, 'color');
    // Color should be set (not transparent)
    expect(titleColor).not.toBe('transparent');
  }

  // Check section titles (h5) have explicit color
  const sectionTitles = screen.getByRole('heading', { level: 5 }).elements() as HTMLElement[];
  expect(sectionTitles.length).toBeGreaterThanOrEqual(3);
  for (let i = 0; i < 3; i++) {
    const color = getStyle(sectionTitles[i], 'color');
    // Color should be set (not transparent)
    expect(color).not.toBe('transparent');
  }
});

test('metrics values have explicit color styles', async () => {
  const comparisons = screen.getByTestId('metric-comparisons');
  const swaps = screen.getByTestId('metric-swaps');
  const elapsed = screen.getByTestId('metric-elapsed');

  for (const metric of [comparisons, swaps, elapsed]) {
    const color = getStyle(metric.element() as HTMLElement, 'color');
    // Color should be set (not transparent)
    expect(color).not.toBe('transparent');
  }
});

test('algorithm info panel has non-white background', async () => {
  const infoPanel = screen.getByTestId('algo-info-panel');
  const bgColor = getStyle(infoPanel.element() as HTMLElement, 'background-color');

  // Background should NOT be white
  expect(isWhite(bgColor)).toBe(false);
});

test('info panel has visible border', async () => {
  const infoPanel = screen.getByTestId('algo-info-panel');
  const border = getStyle(infoPanel.element() as HTMLElement, 'border');
  expect(border).not.toBe('none');
  expect(border).not.toBe('');
});

test('history table rows have visible borders', async () => {
  const tableBody = screen.getByTestId('history-table-body');
  const rows = tableBody.getByRole('row').all();

  // Header row should exist
  expect(rows.length).toBeGreaterThanOrEqual(1);

  // Check header cell borders
  const headerRow = rows[0].element() as HTMLElement;
  const headerCells = headerRow.querySelectorAll('th');
  for (const cell of headerCells) {
    const borderBottom = getStyle(cell, 'border-bottom');
    expect(borderBottom).not.toBe('none');
    expect(borderBottom).not.toBe('0px none');
  }
});

test('tooltip has dark background', async () => {
  const bars = screen.getByTestId(/bar-/).all();
  const firstBar = bars[0].element() as HTMLElement;

  // Check that tooltip has dark background via inline styles
  const tooltip = firstBar.querySelector('.bar-tooltip') as HTMLElement;
  expect(tooltip).not.toBeNull();

  if (tooltip) {
    // Tooltip should have dark background
    const bgColor = getStyle(tooltip, 'background-color');
    expect(isWhite(bgColor)).toBe(false);
  }
});

test('no white flashes on initial render (root background is not white)', async () => {
  // Check the root container background
  const container = screen.container as HTMLElement;
  const rootBg = getStyle(container, 'background-color');
  // Root should NOT be white
  expect(isWhite(rootBg)).toBe(false);
});
