const BasePage = require('./BasePage');

class OrdersPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      orderCards: '.order-card, a[href^="/orders/"]',
      firstOrder: 'a[href^="/orders/"]',
    };
  }

  async goto() {
    await super.goto('/orders');
    await this.page.getByRole('heading', { name: /My Orders/i }).waitFor({ state: 'visible', timeout: 20000 });
  }

  async clickFirstOrder() {
    await this.page.click(this.selectors.firstOrder);
  }

  async getOrderCount() {
    const cards = await this.page.$$(this.selectors.orderCards);
    return cards.length;
  }
}

module.exports = OrdersPage;
