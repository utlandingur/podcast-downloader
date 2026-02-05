import { test, expect } from '@playwright/test';

test('search → podcast page → download success and failure states', async ({
  page,
}) => {
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

  await expect(
    page.getByRole('heading', { name: 'Planet Money' }),
  ).toBeVisible();

  const downloadSuccessButton = page.getByTestId('download-1');
  await downloadSuccessButton.click();
  await expect(downloadSuccessButton).toHaveText(/Downloaded/i);

  const stored = await page.evaluate(() =>
    window.localStorage.getItem('podcast-downloads:123'),
  );
  expect(stored).not.toBeNull();
  const storedIds = stored ? JSON.parse(stored) : [];
  expect(storedIds).toContain('1');

  const downloadFailButton = page.getByTestId('download-2');
  const popupPromise = page.waitForEvent('popup');
  await downloadFailButton.click();
  const popup = await popupPromise;
  await popup.close();
  await expect(downloadFailButton).toHaveText(/Downloaded in new tab/i);

  const storedAfter = await page.evaluate(() =>
    window.localStorage.getItem('podcast-downloads:123'),
  );
  const storedIdsAfter = storedAfter ? JSON.parse(storedAfter) : [];
  expect(storedIdsAfter).not.toContain('2');
});
