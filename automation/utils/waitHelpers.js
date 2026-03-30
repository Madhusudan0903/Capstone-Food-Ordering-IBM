async function waitForPageLoad(page) {
  await page.waitForLoadState('networkidle');
}

async function waitForSelector(page, selector, options = {}) {
  await page.waitForSelector(selector, { timeout: options.timeout || 10000, state: options.state || 'visible' });
}

async function waitForUrl(page, urlPattern, options = {}) {
  await page.waitForURL(urlPattern, { timeout: options.timeout || 10000 });
}

module.exports = {
  waitForPageLoad,
  waitForSelector,
  waitForUrl,
};
