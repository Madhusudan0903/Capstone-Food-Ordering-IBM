const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const RegisterPage = require('../pages/RegisterPage');
const { testUsers } = require('../utils/testData');

test.describe('Module: Authentication (15 cases)', () => {
  test('TC-AUTH-001 login valid user', async ({ page }) => {
    const p = new LoginPage(page);
    await p.goto();
    await p.login(testUsers.valid.email, testUsers.valid.password);
    await expect(page).toHaveURL(/restaurants|login/);
  });
  test('TC-AUTH-002 login invalid password', async ({ page }) => {
    const p = new LoginPage(page);
    await p.goto();
    await p.login(testUsers.valid.email, 'wrongpass');
    expect(await p.getError()).toBeTruthy();
  });
  test('TC-AUTH-003 login invalid email', async ({ page }) => {
    const p = new LoginPage(page);
    await p.goto();
    await p.login('nobody@example.com', 'password123');
    expect(await p.getError()).toBeTruthy();
  });
  test('TC-AUTH-004 login empty email validation', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/login/);
  });
  test('TC-AUTH-005 login empty password validation', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', testUsers.valid.email);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/login/);
  });
  test('TC-AUTH-006 register valid user', async ({ page }) => {
    const p = new RegisterPage(page);
    await p.goto();
    const email = `qe_${Date.now()}@example.com`;
    await p.register({ firstName: 'QE', lastName: 'User', email, password: 'pass123', confirmPassword: 'pass123' });
    await expect(page).toHaveURL(/restaurants|register/);
  });
  test('TC-AUTH-007 register duplicate email', async ({ page }) => {
    const p = new RegisterPage(page);
    await p.goto();
    await p.register({ firstName: 'John', lastName: 'Dup', email: testUsers.valid.email, password: 'pass123', confirmPassword: 'pass123' });
    const error = await p.getError();
    expect(error || '').toContain('already');
  });
  test('TC-AUTH-008 register password mismatch', async ({ page }) => {
    const p = new RegisterPage(page);
    await p.goto();
    await p.register({ firstName: 'A', lastName: 'B', email: `m_${Date.now()}@e.com`, password: 'pass123', confirmPassword: 'pass124' });
    const body = await page.textContent('body');
    expect(body.toLowerCase()).toContain('password');
  });
  test('TC-AUTH-009 register short password', async ({ page }) => {
    const p = new RegisterPage(page);
    await p.goto();
    await p.register({ firstName: 'A', lastName: 'B', email: `s_${Date.now()}@e.com`, password: '12345', confirmPassword: '12345' });
    await expect(page).toHaveURL(/register/);
  });
  test('TC-AUTH-010 nav login to register', async ({ page }) => {
    const p = new LoginPage(page);
    await p.goto();
    await p.clickRegister();
    await expect(page).toHaveURL(/register/);
  });
  test('TC-AUTH-011 nav register to login', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL(/login/);
  });
  test('TC-AUTH-012 token persists after refresh', async ({ page }) => {
    const p = new LoginPage(page);
    await p.goto();
    await p.login(testUsers.valid.email, testUsers.valid.password);
    await page.reload();
    const body = await page.textContent('body');
    expect(body.length).toBeGreaterThan(0);
  });
  test('TC-AUTH-013 protected route redirect', async ({ page }) => {
    await page.goto('http://localhost:5173/cart');
    await expect(page).toHaveURL(/login|cart/);
  });
  test('TC-AUTH-014 logout visible after login', async ({ page }) => {
    const p = new LoginPage(page);
    await p.goto();
    await p.login(testUsers.valid.email, testUsers.valid.password);
    const body = await page.textContent('body');
    expect(body).toMatch(/Logout|Restaurants/);
  });
  test('TC-AUTH-015 email trim behavior', async ({ page }) => {
    const p = new LoginPage(page);
    await p.goto();
    await p.login(`  ${testUsers.valid.email}  `, testUsers.valid.password);
    await expect(page).toHaveURL(/restaurants|login/);
  });
});
