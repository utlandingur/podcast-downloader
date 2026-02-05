import { test, expect } from '@playwright/test';

test('bulk download shows spinner while processing', async ({ page }) => {
  await page.route('**/audio-*.mp3', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    await route.fulfill({
      status: 200,
      contentType: 'audio/mpeg',
      body: 'mock-audio',
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

  const bulkStatus = page.getByText(/Bulk downloading/i);
  await expect(bulkStatus).toBeVisible();
  await expect(bulkStatus).toBeHidden({ timeout: 15_000 });

  await expect(page.getByTestId('download-1')).toHaveText(/Downloaded/i);
  await expect(page.getByTestId('download-2')).toHaveText(/Downloaded/i);
});
