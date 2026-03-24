-- Capstone Food Ordering - MySQL Schema
-- Run with MySQL 8.0+

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `order_status`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `cart`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `menu_items`;
DROP TABLE IF EXISTS `menu_categories`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `restaurants`;
DROP TABLE IF EXISTS `users`;

-- -----------------------------------------------------
-- Table: users
-- -----------------------------------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'admin', 'delivery') NOT NULL DEFAULT 'customer',
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `ix_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: addresses
-- -----------------------------------------------------
CREATE TABLE `addresses` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `label` VARCHAR(50) NOT NULL DEFAULT 'Home',
  `street` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(50) NULL,
  `postal_code` VARCHAR(20) NOT NULL,
  `country` VARCHAR(50) NOT NULL DEFAULT 'USA',
  `is_default` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_addresses_user_id` (`user_id`),
  CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: restaurants
-- -----------------------------------------------------
CREATE TABLE `restaurants` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `address` VARCHAR(255) NULL,
  `city` VARCHAR(100) NULL,
  `phone` VARCHAR(20) NULL,
  `image_url` VARCHAR(500) NULL,
  `cuisine` VARCHAR(100) NULL,
  `rating` DECIMAL(2,1) DEFAULT 0,
  `delivery_time_mins` INT DEFAULT 30,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_restaurants_slug` (`slug`),
  KEY `ix_restaurants_is_active` (`is_active`),
  KEY `ix_restaurants_cuisine` (`cuisine`),
  KEY `ix_restaurants_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: menu_categories
-- -----------------------------------------------------
CREATE TABLE `menu_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `restaurant_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_menu_categories_restaurant_id` (`restaurant_id`),
  CONSTRAINT `fk_menu_categories_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: menu_items
-- -----------------------------------------------------
CREATE TABLE `menu_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `image_url` VARCHAR(500) NULL,
  `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  `dietary_info` VARCHAR(255) NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_menu_items_category_id` (`category_id`),
  KEY `ix_menu_items_is_available` (`is_available`),
  CONSTRAINT `fk_menu_items_category` FOREIGN KEY (`category_id`) REFERENCES `menu_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: coupons
-- -----------------------------------------------------
CREATE TABLE `coupons` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `discount_type` ENUM('percentage', 'fixed') NOT NULL,
  `discount_value` DECIMAL(10,2) NOT NULL,
  `min_order_amount` DECIMAL(10,2) NULL,
  `max_uses` INT UNSIGNED NULL,
  `uses_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `valid_from` DATETIME NULL,
  `valid_until` DATETIME NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_coupons_code` (`code`),
  KEY `ix_coupons_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: cart
-- -----------------------------------------------------
CREATE TABLE `cart` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `restaurant_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cart_user_id` (`user_id`),
  KEY `ix_cart_restaurant_id` (`restaurant_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: cart_items
-- -----------------------------------------------------
CREATE TABLE `cart_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cart_id` INT UNSIGNED NOT NULL,
  `menu_item_id` INT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `notes` VARCHAR(500) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cart_items_cart_menu` (`cart_id`, `menu_item_id`),
  KEY `ix_cart_items_menu_item_id` (`menu_item_id`),
  CONSTRAINT `fk_cart_items_cart` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_items_menu_item` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: orders
-- -----------------------------------------------------
CREATE TABLE `orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `restaurant_id` INT UNSIGNED NOT NULL,
  `address_id` INT UNSIGNED NOT NULL,
  `coupon_id` INT UNSIGNED NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `discount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `delivery_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `tax` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(10,2) NOT NULL,
  `notes` TEXT NULL,
  `estimated_delivery_at` DATETIME NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_orders_user_id` (`user_id`),
  KEY `ix_orders_restaurant_id` (`restaurant_id`),
  KEY `ix_orders_created_at` (`created_at`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_orders_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`),
  CONSTRAINT `fk_orders_address` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `fk_orders_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: order_items
-- -----------------------------------------------------
CREATE TABLE `order_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT UNSIGNED NOT NULL,
  `menu_item_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `notes` VARCHAR(500) NULL,
  PRIMARY KEY (`id`),
  KEY `ix_order_items_order_id` (`order_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_menu_item` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: order_status
-- -----------------------------------------------------
CREATE TABLE `order_status` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT UNSIGNED NOT NULL,
  `status` ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') NOT NULL,
  `notes` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_order_status_order_id` (`order_id`),
  CONSTRAINT `fk_order_status_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: reviews
-- -----------------------------------------------------
CREATE TABLE `reviews` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `restaurant_id` INT UNSIGNED NOT NULL,
  `order_id` INT UNSIGNED NULL,
  `rating` TINYINT UNSIGNED NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `comment` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_reviews_user_restaurant_order` (`user_id`, `restaurant_id`, `order_id`),
  KEY `ix_reviews_restaurant_id` (`restaurant_id`),
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
