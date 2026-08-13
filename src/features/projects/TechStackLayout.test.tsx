import { beforeEach, expect, test } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';

import TechStackLayout from './TechStackLayout.tsx';

let screen: RenderResult;

beforeEach(async () => {
  screen = await render(<TechStackLayout>foo</TechStackLayout>);
});

test('renders "show" button', async () => {
  await expect.element(screen.getByRole('button', { name: /show tech stack/i })).toBeVisible();
});

test('opens modal when "show" button is clicked', async () => {
  await screen.getByRole('button', { name: /show tech stack/i }).click();
  await expect.element(screen.getByRole('heading', { name: /tech stack/i })).toBeVisible();
  await expect.element(screen.getByText('foo')).toBeVisible();
});
