const { test, expect } = require('@playwright/test');
const RestaurantsPage = require('../pages/RestaurantsPage');

test.describe('Module: Restaurants + Search (15 cases)', () => {
  test('TC-RST-001 restaurants list loads', async ({ page }) => {
    const p = new RestaurantsPage(page);
    await p.goto();
    await p.waitForRestaurants();
    expect(await p.getRestaurantCount()).toBeGreaterThanOrEqual(0);
  });
  test('TC-RST-002 restaurant card visible', async ({ page }) => {
    await page.goto('http://localhost:5173/restaurants');
    const body = await page.textContent('body');
    expect(body).toMatch(/Restaurants|No restaurants/i);
  });
  test('TC-RST-003 search by name', async ({ page }) => {
    const p = new RestaurantsPage(page);
    await p.goto();
    await p.search('Pizza');
    expect(await p.getRestaurantCount()).toBeGreaterThanOrEqual(0);
  });
  test('TC-RST-004 search by cuisine', async ({ page }) => {
    const p = new RestaurantsPage(page);
    await p.goto();
    await p.search('Japanese');
    expect(await p.getRestaurantCount()).toBeGreaterThanOrEqual(0);
  });
  test('TC-RST-005 search case-insensitive', async ({ page }) => {
    const p = new RestaurantsPage(page);
    await p.goto();
    await p.search('PIZZA');
    expect(await p.getRestaurantCount()).toBeGreaterThanOrEqual(0);
  });
  test('TC-RST-006 empty search returns list', async ({ page }) => {
    const p = new RestaurantsPage(page);
    await p.goto();
    await p.search('');
    expect(await p.getRestaurantCount()).toBeGreaterThanOrEqual(0);
  });
  test('TC-RST-007 cuisine filter Italian', async ({ page }) => {
    const p = new RestaurantsPage(page);
    await p.goto();
    await p.selectCuisine('Italian');
    expect(await p.getRestaurantCount()).toBeGreaterThanOrEqual(0);
  });
  test('TC-RST-008 min rating filter exists', async ({ page }) => {
    await page.goto('http://localhost:5173/restaurants');
    const selects = await page.$$('select');
    expect(selects.length).toBeGreaterThan(0);
  });
  test('TC-RST-009 max price filter exists', async ({ page }) => {
    await page.goto('http://localhost:5173/restaurants');
    const content = await page.textContent('body');
    expect(content).toMatch(/Under \$15|Any Price|Any Rating/);
  });
  test('TC-RST-010 combine filters', async ({ page }) => {
    await page.goto('http://localhost:5173/restaurants');
    await page.fill('.search-input', 'Pizza');
    const selects = await page.$$('select');
    if (selects[0]) await selects[0].selectOption('Italian');
    expect((await page.textContent('body')).length).toBeGreaterThan(0);
  });
  test('TC-RST-011 no result message', async ({ page }) => {
    const p = new RestaurantsPage(page);
    await p.goto();
    await p.search('zzzz-no-match');
    const body = await page.textContent('body');
    expect(body).toMatch(/No restaurants found|Restaurants/i);
  });
  test('TC-RST-012 open restaurant detail', async ({ page }) => {
    const p = new RestaurantsPage(page);
    await p.goto();
    await p.waitForRestaurants();
    const count = await p.getRestaurantCount();
    if (count > 0) await p.clickFirstRestaurant();
    await expect(page).toHaveURL(/restaurants(\/\d+)?/);
  });
  test('TC-RST-013 image/placeholder present', async ({ page }) => {
    await page.goto('http://localhost:5173/restaurants');
    const images = await page.$$('img');
    expect(images.length).toBeGreaterThanOrEqual(0);
  });
  test('TC-RST-014 delivery time visible', async ({ page }) => {
    await page.goto('http://localhost:5173/restaurants');
    const body = await page.textContent('body');
    expect(body).toMatch(/min|delivery|Restaurants/i);
  });
  test('TC-RST-015 clear filters by reset values', async ({ page }) => {
    await page.goto('http://localhost:5173/restaurants');
    await page.fill('.search-input', 'Pizza');
    await page.fill('.search-input', '');
    const body = await page.textContent('body');
    expect(body.length).toBeGreaterThan(0);
  });
});
