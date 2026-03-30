const BasePage = require('./BasePage');

class RestaurantDetailPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      addButtons: 'button:has-text("Add")',
      firstAddButton: 'button:has-text("Add")',
      viewCartLink: 'a[href="/cart"]',
      menuItems: '.menu-item',
    };
  }

  async addFirstItem() {
    await this.page.click(this.selectors.firstAddButton);
  }

  async addItemByIndex(index) {
    const buttons = await this.page.$$(this.selectors.addButtons);
    if (buttons[index]) await buttons[index].click();
  }

  async clickViewCart() {
    await this.page.click(this.selectors.viewCartLink);
  }

  async getRestaurantName() {
    return this.page.textContent('h1').catch(() => '');
  }
}

module.exports = RestaurantDetailPage;
