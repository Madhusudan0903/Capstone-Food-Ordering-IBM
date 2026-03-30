const BasePage = require('./BasePage');

class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      emailInput: 'input[name="email"], input[type="email"]',
      passwordInput: 'input[name="password"]',
      confirmPasswordInput: 'input[name="confirmPassword"]',
      firstNameInput: 'input[name="firstName"]',
      lastNameInput: 'input[name="lastName"]',
      submitButton: 'button[type="submit"]',
      errorBanner: '.error-banner',
      loginLink: 'a[href="/login"]',
    };
  }

  async goto() {
    await super.goto('/register');
  }

  async register(data) {
    await this.page.fill(this.selectors.firstNameInput, data.firstName);
    await this.page.fill(this.selectors.lastNameInput, data.lastName);
    await this.page.fill(this.selectors.emailInput, data.email);
    if (data.phone) await this.page.fill('input[name="phone"]', data.phone);
    await this.page.fill(this.selectors.passwordInput, data.password);
    await this.page.fill(this.selectors.confirmPasswordInput, data.confirmPassword || data.password);
    await this.page.click(this.selectors.submitButton);
  }

  async getError() {
    return this.page.textContent(this.selectors.errorBanner).catch(() => null);
  }
}

module.exports = RegisterPage;
