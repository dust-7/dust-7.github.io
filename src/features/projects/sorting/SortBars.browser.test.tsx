import { expect, test } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';

import SortBars from './SortBars.tsx';

let screen: RenderResult;

function generateArray(length: number, maxVal: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * (maxVal + 1)));
}

/** Helper to get computed style values from an element. */
function getStyle(el: HTMLElement, prop: string): string {
  return window.getComputedStyle(el).getPropertyValue(prop).trim();
}

/** Parse an rgb string to { r, g, b }. */
function parseRgb(color: string): { r: number; g: number; b: number } | null {
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return null;
  return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
}

test('renders 20 bars with heights reflecting values', async () => {
  const array = generateArray(20, 100);
  screen = await render(<SortBars array={array} sortedIndices={[]} activeIndices={[]} />);

  const bars = screen.getByTestId(/bar-/).all();
  expect(bars).toHaveLength(20);

  for (let i = 0; i < 20; i++) {
    const bar = bars[i].element() as HTMLElement;
    const value = array[i];
    const expectedHeight = Math.max(4, value * 3); // MIN_BAR_HEIGHT=4, HEIGHT_SCALE=3
    const currentHeight = parseFloat(getStyle(bar, 'height'));
    expect(currentHeight).toBeCloseTo(expectedHeight, 0);
  }
});

test('displays correct color per state (unsorted=blue, active=orange, sorted=green)', async () => {
  const array = [50, 50, 50];
  screen = await render(
    <SortBars
      array={array}
      sortedIndices={[2]}
      activeIndices={[1]}
    />,
  );

  // Bar 0: unsorted → blue (blue channel is dominant)
  const unsortedBar = screen.getByTestId('bar-0').element() as HTMLElement;
  const unsortedColor = parseRgb(getStyle(unsortedBar, 'background-color'));
  expect(unsortedColor).not.toBeNull();
  expect(unsortedColor!.b).toBeGreaterThan(unsortedColor!.g!); // B > G for blue
  expect(unsortedColor!.b).toBeGreaterThan(unsortedColor!.r!); // B > R for blue

  // Bar 1: active → orange (red channel is dominant)
  const activeBar = screen.getByTestId('bar-1').element() as HTMLElement;
  const activeColor = parseRgb(getStyle(activeBar, 'background-color'));
  expect(activeColor).not.toBeNull();
  expect(activeColor!.r).toBe(255); // R is max for orange
  expect(activeColor!.g).toBeGreaterThan(100); // G is moderate

  // Bar 2: sorted → green (green channel is dominant)
  const sortedBar = screen.getByTestId('bar-2').element() as HTMLElement;
  const sortedColor = parseRgb(getStyle(sortedBar, 'background-color'));
  expect(sortedColor).not.toBeNull();
  expect(sortedColor!.g).toBeGreaterThan(sortedColor!.r!); // G > R for green
  expect(sortedColor!.g).toBeGreaterThan(sortedColor!.b!); // G > B for green
});

test('lightness increases with value magnitude', async () => {
  const array = [0, 50, 100];
  screen = await render(
    <SortBars
      array={array}
      sortedIndices={[]}
      activeIndices={[]}
    />,
  );

  const bar0 = screen.getByTestId('bar-0').element() as HTMLElement;
  const bar50 = screen.getByTestId('bar-1').element() as HTMLElement;
  const bar100 = screen.getByTestId('bar-2').element() as HTMLElement;

  const color0 = parseRgb(getStyle(bar0, 'background-color'));
  const color50 = parseRgb(getStyle(bar50, 'background-color'));
  const color100 = parseRgb(getStyle(bar100, 'background-color'));

  expect(color0).not.toBeNull();
  expect(color50).not.toBeNull();
  expect(color100).not.toBeNull();

  // For blue bars (unsorted), lightness increases with value
  // At value 0: rgb(33, 150, 243) - darker
  // At value 50: rgb(33, 190, 249) - lighter
  // At value 100: rgb(33, 230, 255) - lightest
  // Green channel increases as value increases
  expect(color50!.g).toBeGreaterThan(color0!.g);
  expect(color100!.g).toBeGreaterThan(color50!.g);
});

test('hover shows the size value and a glow', async () => {
  const array = [42];
  screen = await render(<SortBars array={array} sortedIndices={[]} activeIndices={[]} />);

  const bar = screen.getByTestId('bar-0').element() as HTMLElement;

  // Trigger hover via dispatchEvent
  bar.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

  // Tooltip should be visible
  const tooltip = bar.querySelector('.bar-tooltip') as HTMLElement;
  expect(tooltip).not.toBeNull();
  expect(tooltip!.textContent).toBe('42');

  // Glow should be present (box-shadow or outline)
  const boxShadow = getStyle(bar, 'box-shadow');
  const outline = getStyle(bar, 'outline');
  expect(boxShadow + outline).not.toBe('none');
});

test('focus shows the size value and a glow', async () => {
  const array = [77];
  screen = await render(<SortBars array={array} sortedIndices={[]} activeIndices={[]} />);

  const bar = screen.getByTestId('bar-0').element() as HTMLElement;

  // Focus
  bar.focus();

  // Tooltip should be visible
  const tooltip = bar.querySelector('.bar-tooltip') as HTMLElement;
  expect(tooltip).not.toBeNull();
  expect(tooltip!.textContent).toBe('77');

  // Glow should be present (outline)
  const outline = getStyle(bar, 'outline');
  expect(outline).not.toBe('none');
});
