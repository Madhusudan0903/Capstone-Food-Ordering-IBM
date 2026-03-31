const { testUsers } = require("../../utils/testData");

/**
 * Ensures test user exists (important for CI fresh DB)
 */
async function ensureUserExists(request) {
  try {
    await request.post("http://localhost:5000/api/auth/register", {
      data: testUsers.valid,
    });
  } catch (e) {
    // ignore if user already exists
  }
}

/**
 * Logs in as seeded user; waits until token exists and UI reflects login.
 */
async function loginAsDefaultUser(page, request) {
  // ✅ Ensure user exists (critical for CI)
  if (request) {
    await ensureUserExists(request);
  }

  await page.goto("/login");

  await page.fill('input[type="email"]', testUsers.valid.email);
  await page.fill('input[type="password"]', testUsers.valid.password);

  // ✅ Wait for login API instead of blindly waiting for URL
  const [loginResponse] = await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes("/api/auth/login") &&
        res.request().method() === "POST",
      { timeout: 20000 },
    ),
    page.click('button[type="submit"]'),
  ]);

  // ❗ Fail fast if login API fails
  if (!loginResponse.ok()) {
    const body = await loginResponse.text();
    throw new Error(`Login failed: ${body}`);
  }

  // ✅ Wait for token (most reliable signal)
  await page.waitForFunction(() => !!localStorage.getItem("token"), null, {
    timeout: 15000,
  });

  // ✅ Optional: wait for navigation (do NOT depend only on this)
  await page.waitForURL(/\/restaurants/, { timeout: 20000 }).catch(() => {});

  // ✅ Final UI confirmation (very important)
  await page.waitForSelector("header >> text=Logout", { timeout: 15000 });
}

/**
 * Opens first restaurant safely
 */
async function openFirstRestaurant(page, restaurantsPage) {
  await restaurantsPage.goto();

  // ✅ Wait for list to load properly (CI safe)
  await restaurantsPage.waitForRestaurants();

  // extra safety (slow CI)
  await page.waitForSelector(
    '[data-testid="restaurant-card"], .restaurant-card',
    { timeout: 20000 },
  );

  const count = await restaurantsPage.getRestaurantCount();

  if (count > 0) {
    await restaurantsPage.clickFirstRestaurant();

    await page.waitForURL(/\/restaurants\/\d+/, { timeout: 20000 });

    await page
      .getByRole("heading", { name: /menu/i })
      .waitFor({ state: "visible", timeout: 20000 });
  } else {
    throw new Error("No restaurants found");
  }
}

module.exports = {
  loginAsDefaultUser,
  openFirstRestaurant,
};
