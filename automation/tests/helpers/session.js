const { testUsers } = require('../../utils/testData');

/**
 * Logs in as seeded user; waits until token exists and restaurants page loads.
 */
async function loginAsDefaultUser(page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', testUsers.valid.email);
  await page.fill('input[type="password"]', testUsers.valid.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/restaurants/, { timeout: 25000 });
  await page.waitForFunction(() => !!localStorage.getItem('token'), null, { timeout: 10000 });
  await page.waitForSelector('header >> text=Logout', { timeout: 15000 });
}

async function openFirstRestaurant(page, restaurantsPage) {
  await restaurantsPage.goto();
  await restaurantsPage.waitForRestaurants();
  const count = await restaurantsPage.getRestaurantCount();
  if (count > 0) {
    await restaurantsPage.clickFirstRestaurant();
    await page.waitForURL(/\/restaurants\/\d+/, { timeout: 15000 });
    await page.getByRole('heading', { name: 'Menu' }).waitFor({ state: 'visible', timeout: 20000 });
  }
}

module.exports = {
  loginAsDefaultUser,
  openFirstRestaurant,
};
