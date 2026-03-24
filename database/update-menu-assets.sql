-- Run once if your DB was seeded before menu image updates.
-- This backfills missing menu images and adds a second Taco Fiesta drink.

UPDATE menu_items
SET image_url = CASE name
  WHEN 'Soda' THEN 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300'
  WHEN 'Lemonade' THEN 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=300'
  WHEN 'BBQ Bacon Burger' THEN 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300'
  WHEN 'Onion Rings' THEN 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=300'
  WHEN 'Milkshake' THEN 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300'
  WHEN 'Spicy Tuna Roll' THEN 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300'
  WHEN 'Salmon Nigiri' THEN 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300'
  WHEN 'Miso Soup' THEN 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300'
  WHEN 'Beef Tacos' THEN 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=300'
  WHEN 'Chicken Tacos' THEN 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=300'
  WHEN 'Bean Burrito' THEN 'https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=300'
  WHEN 'Horchata' THEN 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300'
  ELSE image_url
END
WHERE name IN (
  'Soda',
  'Lemonade',
  'BBQ Bacon Burger',
  'Onion Rings',
  'Milkshake',
  'Spicy Tuna Roll',
  'Salmon Nigiri',
  'Miso Soup',
  'Beef Tacos',
  'Chicken Tacos',
  'Bean Burrito',
  'Horchata'
);

INSERT INTO menu_items (category_id, name, description, price, image_url, is_available, dietary_info, display_order)
SELECT 12, 'Agua Fresca', 'Chilled fruit infused drink', 3.29, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300', 1, 'Vegan', 2
WHERE NOT EXISTS (
  SELECT 1 FROM menu_items WHERE category_id = 12 AND name = 'Agua Fresca'
);
