import { beforeEach, expect, test } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';
import { MemoryRouter } from 'react-router';

import ProjectCard from './ProjectCard.tsx';

let screen: RenderResult;
const exampleTitle = 'Example Title';
const exampleDescription = 'Example description';

beforeEach(async () => {
  screen = await render(
    <MemoryRouter>
      <ProjectCard link='/example' title={exampleTitle} description={exampleDescription} />
    </MemoryRouter>
  );
});

test('renders card', async () => {
  await expect.element(screen.getByRole('img', { name: exampleTitle })).toBeVisible();
  await expect.element(screen.getByText(exampleTitle)).toBeVisible();
  await expect.element(screen.getByText(exampleDescription)).toBeVisible();
});

test('links to the correct URL', async () => {
  await expect.element(screen.getByRole('link')).toHaveAttribute('href', '/example');
});
