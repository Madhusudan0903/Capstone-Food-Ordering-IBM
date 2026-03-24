-- Capstone Food Ordering - CRUD Queries
-- Use parameterized queries in application code; ? = placeholder

-- USERS
INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?);
SELECT * FROM users WHERE id = ?;
SELECT * FROM users WHERE email = ?;
UPDATE users SET email=?, first_name=?, last_name=?, phone=? WHERE id = ?;
DELETE FROM users WHERE id = ?;

-- ADDRESSES
INSERT INTO addresses (user_id, label, street, city, state, postal_code, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC;
UPDATE addresses SET label=?, street=?, city=?, state=?, postal_code=?, country=?, is_default=? WHERE id = ? AND user_id = ?;
DELETE FROM addresses WHERE id = ? AND user_id = ?;

-- RESTAURANTS
INSERT INTO restaurants (name, slug, description, address, city, phone, image_url, cuisine, rating, delivery_time_mins, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
SELECT * FROM restaurants WHERE is_active = 1;
SELECT * FROM restaurants WHERE id = ?;
SELECT * FROM restaurants WHERE slug = ?;

-- MENU
INSERT INTO menu_items (category_id, name, description, price, image_url, is_available, dietary_info, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
SELECT mi.* FROM menu_items mi JOIN menu_categories mc ON mi.category_id = mc.id WHERE mc.restaurant_id = ? AND mi.is_available = 1;

-- CART
INSERT INTO cart (user_id, restaurant_id) VALUES (?, ?);
INSERT INTO cart_items (cart_id, menu_item_id, quantity, notes) VALUES (?, ?, ?, ?);
UPDATE cart_items SET quantity=?, notes=? WHERE id = ? AND cart_id = ?;
DELETE FROM cart_items WHERE id = ? AND cart_id = ?;

-- ORDERS
INSERT INTO orders (user_id, restaurant_id, address_id, coupon_id, subtotal, discount, delivery_fee, tax, total, notes, estimated_delivery_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
INSERT INTO order_items (order_id, menu_item_id, name, price, quantity, notes) VALUES (?, ?, ?, ?, ?, ?);
INSERT INTO order_status (order_id, status, notes) VALUES (?, ?, ?);
SELECT o.*, r.name as restaurant_name FROM orders o JOIN restaurants r ON o.restaurant_id = r.id WHERE o.user_id = ? ORDER BY o.created_at DESC;

-- REVIEWS
INSERT INTO reviews (user_id, restaurant_id, order_id, rating, comment) VALUES (?, ?, ?, ?, ?);
SELECT r.*, u.first_name, u.last_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.restaurant_id = ? ORDER BY r.created_at DESC;
