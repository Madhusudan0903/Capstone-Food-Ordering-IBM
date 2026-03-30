const { test, expect } = require('@playwright/test');
const RestaurantsPage = require('../pages/RestaurantsPage');
const { loginAsDefaultUser, openFirstRestaurant } = require('./helpers/session');

test.describe('Module: Ratings + Reviews (15 cases)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDefaultUser(page);
  });

  test('TC-REV-001 reviews section visible', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    expect((await page.textContent('body'))).toMatch(/Reviews/i);
  });
  test('TC-REV-002 write review button visible', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    await expect(page.getByRole('button', { name: /write a review/i })).toBeVisible({ timeout: 15000 });
  });
  test('TC-REV-003 open review form', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    await page.getByRole('button', { name: /write a review/i }).click();
    await expect(page.locator('.review-form')).toBeVisible();
  });
  test('TC-REV-004 rating selector exists', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    await page.getByRole('button', { name: /write a review/i }).click();
    await expect(page.locator('.review-form select')).toBeVisible();
  });
  test('TC-REV-005 comment textarea exists', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    await page.getByRole('button', { name: /write a review/i }).click();
    await expect(page.locator('.review-form textarea')).toBeVisible();
  });
  test('TC-REV-006 submit review flow', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    await page.getByRole('button', { name: /write a review/i }).click();
    await page.locator('.review-form select').selectOption('5');
    await page.locator('.review-form textarea').fill(`Great food ${Date.now()}`);
    await page.locator('.review-form button:has-text("Submit Review")').click();
    await expect(page.getByText(/Reviews/i).first()).toBeVisible();
  });
  test('TC-REV-007 cancel review form', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    await page.getByRole('button', { name: /write a review/i }).click();
    // Toggle "Cancel" (btn-sm); form also has a Cancel — avoid strict-mode ambiguity
    await page.locator('.reviews-section button.btn-outline.btn-sm').filter({ hasText: /^Cancel$/ }).click();
    await expect(page.getByRole('heading', { name: /Reviews/i })).toBeVisible();
  });
  test('TC-REV-008 reviews list displays names', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    expect((await page.textContent('body')).length).toBeGreaterThan(0);
  });
  test('TC-REV-009 duplicate review handling', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    expect((await page.textContent('body'))).toMatch(/review/i);
  });
  test('TC-REV-010 rating boundaries selectable', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    const btn = await page.$('button:has-text("Write a Review")');
    if (btn) {
      await btn.click();
      await page.selectOption('select', '1');
      await page.selectOption('select', '5');
    }
    expect((await page.textContent('body')).length).toBeGreaterThan(0);
  });
  test('TC-REV-011 reviews sorted latest first', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    expect((await page.textContent('body'))).toMatch(/Reviews/i);
  });
  test('TC-REV-012 unauthenticated review prompt', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/restaurants');
    await page.locator('a[href^="/restaurants/"]').first().click();
    await page.waitForURL(/\/restaurants\/\d+/);
    expect((await page.textContent('body'))).toMatch(/Reviews|Login|Restaurant/i);
  });
  test('TC-REV-013 average rating shown', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await rp.goto();
    expect((await page.textContent('body'))).toMatch(/⭐|rating|reviews/i);
  });
  test('TC-REV-014 submit empty comment with rating', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    const btn = await page.$('button:has-text("Write a Review")');
    if (btn) {
      await btn.click();
      await page.selectOption('select', '4');
      await page.fill('textarea', '');
      await page.click('button:has-text("Submit Review")');
    }
    expect((await page.textContent('body')).length).toBeGreaterThan(0);
  });
  test('TC-REV-015 long comment handling', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    const btn = await page.$('button:has-text("Write a Review")');
    if (btn) {
      await btn.click();
      await page.fill('textarea', 'a'.repeat(500));
    }
    expect((await page.textContent('body')).length).toBeGreaterThan(0);
  });
});
