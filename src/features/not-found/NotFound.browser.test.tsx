import { beforeEach, expect, test } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';
import { MemoryRouter } from 'react-router';

import NotFound from './NotFound.tsx';

let screen: RenderResult;

beforeEach(async () => {
  screen = await render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );
});

test('renders page', async () => {
  await expect.element(screen.getByRole('heading', { name: /404 not found/i })).toBeVisible();
});
