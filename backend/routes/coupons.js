import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', authenticate, async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code || subtotal === undefined) {
      return res.status(400).json({ error: 'Code and subtotal required' });
    }
    const sub = parseFloat(subtotal);
    if (isNaN(sub) || sub < 0) {
      return res.status(400).json({ error: 'Invalid subtotal' });
    }

    const [rows] = await pool.query(
      `SELECT * FROM coupons WHERE code = ? AND is_active = 1`,
      [code]
    );
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid coupon code' });
    }

    const c = rows[0];
    if (c.valid_from && new Date(c.valid_from) > new Date()) {
      return res.status(400).json({ error: 'Coupon not yet valid' });
    }
    if (c.valid_until && new Date(c.valid_until) < new Date()) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }
    if (c.max_uses !== null && c.uses_count >= c.max_uses) {
      return res.status(400).json({ error: 'Coupon limit reached' });
    }
    if (c.min_order_amount && sub < parseFloat(c.min_order_amount)) {
      return res.status(400).json({
        error: `Minimum order of $${parseFloat(c.min_order_amount)} required`,
        minOrder: parseFloat(c.min_order_amount),
      });
    }

    let discount = 0;
    if (c.discount_type === 'percentage') {
      discount = sub * (parseFloat(c.discount_value) / 100);
    } else {
      discount = Math.min(parseFloat(c.discount_value), sub);
    }

    res.json({
      valid: true,
      code: c.code,
      discount,
      discountType: c.discount_type,
      discountValue: parseFloat(c.discount_value),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Validation failed' });
  }
});

export default router;
