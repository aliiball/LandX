import { expect, test } from '@playwright/test';

test.describe('Phase 0 smoke', () => {
  test('landing renders with persona switcher', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=arsam')).toBeVisible();
    await expect(page.locator('[data-persona-switcher] button').first()).toBeVisible();
  });

  test('all 6 surfaces reachable via direct navigation', async ({ page }) => {
    const surfaces = [
      { path: '/', heading: /Public · Public Landing/i },
      { path: '/login', heading: /Auth · Login/i },
      { path: '/dashboard', heading: /User Dashboard/i },
      { path: '/broker', heading: /Broker Ops/i },
      { path: '/admin', heading: /Admin Operations/i },
      { path: '/agent', heading: /Agent \/ MCP/i },
      { path: '/b/test-broker', heading: /Public Broker Showcase/i },
    ];
    for (const surface of surfaces) {
      await page.goto(surface.path);
      await expect(page.locator('main')).toContainText(surface.heading);
    }
  });

  test('no console errors on landing', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors.filter((e) => !e.includes('[MSW]'))).toEqual([]);
  });
});
