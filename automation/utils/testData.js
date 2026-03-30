const testUsers = {
  valid: {
    email: 'john@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
  },
  newUser: {
    email: `test_${Date.now()}@example.com`,
    password: 'pass123',
    firstName: 'Test',
    lastName: 'User',
  },
  invalid: {
    email: 'wrong@example.com',
    password: 'wrongpass',
  },
};

const coupons = {
  valid: 'WELCOME10',
  expired: 'EXPIRED',
  invalid: 'INVALID123',
};

module.exports = { testUsers, coupons };
