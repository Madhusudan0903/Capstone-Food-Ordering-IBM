# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - link "🍔 FoodEase" [ref=e6] [cursor=pointer]:
        - /url: /
        - generic [ref=e7]: 🍔
        - text: FoodEase
      - navigation [ref=e8]:
        - link "Restaurants" [ref=e9] [cursor=pointer]:
          - /url: /restaurants
        - link "Login" [ref=e10] [cursor=pointer]:
          - /url: /login
        - link "Sign Up" [ref=e11] [cursor=pointer]:
          - /url: /register
  - main [ref=e12]:
    - generic [ref=e14]:
      - heading "Login" [level=1] [ref=e15]
      - generic [ref=e16]:
        - generic [ref=e17]: Login failed
        - generic [ref=e18]:
          - generic [ref=e19]: Email
          - textbox "you@example.com" [ref=e20]: john@example.com
        - generic [ref=e21]:
          - generic [ref=e22]: Password
          - textbox "••••••••" [ref=e23]: password123
        - button "Login" [ref=e24] [cursor=pointer]
      - paragraph [ref=e25]:
        - text: Don't have an account?
        - link "Sign up" [ref=e26] [cursor=pointer]:
          - /url: /register
  - contentinfo [ref=e27]:
    - paragraph [ref=e29]: © 2025 FoodEase - Capstone Food Ordering Platform
```