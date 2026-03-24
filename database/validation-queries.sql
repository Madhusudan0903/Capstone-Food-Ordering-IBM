-- Database Validation Queries for UI vs DB Testing
-- Use these to validate data consistency

-- 1. User count
SELECT COUNT(*) AS user_count FROM users;

-- 2. Restaurants with menu items
SELECT r.name, COUNT(mi.id) AS menu_item_count
FROM restaurants r
LEFT JOIN menu_categories mc ON mc.restaurant_id = r.id
LEFT JOIN menu_items mi ON mi.category_id = mc.id
GROUP BY r.id, r.name;

-- 3. Cart vs cart_items consistency
SELECT c.id, c.user_id, COUNT(ci.id) AS item_count
FROM cart c
LEFT JOIN cart_items ci ON ci.cart_id = c.id
GROUP BY c.id;

-- 4. Order totals validation
SELECT o.id, o.subtotal, o.discount, o.delivery_fee, o.tax, o.total,
  (SELECT SUM(price * quantity) FROM order_items WHERE order_id = o.id) AS calculated_subtotal
FROM orders o;

-- 5. Coupon validation - active and valid
SELECT code, discount_type, discount_value, min_order_amount,
  valid_from, valid_until, is_active, uses_count, max_uses
FROM coupons WHERE is_active = 1;

-- 6. Reviews per restaurant
SELECT r.name, AVG(rev.rating) AS avg_rating, COUNT(rev.id) AS review_count
FROM restaurants r
LEFT JOIN reviews rev ON rev.restaurant_id = r.id
GROUP BY r.id;

-- 7. Order status flow
SELECT o.id, os.status, os.created_at
FROM orders o
JOIN order_status os ON os.order_id = o.id
ORDER BY o.id, os.created_at;

-- 8. Address validation - user addresses
SELECT u.email, COUNT(a.id) AS address_count
FROM users u
LEFT JOIN addresses a ON a.user_id = u.id
GROUP BY u.id;
