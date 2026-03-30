# Test Plan

## Capstone Food Ordering Platform

**Date:** March 2025

---

## 1. Test Plan Identifier

TP-FOOD-001

## 2. References

- Test Strategy: 01-Test-Strategy.md
- Application: FoodEase (React + Node.js + MySQL)
- Automation: Playwright (JavaScript), Chrome only

## 3. Test Items

| #   | Module            | Description                                          |
| --- | ----------------- | ---------------------------------------------------- |
| 1   | Auth              | User registration, login, logout, validation         |
| 2   | Restaurant Search | Search, filter, and browse restaurants               |
| 3   | Menu & Cart       | View menu, add/update/remove items in cart           |
| 4   | Checkout & Coupon | Address selection, coupon application, order summary |
| 5   | Order Tracking    | Order status updates and delivery tracking           |
| 6   | Reviews           | Submit, view, and validate user reviews              |
| 7   | Profile & Address | Manage user profile and delivery addresses           |
| 8   | UI Navigation     | Navigation between pages, routing, responsiveness    |
| 9   | Payment (Mock)    | Simulated payment flow and transaction handling      |

## 4. Features to be Tested

- **Authentication Module**

  - User registration with valid/invalid inputs
  - Login/logout functionality
  - Error handling for incorrect credentials

- **Restaurant Search Module**

  - Restaurant listing display
  - Search functionality (name, cuisine)
  - Filters (rating, price, category)

- **Menu & Cart Module**

  - Menu display with categories
  - Add items to cart
  - Update quantity / remove items
  - Cart persistence and calculations

- **Checkout & Coupon Module**

  - Address selection and validation
  - Coupon application (valid/invalid/expired)
  - Order summary correctness

- **Order Tracking Module**

  - Order status flow (placed → preparing → out for delivery → delivered)
  - Estimated delivery time display

- **Reviews Module**

  - Submit reviews and ratings
  - View existing reviews
  - Prevent duplicate or invalid submissions

- **Profile & Address Module**

  - Add/edit/delete address
  - Update user profile details
  - Validation of user inputs

- **UI Navigation Module**

  - Page routing and navigation
  - Header/footer links functionality
  - Responsive UI behavior

- **Payment (Mock) Module**

  - Payment method selection
  - Simulated transaction success/failure
  - Payment confirmation handling
  - Error handling during failed payments

## 5. Features NOT to be Tested

- Performance (load, stress)
- Security (penetration, vulnerability)
- Standalone API testing
- Non-Chrome browsers

## 6. Test Approach

### 6.1 Test Design Techniques

- **Equivalence Partitioning:** Valid/invalid input classes
- **Boundary Value Analysis:** Min/max lengths, quantities, ratings
- **Decision Tables:** Coupon rules, order status transitions

### 6.2 Test Case Design

- Minimum 15 test cases per module
- Unique Test Case ID format: TC-MODULE-NNN (e.g., TC-REG-001)
- Each case: ID, Description, Preconditions, Steps, Test Data, Expected Result

## 7. Pass/Fail Criteria

- Test Pass: Actual result matches expected
- Test Fail: Actual differs from expected (log defect)
- Blocked: Cannot execute due to dependency/environment

## 8. Suspension/Resumption

- **Suspend:** Critical defect blocks majority of tests
- **Resume:** Blocking issue resolved, environment stable

## 9. Test Deliverables

- Test cases document
- Test data sheet
- Execution report
- Defect report
- Automation scripts
- Framework architecture diagram
