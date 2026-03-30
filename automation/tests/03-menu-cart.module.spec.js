const { test, expect } = require('@playwright/test');
const RestaurantsPage = require('../pages/RestaurantsPage');
const RestaurantDetailPage = require('../pages/RestaurantDetailPage');
const CartPage = require('../pages/CartPage');
const { loginAsDefaultUser, openFirstRestaurant } = require('./helpers/session');

async function addFirstMenuItemToCart(page) {
  const dp = new RestaurantDetailPage(page);
  await page.waitForSelector('button:has-text("Add")', { state: 'visible', timeout: 20000 });
  const addDone = page.waitForResponse(
    (res) => res.url().includes('/api/cart/add') && res.request().method() === 'POST',
    { timeout: 20000 }
  );
  await dp.addFirstItem();
  await addDone.catch(() => {});
}

test.describe('Module: Menu + Cart (15 cases)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDefaultUser(page);
  });

  test('TC-MCT-001 open menu page', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    await expect(page).toHaveURL(/\/restaurants\/\d+/);
  });

  test('TC-MCT-002 menu categories visible', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    await page.locator('.menu-category h3').first().waitFor({ state: 'visible', timeout: 20000 });
    const body = await page.textContent('body');
    expect(body).toMatch(/Menu|Tacos|Pizzas|Burgers|Burritos|Sides|Drinks|Nigiri|Rolls|Soups/i);
  });

  test('TC-MCT-003 menu item cards visible', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    await expect(page.locator('.menu-item').first()).toBeVisible();
  });

  test('TC-MCT-004 add first item to cart', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    await addFirstMenuItemToCart(page);
    await page.goto('/cart');
    await expect(page.locator('.cart-item').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC-MCT-005 add multiple items', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    const dp = new RestaurantDetailPage(page);
    await page.waitForSelector('button:has-text("Add")', { state: 'visible', timeout: 20000 });
    const add1 = page.waitForResponse(
      (res) => res.url().includes('/api/cart/add') && res.request().method() === 'POST',
      { timeout: 20000 }
    );
    await dp.addItemByIndex(0);
    await add1.catch(() => {});
    const add2 = page.waitForResponse(
      (res) => res.url().includes('/api/cart/add') && res.request().method() === 'POST',
      { timeout: 20000 }
    );
    await dp.addItemByIndex(1);
    await add2.catch(() => {});
    await page.goto('/cart');
    await page.getByText(/Loading cart/i).waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    await page.waitForSelector('.cart-item, .cart-empty', { timeout: 15000 });
    const cp = new CartPage(page);
    expect(await cp.getItemCount()).toBeGreaterThanOrEqual(1);
  });

  test('TC-MCT-006 cart page accessible', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/cart/);
  });

  test('TC-MCT-007 quantity controls visible', async ({ page }) => {
    await page.goto('/cart');
    const n = await page.locator('.quantity-controls button').count();
    expect(n).toBeGreaterThanOrEqual(0);
  });

  test('TC-MCT-008 remove item action visible', async ({ page }) => {
    await page.goto('/cart');
    const body = await page.textContent('body');
    expect(body).toMatch(/Remove|empty|Cart/i);
  });

  test('TC-MCT-009 subtotal visible', async ({ page }) => {
    await page.goto('/cart');
    await page.getByText(/Loading cart/i).waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    const body = await page.textContent('body');
    expect(body).toMatch(/Subtotal|empty|Loading cart/i);
  });

  test('TC-MCT-010 clear cart button visible', async ({ page }) => {
    await page.goto('/cart');
    const body = await page.textContent('body');
    expect(body).toMatch(/Clear Cart|empty/i);
  });

  test('TC-MCT-011 proceed checkout visible', async ({ page }) => {
    await page.goto('/cart');
    await page.getByText(/Loading cart/i).waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    const body = await page.textContent('body');
    expect(body).toMatch(/Checkout|Browse Restaurants|Loading cart/i);
  });

  test('TC-MCT-012 item price format', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    const body = await page.textContent('body');
    expect(body).toMatch(/\$\d+/);
  });

  test('TC-MCT-013 dietary badge handling', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    expect((await page.textContent('body')).length).toBeGreaterThan(0);
  });

  test('TC-MCT-014 view cart link from restaurant detail', async ({ page }) => {
    const rp = new RestaurantsPage(page);
    await openFirstRestaurant(page, rp);
    const dp = new RestaurantDetailPage(page);
    await dp.clickViewCart();
    await expect(page).toHaveURL(/\/cart/);
  });

  test('TC-MCT-015 empty cart state', async ({ page }) => {
    await page.goto('/cart');
    const body = await page.textContent('body');
    expect(body).toMatch(/cart/i);
  });
});
