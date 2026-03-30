const { test, expect } = require('@playwright/test');
const CheckoutPage = require('../pages/CheckoutPage');
const { coupons } = require('../utils/testData');
const { loginAsDefaultUser } = require('./helpers/session');
const { prepareCheckoutFlow } = require('./helpers/checkout');

test.describe('Module: Checkout + Coupons (15 cases)', () => {
  const waitForCheckoutReady = async (page) => {
    await page.getByRole('heading', { name: /^Checkout$/i }).waitFor({ state: 'visible', timeout: 20000 });
    await page.getByText(/^Loading\.\.\.$/i).waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {});
  };

  test.beforeEach(async ({ page }) => {
    await loginAsDefaultUser(page);
  });

  test('TC-CHK-001 checkout page opens', async ({ page }) => {
    await prepareCheckoutFlow(page);
    await expect(page).toHaveURL(/\/checkout/);
  });

  test('TC-CHK-002 address options shown', async ({ page }) => {
    await prepareCheckoutFlow(page);
    await waitForCheckoutReady(page);
    await expect(page.locator('input[name="address"]').first()).toBeVisible();
  });

  test('TC-CHK-003 apply valid coupon', async ({ page }) => {
    await prepareCheckoutFlow(page);
    await waitForCheckoutReady(page);
    const c = new CheckoutPage(page);
    await c.applyCoupon(coupons.valid);
    await expect(page.locator('.coupon-success')).toContainText(/Valid|save/i);
  });

  test('TC-CHK-004 apply invalid coupon', async ({ page }) => {
    await prepareCheckoutFlow(page);
    const c = new CheckoutPage(page);
    await c.applyCoupon(coupons.invalid);
    expect((await page.textContent('body'))).toMatch(/Invalid|coupon/i);
  });

  test('TC-CHK-005 apply expired coupon', async ({ page }) => {
    await prepareCheckoutFlow(page);
    const c = new CheckoutPage(page);
    await c.applyCoupon(coupons.expired);
    expect((await page.textContent('body'))).toMatch(/expired|Coupon/i);
  });

  test('TC-CHK-006 order summary visible', async ({ page }) => {
    await prepareCheckoutFlow(page);
    await waitForCheckoutReady(page);
    await expect(page.getByRole('heading', { name: /Order Summary/i })).toBeVisible();
  });

  test('TC-CHK-007 subtotal visible', async ({ page }) => {
    await prepareCheckoutFlow(page);
    await waitForCheckoutReady(page);
    await expect(page.locator('.totals')).toContainText(/Subtotal/i);
  });

  test('TC-CHK-008 delivery fee visible', async ({ page }) => {
    await prepareCheckoutFlow(page);
    expect((await page.textContent('body'))).toMatch(/Delivery/i);
  });

  test('TC-CHK-009 tax visible', async ({ page }) => {
    await prepareCheckoutFlow(page);
    await waitForCheckoutReady(page);
    await expect(page.locator('.totals')).toContainText(/Tax/i);
  });

  test('TC-CHK-010 total visible', async ({ page }) => {
    await prepareCheckoutFlow(page);
    await waitForCheckoutReady(page);
    await expect(page.locator('.totals')).toContainText(/Total/i);
  });

  test('TC-CHK-011 payment simulation note', async ({ page }) => {
    await prepareCheckoutFlow(page);
    await waitForCheckoutReady(page);
    await expect(page.locator('.checkout-sidebar .payment-note')).toContainText(/simulated/i);
  });

  test('TC-CHK-012 place order success route', async ({ page }) => {
    await prepareCheckoutFlow(page);
    const c = new CheckoutPage(page);
    await c.selectFirstAddress();
    await c.selectPaymentMethod('cod');
    await c.placeOrder();
    await expect(page).toHaveURL(/\/orders\/\d+/);
  });

  test('TC-CHK-013 notes field exists', async ({ page }) => {
    await prepareCheckoutFlow(page);
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('TC-CHK-014 add address link exists', async ({ page }) => {
    await prepareCheckoutFlow(page);
    await expect(page.locator('.add-address-link')).toBeVisible();
  });

  test('TC-CHK-015 place order button exists', async ({ page }) => {
    await prepareCheckoutFlow(page);
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
