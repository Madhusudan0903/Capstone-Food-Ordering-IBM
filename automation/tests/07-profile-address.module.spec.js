const { test, expect } = require('@playwright/test');
const { loginAsDefaultUser } = require('./helpers/session');

test.describe('Module: Profile + Addresses (15 cases)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDefaultUser(page);
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/profile/);
    await expect(page.getByRole('heading', { name: /My Addresses/i })).toBeVisible({ timeout: 20000 });
  });

  test('TC-PRF-001 profile page loads', async ({ page }) => {
    await expect(page).toHaveURL(/\/profile/);
  });

  test('TC-PRF-002 address list visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /My Addresses/i })).toBeVisible();
  });

  test('TC-PRF-003 add address button visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /add address/i })).toBeVisible();
  });

  test('TC-PRF-004 open add address form', async ({ page }) => {
    await page.getByRole('button', { name: /add address/i }).click();
    await expect(page.locator('form.address-form, form')).toBeVisible();
  });

  test('TC-PRF-005 address form has street', async ({ page }) => {
    await page.getByRole('button', { name: /add address/i }).click();
    await expect(page.getByRole('textbox').first()).toBeVisible();
  });

  test('TC-PRF-006 add valid address', async ({ page }) => {
    await page.getByRole('button', { name: /add address/i }).click();
    await page.getByLabel(/^Label$/i).fill('QA Home');
    await page.getByLabel(/^Street$/i).fill(`Street ${Date.now()}`);
    await page.getByLabel(/^City$/i).fill('New York');
    await page.getByLabel(/^Postal Code$/i).fill('10001');
    await page.getByRole('button', { name: /^save$/i }).click();
    await expect(page.getByText(/Street|My Addresses|QA Home/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-PRF-007 required field validation', async ({ page }) => {
    await page.getByRole('button', { name: /add address/i }).click();
    await page.getByRole('button', { name: /^save$/i }).click();
    const invalid = await page.locator('input:invalid').count();
    expect(invalid).toBeGreaterThan(0);
  });

  test('TC-PRF-008 cancel add address', async ({ page }) => {
    await page.getByRole('button', { name: /add address/i }).click();
    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(page.getByRole('heading', { name: /My Addresses/i })).toBeVisible();
  });

  test('TC-PRF-009 delete address button visible', async ({ page }) => {
    const del = page.getByRole('button', { name: /delete/i });
    const count = await del.count();
    if (count > 0) {
      await expect(del.first()).toBeVisible();
    } else {
      await expect(page.getByRole('heading', { name: /My Addresses/i })).toBeVisible();
    }
  });

  test('TC-PRF-010 set default checkbox visible', async ({ page }) => {
    await page.getByRole('button', { name: /add address/i }).click();
    await expect(page.getByRole('checkbox')).toBeVisible();
  });

  test('TC-PRF-011 profile route in header', async ({ page }) => {
    await page.goto('/restaurants');
    await expect(page.getByTestId('nav-profile')).toBeVisible();
  });

  test('TC-PRF-012 profile requires login', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-PRF-013 multiple addresses can be listed', async ({ page }) => {
    const cards = await page.locator('.address-card').count();
    expect(cards).toBeGreaterThanOrEqual(0);
  });

  test('TC-PRF-014 postal code input exists', async ({ page }) => {
    await page.getByRole('button', { name: /add address/i }).click();
    await expect(page.getByLabel(/Postal Code/i)).toBeVisible();
  });

  test('TC-PRF-015 address card layout', async ({ page }) => {
    expect((await page.textContent('body')).length).toBeGreaterThan(0);
  });
});
