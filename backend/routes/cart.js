import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const [carts] = await pool.query(
      'SELECT c.*, r.name as restaurant_name FROM cart c LEFT JOIN restaurants r ON c.restaurant_id = r.id WHERE c.user_id = ?',
      [userId]
    );
    if (carts.length === 0) {
      return res.json({ cart: null, items: [] });
    }
    const cart = carts[0];
    const [items] = await pool.query(
      `SELECT ci.*, mi.name, mi.price, mi.image_url, mi.is_available
       FROM cart_items ci JOIN menu_items mi ON ci.menu_item_id = mi.id
       WHERE ci.cart_id = ?`,
      [cart.id]
    );
    res.json({ cart, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const userId = req.user.id;
    const { menuItemId, quantity = 1, notes } = req.body;

    if (!menuItemId || quantity < 1) {
      return res.status(400).json({ error: 'Invalid menu item or quantity' });
    }

    const [menuItems] = await pool.query(
      'SELECT mi.*, mc.restaurant_id FROM menu_items mi JOIN menu_categories mc ON mi.category_id = mc.id WHERE mi.id = ? AND mi.is_available = 1',
      [menuItemId]
    );
    if (menuItems.length === 0) {
      return res.status(400).json({ error: 'Menu item not found or unavailable' });
    }

    const restaurantId = menuItems[0].restaurant_id;
    let [carts] = await pool.query('SELECT * FROM cart WHERE user_id = ?', [userId]);

    if (carts.length === 0) {
      await pool.query('INSERT INTO cart (user_id, restaurant_id) VALUES (?, ?)', [userId, restaurantId]);
      [carts] = await pool.query('SELECT * FROM cart WHERE user_id = ?', [userId]);
    } else if (carts[0].restaurant_id && carts[0].restaurant_id !== restaurantId) {
      return res.status(400).json({ error: 'Cart has items from another restaurant. Clear cart first.' });
    } else if (!carts[0].restaurant_id) {
      await pool.query('UPDATE cart SET restaurant_id = ? WHERE user_id = ?', [restaurantId, userId]);
    }

    const cartId = carts[0].id;
    await pool.query(
      'INSERT INTO cart_items (cart_id, menu_item_id, quantity, notes) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?, notes = COALESCE(VALUES(notes), notes)',
      [cartId, menuItemId, quantity, notes || null, quantity]
    );

    const [items] = await pool.query(
      `SELECT ci.*, mi.name, mi.price, mi.image_url FROM cart_items ci JOIN menu_items mi ON ci.menu_item_id = mi.id WHERE ci.cart_id = ?`,
      [cartId]
    );
    res.json({ cart: carts[0], items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

router.put('/item/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { quantity, notes } = req.body;

    const [carts] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
    if (carts.length === 0) return res.status(404).json({ error: 'Cart not found' });

    if (quantity !== undefined) {
      if (quantity < 1) {
        await pool.query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [req.params.id, carts[0].id]);
      } else {
        await pool.query('UPDATE cart_items SET quantity = ?, notes = ? WHERE id = ? AND cart_id = ?',
          [quantity, notes || null, req.params.id, carts[0].id]);
      }
    }

    const [items] = await pool.query(
      `SELECT ci.*, mi.name, mi.price FROM cart_items ci JOIN menu_items mi ON ci.menu_item_id = mi.id WHERE ci.cart_id = ?`,
      [carts[0].id]
    );
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

router.delete('/item/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const [carts] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
    if (carts.length === 0) return res.status(404).json({ error: 'Cart not found' });

    await pool.query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [req.params.id, carts[0].id]);
    const [remaining] = await pool.query('SELECT COUNT(*) as c FROM cart_items WHERE cart_id = ?', [carts[0].id]);
    if (remaining[0].c === 0) {
      await pool.query('UPDATE cart SET restaurant_id = NULL WHERE id = ?', [carts[0].id]);
    }
    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

router.delete('/clear', async (req, res) => {
  try {
    const userId = req.user.id;
    const [carts] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
    if (carts.length === 0) return res.json({ message: 'Cart already empty' });

    await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [carts[0].id]);
    await pool.query('UPDATE cart SET restaurant_id = NULL WHERE id = ?', [carts[0].id]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
