const BasePage = require('./BasePage');

class RestaurantsPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      searchInput: '.search-input, input[placeholder*="Search"]',
      cuisineFilter: 'select',
      restaurantCards: 'a.restaurant-card.card[href^="/restaurants/"]',
      firstRestaurant: 'a.restaurant-card.card[href^="/restaurants/"]',
    };
  }

  async goto() {
    await super.goto('/restaurants');
  }

  async search(query) {
    await this.page.fill(this.selectors.searchInput, query);
    await this.page.waitForTimeout(500);
  }

  async selectCuisine(value) {
    const selects = await this.page.$$('select');
    if (selects.length > 0) await selects[0].selectOption(value);
  }

  async getRestaurantCount() {
    const cards = await this.page.$$(this.selectors.restaurantCards);
    return cards.length;
  }

  async clickFirstRestaurant() {
    const link = this.page.locator('a.restaurant-card.card[href^="/restaurants/"]').first();
    await link.waitFor({ state: 'visible', timeout: 15000 });
    await link.click();
  }

  async waitForRestaurants() {
    await this.page.waitForSelector(this.selectors.restaurantCards, { timeout: 10000 }).catch(() => {});
  }
}

module.exports = RestaurantsPage;
