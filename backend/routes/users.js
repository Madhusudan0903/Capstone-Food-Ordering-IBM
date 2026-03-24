import express from 'express';
import pool from '../config/db.js';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/profile', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({
      ...rows[0],
      firstName: rows[0].first_name,
      lastName: rows[0].last_name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.get('/addresses', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

router.post('/addresses',
  [
    body('label').trim().notEmpty(),
    body('street').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('postalCode').trim().notEmpty(),
    body('country').optional().trim(),
    body('state').optional().trim(),
    body('isDefault').optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { label, street, city, state, postalCode, country = 'USA', isDefault = false } = req.body;

      if (isDefault) {
        await pool.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
      }

      const [result] = await pool.query(
        'INSERT INTO addresses (user_id, label, street, city, state, postal_code, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user.id, label, street, city, state || null, postalCode, country, isDefault ? 1 : 0]
      );
      const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ?', [result.insertId]);
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add address' });
    }
  }
);

router.put('/addresses/:id',
  [
    body('label').optional().trim().notEmpty(),
    body('street').optional().trim().notEmpty(),
    body('city').optional().trim().notEmpty(),
    body('postalCode').optional().trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { label, street, city, state, postalCode, country, isDefault } = req.body;

      const [existing] = await pool.query('SELECT id FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Address not found' });
      }

      const updates = [];
      const vals = [];
      if (label !== undefined) { updates.push('label = ?'); vals.push(label); }
      if (street !== undefined) { updates.push('street = ?'); vals.push(street); }
      if (city !== undefined) { updates.push('city = ?'); vals.push(city); }
      if (state !== undefined) { updates.push('state = ?'); vals.push(state); }
      if (postalCode !== undefined) { updates.push('postal_code = ?'); vals.push(postalCode); }
      if (country !== undefined) { updates.push('country = ?'); vals.push(country); }
      if (isDefault !== undefined) {
        if (isDefault) {
          await pool.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
        }
        updates.push('is_default = ?');
        vals.push(isDefault ? 1 : 0);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }
      vals.push(req.params.id, req.user.id);
      await pool.query(`UPDATE addresses SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`, vals);
      const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ?', [req.params.id]);
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update address' });
    }
  }
);

router.delete('/addresses/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.json({ message: 'Address deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

export default router;
