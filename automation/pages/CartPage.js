const BasePage = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      checkoutBtn: '[data-testid="checkout-link"], a[href="/checkout"]',
      clearCartBtn: 'button:has-text("Clear")',
      emptyMessage: '.cart-empty, .no-orders',
      cartItems: '.cart-item',
      quantityControls: '.quantity-controls button',
    };
  }

  async goto() {
    await super.goto('/cart');
  }

  async clickCheckout() {
    await this.page.locator(this.selectors.checkoutBtn).first().click({ timeout: 15000 });
  }

  async isEmpty() {
    return (await this.page.$(this.selectors.emptyMessage)) !== null;
  }

  async getItemCount() {
    const items = await this.page.$$(this.selectors.cartItems);
    return items.length;
  }

  async increaseQuantity(index = 0) {
    const controls = await this.page.$$(this.selectors.quantityControls);
    const plusBtn = controls.filter(async (b) => (await b.textContent()) === '+')[0] || controls[1];
    if (plusBtn) await plusBtn.click();
  }
}

module.exports = CartPage;
