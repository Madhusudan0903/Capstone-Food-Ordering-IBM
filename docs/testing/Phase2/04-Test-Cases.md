# Test Cases Document

## Capstone Food Ordering Platform

---

## 📌 Objective

To define detailed test cases for Authentication, Restaurants, and Menu + Cart modules with proper validation, edge cases, and expected results.

---

# 🔐 Module 1: Authentication

| ID          | Description                   | Steps                                        | Test Data                                 | Expected Result         | Priority | Technique  |
| ----------- | ----------------------------- | -------------------------------------------- | ----------------------------------------- | ----------------------- | -------- | ---------- |
| TC-AUTH-001 | Register with valid data      | Open register → Enter valid details → Submit | Valid user                                | Registration successful | High     | Positive   |
| TC-AUTH-002 | Register with duplicate email | Enter existing email → Submit                | Existing email                            | Error shown             | High     | Negative   |
| TC-AUTH-003 | Invalid email format          | Enter wrong email                            | abc@                                      | Validation message      | Medium   | Validation |
| TC-AUTH-004 | Weak password                 | Enter weak password                          | 123                                       | Validation shown        | Medium   | Boundary   |
| TC-AUTH-005 | Empty fields                  | Submit without input                         | Blank                                     | Required field errors   | High     | Negative   |
| TC-AUTH-006 | Login with valid credentials  | Enter valid login → Submit                   | Valid creds                               | Login success           | High     | Positive   |
| TC-AUTH-007 | Login with wrong password     | Enter wrong password                         | Invalid pass                              | Error message           | High     | Negative   |
| TC-AUTH-008 | Login with unregistered email | Enter unknown email                          | [fake@mail.com](mailto:fake@mail.com)     | Error shown             | High     | Negative   |
| TC-AUTH-009 | Error message visibility      | Trigger login failure                        | Invalid creds                             | Error displayed clearly | Medium   | UI         |
| TC-AUTH-010 | Session persistence           | Login → Refresh page                         | Valid session                             | User stays logged in    | Medium   | Functional |
| TC-AUTH-011 | Unauthorized access           | Access protected page                        | Not logged in                             | Redirect to login       | High     | Security   |
| TC-AUTH-012 | Redirect after login          | Login user                                   | Valid creds                               | Redirect to home        | Medium   | Functional |
| TC-AUTH-013 | Logout functionality          | Click logout                                 | Logged-in user                            | Session cleared         | High     | Functional |
| TC-AUTH-014 | Navigation between pages      | Switch login/register                        | -                                         | Navigation works        | Low      | UI         |
| TC-AUTH-015 | Trim input spaces             | Enter spaced email                           | " [user@mail.com](mailto:user@mail.com) " | Login success           | Medium   | Edge Case  |

---

# 🍽️ Module 2: Restaurants

| ID         | Description                | Steps             | Test Data    | Expected Result           | Priority | Technique  |
| ---------- | -------------------------- | ----------------- | ------------ | ------------------------- | -------- | ---------- |
| TC-RST-001 | View restaurant list       | Open homepage     | -            | Restaurants visible       | High     | Functional |
| TC-RST-002 | Restaurant details preview | Check cards       | -            | Name, image, rating shown | Medium   | UI         |
| TC-RST-003 | Open restaurant page       | Click restaurant  | -            | Detail page opens         | High     | Functional |
| TC-RST-004 | Restaurant details load    | Open details      | -            | Correct data shown        | High     | Functional |
| TC-RST-005 | Search by name             | Enter search term | Pizza        | Matching results          | High     | Functional |
| TC-RST-006 | Relevant search results    | Search valid term | Burger       | Correct list              | High     | Functional |
| TC-RST-007 | Case-insensitive search    | Search uppercase  | PIZZA        | Same results              | Medium   | Edge Case  |
| TC-RST-008 | No results scenario        | Search invalid    | XYZ123       | “No results” shown        | Medium   | Negative   |
| TC-RST-009 | Filter by category         | Apply filter      | Veg          | Filtered results          | High     | Functional |
| TC-RST-010 | Multiple filters           | Apply multiple    | Veg + Rating | Correct results           | Medium   | Functional |
| TC-RST-011 | Reset filters              | Clear filters     | -            | All results shown         | Medium   | Functional |
| TC-RST-012 | Back navigation            | Go back           | -            | Returns to list           | Low      | UI         |
| TC-RST-013 | Image loading              | Check images      | -            | Images load properly      | Medium   | UI         |
| TC-RST-014 | Scroll/pagination          | Scroll list       | -            | More data loads           | Low      | Functional |
| TC-RST-015 | API failure handling       | Simulate failure  | -            | Error UI shown            | High     | Negative   |

---

# 🛒 Module 3: Menu + Cart

| ID         | Description             | Steps               | Test Data   | Expected Result      | Priority | Technique   |
| ---------- | ----------------------- | ------------------- | ----------- | -------------------- | -------- | ----------- |
| TC-MCT-001 | View menu items         | Open restaurant     | -           | Menu visible         | High     | Functional  |
| TC-MCT-002 | Menu item details       | Check item          | -           | Name, price shown    | Medium   | UI          |
| TC-MCT-003 | Add item to cart        | Click add           | Item        | Item added           | High     | Functional  |
| TC-MCT-004 | Add multiple items      | Add different items | Items       | All added            | High     | Functional  |
| TC-MCT-005 | View cart items         | Open cart           | -           | Items listed         | High     | Functional  |
| TC-MCT-006 | Update quantity         | Increase item qty   | + button    | Qty updated          | Medium   | Functional  |
| TC-MCT-007 | Remove item             | Remove item         | -           | Item removed         | High     | Functional  |
| TC-MCT-008 | Clear cart              | Click clear cart    | -           | Cart empty           | High     | Functional  |
| TC-MCT-009 | Cart total calculation  | Add items           | Prices      | Correct total        | High     | Calculation |
| TC-MCT-010 | Empty cart state        | Open empty cart     | -           | Message shown        | Medium   | UI          |
| TC-MCT-011 | Proceed to checkout     | Click checkout      | Items added | Navigate to checkout | High     | Functional  |
| TC-MCT-012 | Cart persistence        | Refresh page        | Items added | Cart retained        | Medium   | Functional  |
| TC-MCT-013 | Duplicate item handling | Add same item       | Same item   | Qty increases        | Medium   | Edge Case   |
| TC-MCT-014 | Invalid operations      | Remove non-existing | -           | No crash             | Medium   | Negative    |
| TC-MCT-015 | Dynamic UI update       | Add/remove items    | -           | UI updates instantly | Medium   | UI          |

---

# ✅ Summary

- Total Test Cases: 45
- Modules Covered: 3
- Techniques Used: Positive, Negative, Boundary, Edge Case, UI, Functional

✔ Fully aligned with test scenarios
✔ Ready for automation mapping
✔ Covers real-world edge cases

---
