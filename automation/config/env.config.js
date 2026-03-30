// `env.config.js` is used to **store and manage environment-specific settings** (like URLs, users, timeouts) for your automation tests.

// It lets you:

// * Easily switch between **test / staging environments**
// * Avoid hardcoding values in test cases
// * Keep your code **clean, reusable, and scalable**

//  You just change `NODE_ENV`, and all configs update automatically.

const env = process.env.NODE_ENV || "test";

const configs = {
  test: {
    baseUrl: "http://localhost:5173",
    apiUrl: "http://localhost:5000",
    timeout: 30000,
    user: {
      email: "john@example.com",
      password: "password123",
    },
  },
  staging: {
    baseUrl: process.env.BASE_URL || "http://localhost:5173",
    apiUrl: process.env.API_URL || "http://localhost:5000",
    timeout: 30000,
    user: {
      email: process.env.TEST_USER_EMAIL || "john@example.com",
      password: process.env.TEST_USER_PASSWORD || "password123",
    },
  },
};

module.exports = configs[env] || configs.test;
