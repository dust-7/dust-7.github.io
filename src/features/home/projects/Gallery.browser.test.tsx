import { beforeEach, expect, test } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';
import { MemoryRouter } from 'react-router';

import Gallery from './Gallery.tsx';

let screen: RenderResult;

beforeEach(async () => {
  screen = await render(
    <MemoryRouter>
      <Gallery />
    </MemoryRouter>
  );
});

test('renders cards', async () => {
  await expect.element(screen.getByText(/Checkpoint Traffic/i)).toBeVisible();
});

test('links to correct URL', async () => {
  await expect.element(screen.getByRole('link', { name: /checkpoint traffic/i })).toHaveAttribute('href', '/projects/checkpoint');
});
