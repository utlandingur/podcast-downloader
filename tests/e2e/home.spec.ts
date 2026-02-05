import { test, expect } from '@playwright/test';

const mockResults = [
  {
    id: 'pod-123',
    title: 'Planet Money',
    image: 'https://example.com/planet-money.jpg',
  },
  {
    id: 'pod-456',
    title: 'Syntax',
    image: 'https://example.com/syntax.jpg',
  },
];

test('home page renders hero and search input', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      name: /download podcast mp3s/i,
    }),
  ).toBeVisible();
  await expect(page.getByPlaceholder('Podcast title')).toBeVisible();
});

test('search shows mocked results', async ({ page }) => {
  await page.goto('/');
  const input = page.getByPlaceholder('Podcast title');
  await input.fill('planet');
  await page.getByRole('button', { name: 'Search' }).click();

  await expect(page.getByText('Planet Money')).toBeVisible();
});

test('open-audio without url shows invalid message', async ({ page }) => {
  await page.goto('/open-audio');
  await expect(page.getByText('Invalid audio link')).toBeVisible();
});
