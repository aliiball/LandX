import { expect, test } from '@playwright/test';

test.describe('PersonaSwitcher (R-01)', () => {
  test('Ctrl+Shift+P opens menu', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+Shift+P');
    await expect(page.getByRole('menu')).toBeVisible();
  });

  test('selecting Broker navigates to /broker and persists', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-persona-switcher] button').first().click();
    await page.getByRole('menuitemradio', { name: /Emlakçı/ }).click();
    await expect(page).toHaveURL(/\/broker/);

    const stored = await page.evaluate(() => sessionStorage.getItem('landx_demo_persona'));
    expect(stored).toBe('broker-admin');

    await page.reload();
    await expect(page).toHaveURL(/\/broker/);
  });

  test('?persona= query param hydrates active persona', async ({ page }) => {
    await page.goto('/admin?persona=admin');
    await expect(page.locator('[data-persona-switcher] button').first()).toContainText(/Yönetici/);
  });
});
