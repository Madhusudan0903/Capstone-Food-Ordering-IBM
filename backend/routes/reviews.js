import express from 'express';
import pool from '../config/db.js';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, u.first_name, u.last_name FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.restaurant_id = ? ORDER BY r.created_at DESC`,
      [req.params.restaurantId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.post('/',
  [
    body('restaurantId').isInt(),
    body('orderId').optional({ nullable: true }).isInt(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().trim(),
  ],
  authenticate,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { restaurantId, orderId, rating, comment } = req.body;
      const userId = req.user.id;

      const [restaurants] = await pool.query('SELECT id FROM restaurants WHERE id = ? AND is_active = 1', [restaurantId]);
      if (restaurants.length === 0) {
        return res.status(404).json({ error: 'Restaurant not found' });
      }

      if (orderId) {
        const [orders] = await pool.query('SELECT id FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);
        if (orders.length === 0) {
          return res.status(400).json({ error: 'Order not found or does not belong to you' });
        }
      }

      const [existing] = await pool.query(
        'SELECT id FROM reviews WHERE user_id = ? AND restaurant_id = ? AND (order_id = ? OR (? IS NULL AND order_id IS NULL))',
        [userId, restaurantId, orderId || null, orderId]
      );
      if (existing.length > 0) {
        return res.status(400).json({ error: 'You have already reviewed this order' });
      }

      const [result] = await pool.query(
        'INSERT INTO reviews (user_id, restaurant_id, order_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
        [userId, restaurantId, orderId || null, rating, comment || null]
      );

      const [rows] = await pool.query(
        'SELECT r.*, u.first_name, u.last_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.id = ?',
        [result.insertId]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add review' });
    }
  }
);

export default router;
