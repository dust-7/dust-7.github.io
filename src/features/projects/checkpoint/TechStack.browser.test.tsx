import { expect, test } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';

import TechStack from './TechStack';

let screen: RenderResult;

test('renders tech stack', async () => {
  screen = await render(<TechStack />);
  await screen.getByRole('button', { name: /show tech stack/i }).click();

  await expect.element(screen.getByRole('heading', { name: 'Frontend' })).toBeVisible();
  await expect.element(screen.getByRole('heading', { name: 'Backend' })).toBeVisible();
});
