# Test Scenarios Document

## Capstone Food Ordering Platform

---

## 📌 Objective

To define high-level functional test scenarios for Authentication, Restaurants, and Menu + Cart modules, ensuring complete traceability with detailed test cases.

---

## 📦 Scope

Modules Covered:

1. Authentication (Register & Login)
2. Restaurants & Search
3. Menu + Cart

---

# 🔐 Module 1: Authentication (Register + Login)

## 🎯 Goal

Validate user authentication, input validation, and session handling.

| Scenario ID | Scenario Description                                     |
| ----------- | -------------------------------------------------------- |
| TS-AUTH-001 | User should register with valid details                  |
| TS-AUTH-002 | User should not register with duplicate email            |
| TS-AUTH-003 | Validation should appear for invalid email format        |
| TS-AUTH-004 | Validation should appear for weak password               |
| TS-AUTH-005 | User should not register with empty fields               |
| TS-AUTH-006 | User should login with valid credentials                 |
| TS-AUTH-007 | User should not login with incorrect password            |
| TS-AUTH-008 | User should not login with unregistered email            |
| TS-AUTH-009 | Error message should be displayed on failed login        |
| TS-AUTH-010 | User session should persist after refresh                |
| TS-AUTH-011 | Unauthorized user should be blocked from protected pages |
| TS-AUTH-012 | Logged-in user should be redirected from login page      |
| TS-AUTH-013 | User should logout successfully                          |
| TS-AUTH-014 | Navigation between login and register should work        |
| TS-AUTH-015 | Input fields should trim leading/trailing spaces         |

---

# 🍽️ Module 2: Restaurants & Search

## 🎯 Goal

Validate restaurant browsing, search, filtering, and navigation.

| Scenario ID | Scenario Description                                |
| ----------- | --------------------------------------------------- |
| TS-RST-001  | User should view list of restaurants                |
| TS-RST-002  | Restaurants should display name, image, rating      |
| TS-RST-003  | User should open restaurant detail page             |
| TS-RST-004  | Restaurant details should load correctly            |
| TS-RST-005  | User should search restaurants by name              |
| TS-RST-006  | Search results should match query                   |
| TS-RST-007  | Search should be case-insensitive                   |
| TS-RST-008  | No results message should be shown                  |
| TS-RST-009  | User should filter by cuisine/category              |
| TS-RST-010  | Multiple filters should work together               |
| TS-RST-011  | Filters should reset correctly                      |
| TS-RST-012  | User should navigate back to list page              |
| TS-RST-013  | Restaurant images should load properly              |
| TS-RST-014  | Pagination or scrolling should work (if applicable) |
| TS-RST-015  | API failure should show fallback/error UI           |

---

# 🛒 Module 3: Menu + Cart

## 🎯 Goal

Validate menu display, cart operations, and checkout flow.

| Scenario ID | Scenario Description                             |
| ----------- | ------------------------------------------------ |
| TS-MCT-001  | User should view menu items                      |
| TS-MCT-002  | Menu should display item name, price, image      |
| TS-MCT-003  | User should add item to cart                     |
| TS-MCT-004  | User should add multiple items                   |
| TS-MCT-005  | Cart should display added items                  |
| TS-MCT-006  | Item quantity should update correctly            |
| TS-MCT-007  | User should remove item from cart                |
| TS-MCT-008  | User should clear entire cart                    |
| TS-MCT-009  | Cart total should be calculated correctly        |
| TS-MCT-010  | Empty cart state should be shown                 |
| TS-MCT-011  | User should proceed to checkout                  |
| TS-MCT-012  | Cart should persist during session               |
| TS-MCT-013  | Duplicate item addition should increase quantity |
| TS-MCT-014  | Invalid operations should be handled gracefully  |
| TS-MCT-015  | Cart UI should update dynamically                |

---

# 🔗 Traceability Mapping

| Module         | Scenario IDs              | Test Case Mapping         |
| -------------- | ------------------------- | ------------------------- |
| Authentication | TS-AUTH-001 → TS-AUTH-015 | TC-AUTH-001 → TC-AUTH-015 |
| Restaurants    | TS-RST-001 → TS-RST-015   | TC-RST-001 → TC-RST-015   |
| Menu + Cart    | TS-MCT-001 → TS-MCT-015   | TC-MCT-001 → TC-MCT-015   |

---

# ✅ Summary

- Total Modules: 3
- Total Scenarios: 45
- Coverage: Functional + Negative + Edge + Error Handling

✔ Fully aligned with test cases
✔ Ready for automation mapping
✔ Meets evaluation standards

---
