class BasePage {
  constructor(page, baseURL = 'http://localhost:5173') {
    this.page = page;
    this.baseURL = baseURL;
  }

  async goto(path = '/') {
    await this.page.goto(`${this.baseURL}${path}`);
  }

  async getTitle() {
    return this.page.title();
  }

  async click(selector) {
    await this.page.click(selector);
  }

  async fill(selector, value) {
    await this.page.fill(selector, value);
  }

  async getText(selector) {
    return this.page.textContent(selector);
  }

  async waitForSelector(selector, options = {}) {
    await this.page.waitForSelector(selector, { timeout: 10000, ...options });
  }

  async waitForUrl(pattern) {
    await this.page.waitForURL(pattern, { timeout: 10000 });
  }
}

module.exports = BasePage;
