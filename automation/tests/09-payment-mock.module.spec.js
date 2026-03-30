const { test, expect } = require('@playwright/test');
const CheckoutPage = require('../pages/CheckoutPage');
const { loginAsDefaultUser } = require('./helpers/session');
const { prepareCheckoutFlow } = require('./helpers/checkout');

test.describe('Module: Payment Mocking (15 cases)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDefaultUser(page);
    await prepareCheckoutFlow(page);
  });

  test('TC-PAY-001 payment section visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Payment \(Mock\)/i })).toBeVisible();
  });

  test('TC-PAY-002 card method selected by default', async ({ page }) => {
    await expect(page.locator('input[name="paymentMethod"][value="card"]')).toBeChecked();
  });

  test('TC-PAY-003 card fields visible for card method', async ({ page }) => {
    await expect(page.locator('input[placeholder="4111111111111111"]')).toBeVisible();
  });

  test('TC-PAY-004 switch to UPI shows upi field', async ({ page }) => {
    const c = new CheckoutPage(page);
    await c.selectPaymentMethod('upi');
    await expect(page.locator('input[placeholder="name@upi"]')).toBeVisible();
  });

  test('TC-PAY-005 switch to wallet shows mock note', async ({ page }) => {
    const c = new CheckoutPage(page);
    await c.selectPaymentMethod('wallet');
    await expect(page.getByText(/wallet payment/i)).toBeVisible();
  });

  test('TC-PAY-006 switch to COD shows cod note', async ({ page }) => {
    const c = new CheckoutPage(page);
    await c.selectPaymentMethod('cod');
    await expect(page.locator('.checkout-main .payment-note')).toContainText(/Cash on Delivery/i);
  });

  test('TC-PAY-007 card required validation', async ({ page }) => {
    const c = new CheckoutPage(page);
    await c.selectPaymentMethod('card');
    await c.fillCardDetails({ cardHolderName: '', cardNumber: '', expiry: '', cvv: '' });
    await c.placeOrder();
    await expect(page.getByText(/card details/i)).toBeVisible();
  });

  test('TC-PAY-008 upi required validation', async ({ page }) => {
    const c = new CheckoutPage(page);
    await c.selectPaymentMethod('upi');
    await c.fillUpi('');
    await c.placeOrder();
    await expect(page.locator('.coupon-error')).toContainText(/valid UPI/i);
  });

  test('TC-PAY-009 mock card decline with cvv 000', async ({ page }) => {
    const c = new CheckoutPage(page);
    await c.selectFirstAddress();
    await c.selectPaymentMethod('card');
    await c.fillCardDetails({
      cardHolderName: 'QE User',
      cardNumber: '4111111111111111',
      expiry: '12/30',
      cvv: '000',
    });
    await c.placeOrder();
    await expect(page.locator('[data-testid="order-error"]')).toContainText(/declined/i);
  });

  test('TC-PAY-010 mock card decline with number ending 0000', async ({ page }) => {
    const c = new CheckoutPage(page);
    await c.selectFirstAddress();
    await c.selectPaymentMethod('card');
    await c.fillCardDetails({
      cardHolderName: 'QE User',
      cardNumber: '4444333322220000',
      expiry: '12/30',
      cvv: '123',
    });
    await c.placeOrder();
    await expect(page.locator('[data-testid="order-error"]')).toContainText(/declined/i);
  });

  test('TC-PAY-011 mock card success route', async ({ page }) => {
    const c = new CheckoutPage(page);
    await c.selectFirstAddress();
    await c.selectPaymentMethod('card');
    await c.fillCardDetails({
      cardHolderName: 'QE User',
      cardNumber: '4111111111111111',
      expiry: '12/30',
      cvv: '123',
    });
    await c.placeOrder();
    await expect(page).toHaveURL(/\/orders\/\d+/);
  });

  test('TC-PAY-012 mock UPI success route', async ({ page }) => {
    const c = new CheckoutPage(page);
    await c.selectFirstAddress();
    await c.selectPaymentMethod('upi');
    await c.fillUpi('test@upi');
    await c.placeOrder();
    await expect(page).toHaveURL(/\/orders\/\d+/);
  });

  test('TC-PAY-013 mock wallet success route', async ({ page }) => {
    const c = new CheckoutPage(page);
    await c.selectFirstAddress();
    await c.selectPaymentMethod('wallet');
    await c.placeOrder();
    await expect(page).toHaveURL(/\/orders\/\d+/);
  });

  test('TC-PAY-014 mock cod success route', async ({ page }) => {
    const c = new CheckoutPage(page);
    await c.selectFirstAddress();
    await c.selectPaymentMethod('cod');
    await c.placeOrder();
    await expect(page).toHaveURL(/\/orders\/\d+/);
  });

  test('TC-PAY-015 payment remains simulated text', async ({ page }) => {
    await expect(page.getByText(/simulated|Mock/i).first()).toBeVisible();
  });
});
