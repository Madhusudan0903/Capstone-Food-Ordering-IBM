-- Capstone Food Ordering - Seed Data
-- Run after schema.sql
-- Password for all users: password123 (bcrypt $2a$, 10 rounds)

SET NAMES utf8mb4;

INSERT INTO `users` (`email`, `password_hash`, `role`, `first_name`, `last_name`, `phone`) VALUES
('john@example.com', '$2a$10$KCaKdmMGUJgg45ughU7DO.z72/S4O.os9s2.ZHOAtgPbxmPWtCyzi', 'customer', 'John', 'Doe', '555-0101'),
('jane@example.com', '$2a$10$KCaKdmMGUJgg45ughU7DO.z72/S4O.os9s2.ZHOAtgPbxmPWtCyzi', 'customer', 'Jane', 'Smith', '555-0102'),
('admin@restaurant.com', '$2a$10$KCaKdmMGUJgg45ughU7DO.z72/S4O.os9s2.ZHOAtgPbxmPWtCyzi', 'admin', 'Admin', 'User', '555-0100'),
('driver@delivery.com', '$2a$10$KCaKdmMGUJgg45ughU7DO.z72/S4O.os9s2.ZHOAtgPbxmPWtCyzi', 'delivery', 'Mike', 'Driver', '555-0103');

INSERT INTO `addresses` (`user_id`, `label`, `street`, `city`, `state`, `postal_code`, `country`, `is_default`) VALUES
(1, 'Home', '123 Main St', 'New York', 'NY', '10001', 'USA', 1),
(1, 'Work', '456 Office Ave', 'New York', 'NY', '10002', 'USA', 0),
(2, 'Home', '789 Oak Rd', 'Brooklyn', 'NY', '11201', 'USA', 1);

INSERT INTO `restaurants` (`name`, `slug`, `description`, `address`, `city`, `phone`, `image_url`, `cuisine`, `rating`, `delivery_time_mins`, `is_active`) VALUES
('Pizza Palace', 'pizza-palace', 'Best pizzas in town with wood-fired ovens', '100 Pizza Lane', 'New York', '555-1001', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 'Italian', 4.5, 25, 1),
('Burger Barn', 'burger-barn', 'Gourmet burgers and sides', '200 Burger Blvd', 'New York', '555-1002', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 'American', 4.2, 30, 1),
('Sushi House', 'sushi-house', 'Fresh sushi and Japanese cuisine', '300 Fish St', 'Brooklyn', '555-1003', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', 'Japanese', 4.8, 35, 1),
('Taco Fiesta', 'taco-fiesta', 'Authentic Mexican street food', '400 Taco Way', 'New York', '555-1004', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', 'Mexican', 4.0, 20, 1);

INSERT INTO `menu_categories` (`restaurant_id`, `name`, `display_order`) VALUES
(1, 'Pizzas', 1), (1, 'Sides', 2), (1, 'Drinks', 3),
(2, 'Burgers', 1), (2, 'Sides', 2), (2, 'Drinks', 3),
(3, 'Rolls', 1), (3, 'Nigiri', 2), (3, 'Soups', 3), (3, 'Drinks', 4),
(4, 'Tacos', 1), (4, 'Burritos', 2), (4, 'Drinks', 3);

INSERT INTO `menu_items` (`category_id`, `name`, `description`, `price`, `image_url`, `is_available`, `dietary_info`, `display_order`) VALUES
(1, 'Margherita', 'Classic tomato, mozzarella, basil', 12.99, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300', 1, 'Vegetarian', 1),
(1, 'Pepperoni', 'Pepperoni, tomato, mozzarella', 14.99, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300', 1, NULL, 2),
(1, 'Veggie Supreme', 'Bell peppers, onions, mushrooms, olives', 13.99, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300', 1, 'Vegetarian', 3),
(2, 'Garlic Bread', 'Toasted with garlic butter', 5.99, 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=300', 1, 'Vegetarian', 1),
(2, 'Caesar Salad', 'Romaine, parmesan, croutons', 7.99, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300', 1, 'Vegetarian', 2),
(3, 'Soda', 'Coke, Pepsi, or Sprite', 2.49, 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300', 1, NULL, 1),
(3, 'Lemonade', 'Fresh squeezed', 3.49, 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=300', 1, 'Vegan', 2),
(4, 'Classic Cheeseburger', 'Beef patty, cheese, lettuce, tomato', 11.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', 1, NULL, 1),
(4, 'BBQ Bacon Burger', 'Beef, bacon, BBQ sauce, onion rings', 14.99, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300', 1, NULL, 2),
(5, 'Onion Rings', 'Beer-battered onion rings', 4.99, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=300', 1, 'Vegetarian', 1),
(6, 'Milkshake', 'Chocolate, vanilla, or strawberry', 4.99, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300', 1, 'Vegetarian', 1),
(7, 'California Roll', 'Crab, avocado, cucumber', 8.99, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300', 1, NULL, 1),
(7, 'Spicy Tuna Roll', 'Tuna, spicy mayo', 10.99, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300', 1, NULL, 2),
(8, 'Salmon Nigiri', '2 pieces', 6.99, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300', 1, NULL, 1),
(9, 'Miso Soup', 'Traditional miso with tofu', 3.99, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300', 1, 'Vegetarian', 1),
(10, 'Beef Tacos', 'Seasoned beef, lettuce, cheese, salsa', 9.99, 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=300', 1, NULL, 1),
(10, 'Chicken Tacos', 'Grilled chicken, lime, cilantro', 8.99, 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=300', 1, NULL, 2),
(11, 'Bean Burrito', 'Refried beans, rice, cheese', 7.99, 'https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=300', 1, 'Vegetarian', 1),
(12, 'Horchata', 'Rice milk, cinnamon', 2.99, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300', 1, 'Vegan', 1),
(12, 'Agua Fresca', 'Chilled fruit infused drink', 3.29, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300', 1, 'Vegan', 2);

INSERT INTO `coupons` (`code`, `discount_type`, `discount_value`, `min_order_amount`, `max_uses`, `valid_from`, `valid_until`, `is_active`) VALUES
('WELCOME10', 'percentage', 10.00, 15.00, 100, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1),
('SAVE5', 'fixed', 5.00, 25.00, NULL, NULL, NULL, 1),
('FLAT20', 'percentage', 20.00, 50.00, 50, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 1),
('EXPIRED', 'percentage', 15.00, 10.00, 10, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 1),
('INACTIVE', 'fixed', 3.00, 20.00, NULL, NULL, NULL, 0),
('MIN50', 'percentage', 25.00, 50.00, 5, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 1);
