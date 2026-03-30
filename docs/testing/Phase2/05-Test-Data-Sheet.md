# Test Data Sheet

## Capstone Food Ordering Platform

---

## 📌 Objective

To define test data required for validating Authentication, Restaurants, and Menu + Cart functionalities.

---

# 🔐 Authentication Test Data

| Type    | Field    | Test Data                                           | Purpose                   |
| ------- | -------- | --------------------------------------------------- | ------------------------- |
| Valid   | Email    | [user1@example.com](mailto:user1@example.com)       | Successful login/register |
| Valid   | Password | Password@123                                        | Valid password            |
| Invalid | Email    | abc@                                                | Email validation          |
| Invalid | Password | 123                                                 | Weak password check       |
| Invalid | Email    | [existing@example.com](mailto:existing@example.com) | Duplicate registration    |
| Invalid | Password | wrongpass                                           | Invalid login             |
| Edge    | Email    | " [user1@example.com](mailto:user1@example.com) "   | Trim spaces               |
| Empty   | Email    | ""                                                  | Required field validation |
| Empty   | Password | ""                                                  | Required field validation |

---

# 🍽️ Restaurant Test Data

| Type     | Field  | Test Data     | Purpose                |
| -------- | ------ | ------------- | ---------------------- |
| Valid    | Search | Pizza         | Matching restaurants   |
| Valid    | Search | Burger        | Relevant results       |
| Invalid  | Search | XYZ123        | No results scenario    |
| Edge     | Search | PIZZA         | Case-insensitive check |
| Valid    | Filter | Veg           | Category filter        |
| Valid    | Filter | Non-Veg       | Category filter        |
| Combined | Filter | Veg + Rating  | Multiple filters       |
| Edge     | Data   | Missing Image | UI fallback check      |

---

# 🛒 Menu & Cart Test Data

| Type    | Field          | Test Data        | Purpose                |
| ------- | -------------- | ---------------- | ---------------------- |
| Valid   | Item           | Margherita Pizza | Add to cart            |
| Valid   | Item           | Veg Burger       | Add multiple items     |
| Valid   | Quantity       | 2                | Quantity update        |
| Edge    | Quantity       | 0                | Boundary validation    |
| Invalid | Item           | Null             | Invalid operation      |
| Valid   | Price          | 200, 300         | Cart total calculation |
| Edge    | Cart           | Empty            | Empty cart state       |
| Valid   | Duplicate Item | Same item twice  | Quantity increment     |

---

# ⚙️ Dynamic Test Data (For Automation)

| Type          | Data             | Example                       |
| ------------- | ---------------- | ----------------------------- |
| Random Email  | Generated email  | user\_<timestamp>@example.com |
| Random User   | Dynamic username | user123                       |
| Session Token | Auto-generated   | After login                   |
| Cart Data     | Runtime items    | Added during test             |

---

# 🔗 Module-wise Data Mapping

| Module         | Data Used              |
| -------------- | ---------------------- |
| Authentication | Emails, Passwords      |
| Restaurants    | Search terms, Filters  |
| Menu & Cart    | Items, Quantity, Price |

---

# ✅ Summary

- Covers: Positive, Negative, Edge cases
- Supports: Manual + Automation testing
- Ensures: Realistic and reusable test data

✔ Clean and structured
✔ Fully aligned with test cases
✔ Ready for evaluation

---
