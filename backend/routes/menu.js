import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const [categories] = await pool.query(
      'SELECT * FROM menu_categories WHERE restaurant_id = ? ORDER BY display_order, name',
      [req.params.restaurantId]
    );

    const menu = [];
    for (const cat of categories) {
      const [items] = await pool.query(
        'SELECT * FROM menu_items WHERE category_id = ? ORDER BY display_order, name',
        [cat.id]
      );
      menu.push({ ...cat, items });
    }

    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

router.get('/item/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT mi.*, mc.name as category_name FROM menu_items mi JOIN menu_categories mc ON mi.category_id = mc.id WHERE mi.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

export default router;
