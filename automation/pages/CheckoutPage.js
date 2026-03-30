const BasePage = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      couponInput: 'input[placeholder*="coupon"]',
      applyCouponBtn: 'button:has-text("Apply")',
      placeOrderBtn: 'button[type="submit"]',
      addressOptions: 'input[name="address"]',
      paymentMethodCard: 'input[name="paymentMethod"][value="card"]',
      paymentMethodUpi: 'input[name="paymentMethod"][value="upi"]',
      paymentMethodWallet: 'input[name="paymentMethod"][value="wallet"]',
      paymentMethodCod: 'input[name="paymentMethod"][value="cod"]',
      cardHolderName: 'input[placeholder="John Doe"]',
      cardNumber: 'input[placeholder="4111111111111111"]',
      cardExpiry: 'input[placeholder="12/30"]',
      cardCvv: 'input[placeholder="123"]',
      upiId: 'input[placeholder="name@upi"]',
    };
  }

  async goto() {
    await super.goto('/checkout');
  }

  async applyCoupon(code) {
    await this.page.fill(this.selectors.couponInput, code);
    await this.page.click(this.selectors.applyCouponBtn);
  }

  async selectFirstAddress() {
    await this.page.locator(this.selectors.addressOptions).first().check({ timeout: 10000 });
  }

  async placeOrder() {
    await this.page.click(this.selectors.placeOrderBtn, { timeout: 15000 });
  }

  async selectPaymentMethod(method) {
    const map = {
      card: this.selectors.paymentMethodCard,
      upi: this.selectors.paymentMethodUpi,
      wallet: this.selectors.paymentMethodWallet,
      cod: this.selectors.paymentMethodCod,
    };
    const selector = map[method];
    if (selector) {
      await this.page.locator(selector).check({ timeout: 10000 });
    }
  }

  async fillCardDetails({ cardHolderName, cardNumber, expiry, cvv }) {
    await this.page.fill(this.selectors.cardHolderName, cardHolderName || '');
    await this.page.fill(this.selectors.cardNumber, cardNumber || '');
    await this.page.fill(this.selectors.cardExpiry, expiry || '');
    await this.page.fill(this.selectors.cardCvv, cvv || '');
  }

  async fillUpi(upiId) {
    const loc = this.page.locator(this.selectors.upiId);
    await loc.clear();
    if (upiId) await loc.fill(upiId);
  }

  async hasAddresses() {
    const count = await this.page.$$(this.selectors.addressOptions);
    return count.length > 0;
  }
}

module.exports = CheckoutPage;
