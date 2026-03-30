// wrap all UI interactions inside this class
// LoginPage.js is a Page Object Model class that encapsulates UI elements and actions of the login page. It improves reusability, readability, and maintainability by separating test logic from UI interaction logic

const BasePage = require("./BasePage");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      emailInput: 'input[type="email"]',
      passwordInput: 'input[type="password"]',
      submitButton: 'button[type="submit"]',
      errorBanner: ".error-banner",
      registerLink: 'a[href="/register"]',
    };
  }

  async goto() {
    await super.goto("/login");
  }

  async login(email, password) {
    await this.page.fill(this.selectors.emailInput, email);
    await this.page.fill(this.selectors.passwordInput, password);
    await this.page.click(this.selectors.submitButton);
  }

  async getError() {
    return this.page.textContent(this.selectors.errorBanner).catch(() => null);
  }

  async clickRegister() {
    await this.page.click(this.selectors.registerLink);
  }

  async isLoginPage() {
    return this.page.url().includes("/login");
  }
}

module.exports = LoginPage;
