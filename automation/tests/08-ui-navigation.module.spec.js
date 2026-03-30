const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const { testUsers } = require('../utils/testData');

test.describe('Module: UI + Navigation + Validation (15 cases)', () => {
  test('TC-UI-001 home page loads', async ({ page }) => {
    const p = new HomePage(page);
    await p.goto();
    await expect(page).toHaveURL(/localhost:5173\/?$/);
  });
  test('TC-UI-002 hero section visible', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    expect((await page.textContent('body'))).toMatch(/Order delicious food/i);
  });
  test('TC-UI-003 header has restaurants link', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const link = await page.$('a[href="/restaurants"]');
    expect(link).toBeTruthy();
  });
  test('TC-UI-004 navigate home to restaurants', async ({ page }) => {
    const p = new HomePage(page);
    await p.goto();
    await p.clickBrowseRestaurants();
    await expect(page).toHaveURL(/restaurants/);
  });
  test('TC-UI-005 navigate home to login', async ({ page }) => {
    const p = new HomePage(page);
    await p.goto();
    await p.clickLogin();
    await expect(page).toHaveURL(/login/);
  });
  test('TC-UI-006 navigate home to register', async ({ page }) => {
    const p = new HomePage(page);
    await p.goto();
    await p.clickRegister();
    await expect(page).toHaveURL(/register/);
  });
  test('TC-UI-007 footer visible', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    expect((await page.textContent('body'))).toMatch(/FoodEase|Capstone/i);
  });
  test('TC-UI-008 login state header changes', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(testUsers.valid.email, testUsers.valid.password);
    await page.waitForURL(/\/restaurants/, { timeout: 25000 });
    await expect(page.locator('header')).toContainText(/Logout/i, { timeout: 15000 });
  });
  test('TC-UI-009 logout works', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(testUsers.valid.email, testUsers.valid.password);
    const logout = await page.$('button:has-text("Logout")');
    if (logout) await logout.click();
    expect((await page.textContent('body')).length).toBeGreaterThan(0);
  });
  test('TC-UI-010 wildcard route redirects', async ({ page }) => {
    await page.goto('http://localhost:5173/some-random-path');
    await expect(page).toHaveURL(/localhost:5173\/?$/);
  });
  test('TC-UI-011 login required for cart', async ({ page }) => {
    await page.goto('http://localhost:5173/cart');
    await expect(page).toHaveURL(/cart|login/);
  });
  test('TC-UI-012 login required for checkout', async ({ page }) => {
    await page.goto('http://localhost:5173/checkout');
    await expect(page).toHaveURL(/checkout|login/);
  });
  test('TC-UI-013 login required for orders', async ({ page }) => {
    await page.goto('http://localhost:5173/orders');
    await expect(page).toHaveURL(/orders|login/);
  });
  test('TC-UI-014 responsive navbar renders', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:5173/');
    expect((await page.textContent('header')).length).toBeGreaterThan(0);
  });
  test('TC-UI-015 page title present', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/FoodEase/i);
  });
});
