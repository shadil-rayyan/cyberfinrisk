import { test, expect } from '@playwright/test';

test.describe('Button page', () => {
  test('button renders and can be clicked', async ({ page }) => {
    await page.goto('http://localhost:3000'); // your dev server

    // Check button exists
    const button = page.locator('data-testid=my-button');
    await expect(button).toHaveText('Click Me');

    // Click button (simulate real user)
    await button.click();
    // Optionally check some side-effect if your button does anything
  });
});
