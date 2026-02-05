import { test, expect } from '@playwright/test';

test('bulk download shows manual download alert on failures', async ({ page }) => {
  await page.route('**/audio-success.mp3', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'audio/mpeg',
      body: 'mock-audio',
    });
  });

  await page.route('**/audio-fail.mp3', async (route) => {
    await route.fulfill({
      status: 404,
      contentType: 'text/plain',
      body: 'not found',
    });
  });

  await page.goto('/');

  const searchInput = page.getByPlaceholder('Podcast title');
  await searchInput.fill('planet');
  await page.getByRole('button', { name: 'Search' }).click();

  await page.getByText('Planet Money').click();
  await page.waitForURL('**/podcasts/v2/123');

  const bulkButton = page.getByRole('button', { name: 'Bulk download' });
  await bulkButton.click();
  await page.getByRole('button', { name: 'Start download' }).click();

  const alertTitle = page.getByText('Manual downloads needed');
  await expect(alertTitle).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('button', { name: 'Open list' })).toBeVisible();
});
