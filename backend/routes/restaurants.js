import express from 'express';
import pool from '../config/db.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { cuisine, minRating, maxPrice, search } = req.query;
    let sql = `
      SELECT r.*, 
        COALESCE((SELECT AVG(rev.rating) FROM reviews rev WHERE rev.restaurant_id = r.id), 0) as avg_rating,
        COALESCE((SELECT COUNT(*) FROM reviews rev WHERE rev.restaurant_id = r.id), 0) as review_count
      FROM restaurants r
      WHERE r.is_active = 1
    `;
    const params = [];

    if (cuisine) {
      sql += ' AND r.cuisine = ?';
      params.push(cuisine);
    }
    if (minRating) {
      sql += ' HAVING avg_rating >= ?';
      params.push(parseFloat(minRating));
    }
    if (search) {
      sql = sql.replace('WHERE r.is_active = 1', 'WHERE r.is_active = 1 AND (r.name LIKE ? OR r.cuisine LIKE ?)');
      params.unshift(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY avg_rating DESC';
    const [rows] = await pool.query(sql, params);

    let result = rows;
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      const filtered = [];
      for (const r of result) {
        const [items] = await pool.query(
          'SELECT MIN(price) as min_price FROM menu_items mi JOIN menu_categories mc ON mi.category_id = mc.id WHERE mc.restaurant_id = ? AND mi.is_available = 1',
          [r.id]
        );
        const minPrice = items[0]?.min_price || 0;
        if (minPrice <= max) filtered.push(r);
      }
      result = filtered;
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, 
        COALESCE((SELECT AVG(rating) FROM reviews WHERE restaurant_id = r.id), 0) as avg_rating,
        (SELECT COUNT(*) FROM reviews WHERE restaurant_id = r.id) as review_count
      FROM restaurants r WHERE r.id = ? AND r.is_active = 1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});

export default router;
