import { beforeEach, expect, test } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';

import EnlargeableImage from './EnlargeableImage.tsx';

let screen: RenderResult;
const exampleImage = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="100%" height="100%" fill="%23555"/></svg>';
const exampleCaption = 'example caption';

beforeEach(async () => {
  screen = await render(<EnlargeableImage image={exampleImage} caption={exampleCaption} />);
});

test('renders image', async () => {
  await expect.element(screen.getByRole('img', { name: exampleCaption })).toBeVisible();
});

test('renders caption', async () => {
  await expect.element(screen.getByText(exampleCaption)).toBeVisible();
});

test('opens modal when image is clicked', async () => {
  await screen.getByRole('img', { name: exampleCaption }).click();
  await expect.element(screen.getByRole('heading', { name: exampleCaption })).toBeVisible();
});

test('renders close button in modal', async () => {
  await screen.getByRole('img', { name: exampleCaption }).click();
  await expect.element(screen.getByRole('button', { name: /close/i })).toBeVisible();
});

test('closes modal when close button is clicked', async () => {
  await screen.getByRole('img', { name: exampleCaption }).click();
  await screen.getByRole('button', { name: /close/i }).click();

  await expect.element(screen.getByRole('heading', { name: exampleCaption })).not.toBeInTheDocument();
});
