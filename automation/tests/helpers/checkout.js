const RestaurantsPage = require('../../pages/RestaurantsPage');
const RestaurantDetailPage = require('../../pages/RestaurantDetailPage');

/**
 * Ensures cart has enough items and navigates to checkout.
 * Clears cart first to avoid "different restaurant" conflicts between tests.
 */
async function prepareCheckoutFlow(page) {
  await page.evaluate(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const r = await fetch('/api/cart/clear', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await r.text();
    } catch (_) {
      /* ignore */
    }
  });

  const rp = new RestaurantsPage(page);
  await rp.goto();
  await rp.waitForRestaurants();
  const count = await rp.getRestaurantCount();
  if (count === 0) {
    throw new Error('No restaurants available for checkout flow');
  }
  await rp.clickFirstRestaurant();
  await page.waitForURL(/\/restaurants\/\d+/, { timeout: 15000 });
  await page.getByRole('heading', { name: 'Menu' }).waitFor({ state: 'visible', timeout: 20000 });

  const dp = new RestaurantDetailPage(page);
  await page.waitForSelector('button:has-text("Add")', { state: 'visible', timeout: 15000 });
  for (let i = 0; i < 2; i++) {
    const addDone = page.waitForResponse(
      (res) => res.url().includes('/api/cart/add') && res.request().method() === 'POST',
      { timeout: 20000 }
    );
    await dp.addFirstItem();
    await addDone.catch(() => {});
  }

  await page.goto('/cart');
  await page.waitForLoadState('domcontentloaded');
  await page.getByText(/Loading cart/i).waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {});

  const checkout = page.getByTestId('checkout-link');
  await checkout.waitFor({ state: 'visible', timeout: 25000 });
  await checkout.click();
  await page.waitForURL(/\/checkout/, { timeout: 20000 });
  await page.getByRole('heading', { name: /^Checkout$/i }).waitFor({ state: 'visible', timeout: 20000 });
  await page.getByText(/^Loading\.\.\.$/i).waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {});
}

module.exports = { prepareCheckoutFlow };
