import { test, expect } from '@playwright/test';

test.describe('Rick and morty explorer test - Happy Case', () => {
  test('User can search and view details', async ({ page }) => {
    // go to the home page
    await page.goto('/');

    // redirect due to query params state management
    await page.waitForURL('**/?q=*&page=1');

    // get the search input, then type into it
    const searchInput = page.getByPlaceholder('Search characters...');
    await searchInput.fill('Rick');
    await searchInput.press('Enter');

    // wait for results to load
    const firstCharacterHeading = page.locator('a >> h2').first();
    await expect(firstCharacterHeading).toBeVisible();

    // get the first result and click it
    await firstCharacterHeading.click();

    // check that the detail page has the heading
    const detailHeading = page.locator('h1');
    await expect(detailHeading).toBeVisible();

    // fill the character note text area
    const noteInput = page.locator('textarea[name="note"]');
    await noteInput.fill('Test note from E2E');
    const saveButton = page.getByRole('button', { name: /save/i });
    await saveButton.click();

    // verify success message appears
    await expect(page.getByText('Note saved successfully!')).toBeVisible();
  });

  test('User can toggle favorite status and UI updates accordingly', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForURL('**/?q=*&page=1');

    const searchInput = page.getByPlaceholder('Search characters...');
    await searchInput.fill('Rick');
    await searchInput.press('Enter');

    // wait for first character card
    const firstCharacterCard = page.locator('div.border').first();

    // Find the favorite button inside the first character card
    const favoriteButton = firstCharacterCard.locator('button', {
      hasText: /favorite/i,
    });

    // confirm initial state is ☆ Favorite
    await expect(favoriteButton).toHaveText('☆ Favorite');

    // click to favorite the character
    await favoriteButton.click();

    // Confirm UI updates to ★ Favorite
    await expect(favoriteButton).toHaveText('★ Favorite');

    // Click again to unfavorite
    await favoriteButton.click();

    // confirm UI goes back to ☆ Favorite
    await expect(favoriteButton).toHaveText('☆ Favorite');
  });
});
