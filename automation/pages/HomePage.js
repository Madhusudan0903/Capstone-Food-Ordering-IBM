const BasePage = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      browseRestaurantsBtn: 'a[href="/restaurants"]',
      loginLink: 'a[href="/login"]',
      registerLink: 'a[href="/register"]',
    };
  }

  async goto() {
    await super.goto('/');
  }

  async clickBrowseRestaurants() {
    await this.page.click(this.selectors.browseRestaurantsBtn);
  }

  async clickLogin() {
    await this.page.click(this.selectors.loginLink);
  }

  async clickRegister() {
    await this.page.click(this.selectors.registerLink);
  }

  async isLoggedIn() {
    return (await this.page.textContent('header')).includes('Logout');
  }
}

module.exports = HomePage;
