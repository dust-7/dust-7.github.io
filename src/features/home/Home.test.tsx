import { beforeEach, expect, test } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';
import { MemoryRouter } from 'react-router';

import Home from './Home.tsx';

let screen: RenderResult;

beforeEach(async () => {
  screen = await render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
});

test('renders page', async () => {
  await expect.element(screen.getByRole('heading', { name: /hello!/i })).toBeVisible();
});
