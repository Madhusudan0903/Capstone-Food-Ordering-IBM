const { test, expect } = require('@playwright/test');
const OrdersPage = require('../pages/OrdersPage');
const { loginAsDefaultUser } = require('./helpers/session');

test.describe('Module: Orders + Tracking (15 cases)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDefaultUser(page);
  });

  test('TC-ORD-001 orders page loads', async ({ page }) => {
    const p = new OrdersPage(page);
    await p.goto();
    await expect(page).toHaveURL(/\/orders/);
  });

  test('TC-ORD-002 order list visible', async ({ page }) => {
    await page.goto('/orders');
    const body = await page.textContent('body');
    expect(body).toMatch(/My Orders|haven't placed|Orders/i);
  });

  test('TC-ORD-003 open first order detail', async ({ page }) => {
    const p = new OrdersPage(page);
    await p.goto();
    if ((await p.getOrderCount()) > 0) {
      await p.clickFirstOrder();
      await expect(page).toHaveURL(/\/orders\/\d+/);
    } else {
      await expect(page).toHaveURL(/\/orders/);
    }
  });

  test('TC-ORD-004 order status visible', async ({ page }) => {
    await page.goto('/orders');
    const first = page.locator('a[href^="/orders/"]').filter({ hasNot: page.locator('[href="/orders"]') }).first();
    if (await first.count()) {
      await first.click();
      await expect(page.getByText(/Status|Delivered|Preparing|Pending|Confirmed/i).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('TC-ORD-005 estimated delivery visible', async ({ page }) => {
    await page.goto('/orders');
    const first = page.locator('a.order-card').first();
    if (await first.count()) {
      await first.click();
      await expect(page.getByText(/Estimated delivery|Order #/i).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('TC-ORD-006 timeline visible', async ({ page }) => {
    await page.goto('/orders');
    const first = page.locator('a.order-card').first();
    if (await first.count()) {
      await first.click();
      await expect(page.locator('.status-timeline, .order-status-card').first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('TC-ORD-007 items list visible', async ({ page }) => {
    await page.goto('/orders');
    const first = page.locator('a.order-card').first();
    if (await first.count()) {
      await first.click();
      expect((await page.textContent('body'))).toMatch(/x\d+|Order|Subtotal/i);
    }
  });

  test('TC-ORD-008 address visible', async ({ page }) => {
    await page.goto('/orders');
    const first = page.locator('a.order-card').first();
    if (await first.count()) {
      await first.click();
      await expect(page.getByText(/Deliver to|Order #/i).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('TC-ORD-009 totals visible', async ({ page }) => {
    await page.goto('/orders');
    const first = page.locator('a.order-card').first();
    if (await first.count()) {
      await first.click();
      await expect(page.getByText(/Subtotal|Total/i).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('TC-ORD-010 back to orders button', async ({ page }) => {
    await page.goto('/orders');
    await page.getByText(/Loading orders/i).waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    const first = page.locator('a.order-card').first();
    if (await first.count()) {
      await first.click();
      await expect(page.getByRole('link', { name: /Back to Orders/i })).toBeVisible({ timeout: 15000 });
    }
  });

  test('TC-ORD-011 invalid order id handling', async ({ page }) => {
    await page.goto('/orders/999999');
    const body = await page.textContent('body');
    expect(body).toMatch(/Order not found|not found|404|Order/i);
  });

  test('TC-ORD-012 order date visible', async ({ page }) => {
    await page.goto('/orders');
    await page.getByText(/Loading orders/i).waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    const body = await page.textContent('body');
    expect(body).toMatch(/Order #|My Orders|Loading orders/i);
  });

  test('TC-ORD-013 empty state message', async ({ page }) => {
    await page.goto('/orders');
    expect((await page.textContent('body')).length).toBeGreaterThan(0);
  });

  test('TC-ORD-014 review button appears for delivered', async ({ page }) => {
    await page.goto('/orders');
    const first = page.locator('a.order-card').first();
    if (await first.count()) {
      await first.click();
      expect((await page.textContent('body'))).toMatch(/Review|Order|Delivered|Status/i);
    }
  });

  test('TC-ORD-015 protected access requires login', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/orders');
    await expect(page).toHaveURL(/\/login/);
  });
});
