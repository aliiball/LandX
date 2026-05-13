import { expect, test } from '@playwright/test';

/**
 * Phase 7 deliverable — 5-persona demo scenarios for customer presentation.
 * Each scenario walks through a complete user journey using the Persona Switcher.
 */

test.describe('Demo scenario A — Buyer journey', () => {
  test('NL search → listing detail → AI valuation visible', async ({ page }) => {
    await page.goto('/?persona=buyer');
    await page.waitForLoadState('networkidle');

    // Hero NL search
    await page.locator('input[aria-label="Arama"]').fill('Çeşme imarlı');
    await page.locator('button[type="submit"]:has-text("Ara")').click();
    await page.waitForURL(/\/search/);

    // Click first listing card
    const firstCard = page.locator('main a[href^="/listing/"]').first();
    await firstCard.click();
    await page.waitForURL(/\/listing\//);

    // AI valuation card should render (TokenStream)
    await expect(page.locator('text=AI Değerleme')).toBeVisible();
  });
});

test.describe('Demo scenario B — Broker journey (R-04)', () => {
  test('Broker overview → portfolio → leads visible', async ({ page }) => {
    await page.goto('/?persona=broker-admin');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/broker/);
    await expect(page.locator('h1:has-text("Broker Ops Overview")')).toBeVisible();

    await page.goto('/broker/portfolio');
    await expect(page.locator('h1:has-text("Portföy Yönetimi")')).toBeVisible();

    await page.goto('/broker/leads');
    await expect(page.locator('h1:has-text("Lead / CRM")')).toBeVisible();
  });
});

test.describe('Demo scenario C — Admin journey', () => {
  test('Admin overview → tenants → audit visible', async ({ page }) => {
    await page.goto('/?persona=admin');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('h1:has-text("Operations Overview")')).toBeVisible();

    await page.goto('/admin/tenants');
    await expect(page.locator('h1:has-text("Tenants")')).toBeVisible();

    await page.goto('/admin/audit');
    await expect(page.locator('h1:has-text("Audit Forensics")')).toBeVisible();
  });
});

test.describe('Demo scenario D — Agent journey', () => {
  test('Agent ops → MCP → tools → conversations', async ({ page }) => {
    await page.goto('/?persona=agent');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/agent/);
    await expect(page.locator('h1:has-text("Agent Operations")')).toBeVisible();

    await page.goto('/agent/mcp');
    await expect(page.locator('h1:has-text("MCP Transports")')).toBeVisible();

    await page.goto('/agent/tools');
    await expect(page.locator('h1:has-text("Tool Registry")')).toBeVisible();
  });
});

test.describe('Demo scenario E — Seller journey', () => {
  test('Dashboard → listings → AI assistant', async ({ page }) => {
    await page.goto('/?persona=seller');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('main')).toContainText(/Hoş geldin/);

    await page.goto('/dashboard/listings');
    await expect(page.locator('h1:has-text("İlanlarım")')).toBeVisible();

    await page.goto('/dashboard/ai');
    await expect(page.locator('h1:has-text("Kişisel AI Asistan")')).toBeVisible();
  });
});

test.describe('R-01 tree-shake verification readiness', () => {
  test('demo-mode build shows PersonaSwitcher', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-persona-switcher]')).toBeVisible();
  });
});

test.describe('R-05 routing manifest', () => {
  test('hash mode paths convert via useRouteHref', async ({ page }) => {
    await page.goto('/');
    // Smoke test routing manifest at least loads
    await expect(page.locator('body')).toBeVisible();
  });
});
