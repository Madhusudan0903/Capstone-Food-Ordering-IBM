import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

const DELIVERY_FEE = 3.0;
const TAX_RATE = 0.09;

const mockProcessPayment = ({ method, amount, cardNumber, cardHolderName, expiry, cvv, upiId }) => {
  if (!method) {
    return { ok: false, error: 'Payment method is required' };
  }
  if (amount <= 0) {
    return { ok: false, error: 'Invalid payment amount' };
  }

  if (method === 'cod') {
    return {
      ok: true,
      paymentStatus: 'pending_cod',
      transactionId: `COD-${Date.now()}`,
      message: 'Cash on Delivery selected',
      maskedSource: 'COD',
    };
  }

  if (method === 'upi') {
    if (!upiId || !upiId.includes('@')) {
      return { ok: false, error: 'Invalid UPI ID' };
    }
    return {
      ok: true,
      paymentStatus: 'paid',
      transactionId: `UPI-${Date.now()}`,
      message: 'Mock UPI payment successful',
      maskedSource: upiId,
    };
  }

  if (method === 'wallet') {
    return {
      ok: true,
      paymentStatus: 'paid',
      transactionId: `WALLET-${Date.now()}`,
      message: 'Mock wallet payment successful',
      maskedSource: 'Wallet',
    };
  }

  if (method === 'card') {
    if (!cardHolderName || !cardNumber || !expiry || !cvv) {
      return { ok: false, error: 'Card details are required for card payment' };
    }
    const digits = String(cardNumber).replace(/\D/g, '');
    if (digits.length < 12 || digits.length > 19) {
      return { ok: false, error: 'Invalid card number' };
    }
    if (!/^\d{3,4}$/.test(String(cvv))) {
      return { ok: false, error: 'Invalid CVV' };
    }
    if (String(cvv) === '000' || digits.endsWith('0000')) {
      return { ok: false, error: 'Mock gateway declined this card' };
    }
    return {
      ok: true,
      paymentStatus: 'paid',
      transactionId: `CARD-${Date.now()}`,
      message: 'Mock card payment authorized',
      maskedSource: `**** **** **** ${digits.slice(-4)}`,
    };
  }

  return { ok: false, error: 'Unsupported payment method' };
};

const applyCoupon = async (code, subtotal) => {
  const [rows] = await pool.query(
    `SELECT * FROM coupons WHERE code = ? AND is_active = 1
     AND (valid_from IS NULL OR valid_from <= NOW())
     AND (valid_until IS NULL OR valid_until >= NOW())
     AND (max_uses IS NULL OR uses_count < max_uses)`,
    [code]
  );
  if (rows.length === 0) return null;
  const c = rows[0];
  if (c.min_order_amount && subtotal < parseFloat(c.min_order_amount)) {
    return { error: `Minimum order of $${c.min_order_amount} required` };
  }
  let discount = 0;
  if (c.discount_type === 'percentage') {
    discount = subtotal * (parseFloat(c.discount_value) / 100);
  } else {
    discount = Math.min(parseFloat(c.discount_value), subtotal);
  }
  return { coupon: c, discount };
};

router.post('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const userId = req.user.id;
    const { addressId, couponCode, notes, payment } = req.body;

    if (!addressId) {
      await conn.rollback();
      return res.status(400).json({ error: 'Address is required' });
    }

    const [addr] = await conn.query('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [addressId, userId]);
    if (addr.length === 0) {
      await conn.rollback();
      return res.status(400).json({ error: 'Invalid address' });
    }

    const [carts] = await conn.query(
      'SELECT c.* FROM cart c WHERE c.user_id = ? AND c.restaurant_id IS NOT NULL',
      [userId]
    );
    if (carts.length === 0) {
      await conn.rollback();
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const [cartItems] = await conn.query(
      `SELECT ci.*, mi.name, mi.price, mi.is_available
       FROM cart_items ci JOIN menu_items mi ON ci.menu_item_id = mi.id
       WHERE ci.cart_id = ?`,
      [carts[0].id]
    );

    if (cartItems.length === 0) {
      await conn.rollback();
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const unavailable = cartItems.filter(i => !i.is_available);
    if (unavailable.length > 0) {
      await conn.rollback();
      return res.status(400).json({ error: `Item(s) no longer available: ${unavailable.map(u => u.name).join(', ')}` });
    }

    let subtotal = 0;
    for (const item of cartItems) {
      subtotal += parseFloat(item.price) * item.quantity;
    }

    let discount = 0;
    let couponId = null;
    if (couponCode) {
      const result = await applyCoupon(couponCode, subtotal);
      if (result && result.error) {
        await conn.rollback();
        return res.status(400).json({ error: result.error });
      }
      if (result && result.coupon) {
        discount = result.discount;
        couponId = result.coupon.id;
      }
    }

    const deliveryFee = DELIVERY_FEE;
    const taxBase = subtotal - discount + deliveryFee;
    const tax = Math.round(taxBase * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal - discount + deliveryFee + tax) * 100) / 100;

    const paymentResult = mockProcessPayment({
      method: payment?.method,
      amount: total,
      cardNumber: payment?.cardNumber,
      cardHolderName: payment?.cardHolderName,
      expiry: payment?.expiry,
      cvv: payment?.cvv,
      upiId: payment?.upiId,
    });
    if (!paymentResult.ok) {
      await conn.rollback();
      return res.status(400).json({ error: paymentResult.error });
    }

    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, restaurant_id, address_id, coupon_id, subtotal, discount, delivery_fee, tax, total, notes, estimated_delivery_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 40 MINUTE))`,
      [
        userId,
        carts[0].restaurant_id,
        addressId,
        couponId,
        subtotal,
        discount,
        deliveryFee,
        tax,
        total,
        notes || `Mock payment ${paymentResult.paymentStatus}: ${paymentResult.maskedSource} (${paymentResult.transactionId})`,
      ]
    );
    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      await conn.query(
        'INSERT INTO order_items (order_id, menu_item_id, name, price, quantity, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.menu_item_id, item.name, item.price, item.quantity, item.notes]
      );
    }

    await conn.query('INSERT INTO order_status (order_id, status) VALUES (?, ?)', [orderId, 'pending']);
    await conn.query('DELETE FROM cart_items WHERE cart_id = ?', [carts[0].id]);
    await conn.query('UPDATE cart SET restaurant_id = NULL WHERE id = ?', [carts[0].id]);

    if (couponId) {
      await conn.query('UPDATE coupons SET uses_count = uses_count + 1 WHERE id = ?', [couponId]);
    }

    await conn.commit();

    const [orders] = await conn.query(
      'SELECT o.*, r.name as restaurant_name FROM orders o JOIN restaurants r ON o.restaurant_id = r.id WHERE o.id = ?',
      [orderId]
    );
    const [items] = await conn.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    const [statuses] = await conn.query('SELECT * FROM order_status WHERE order_id = ? ORDER BY created_at', [orderId]);

    res.status(201).json({
      order: { ...orders[0], items, statuses },
      payment: paymentResult,
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Order failed' });
  } finally {
    conn.release();
  }
});

router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, r.name as restaurant_name FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       WHERE o.user_id = ? ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, r.name as restaurant_name, a.street, a.city, a.state, a.postal_code
       FROM orders o JOIN restaurants r ON o.restaurant_id = r.id
       JOIN addresses a ON o.address_id = a.id
       WHERE o.id = ? AND o.user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
    const [statuses] = await pool.query('SELECT * FROM order_status WHERE order_id = ? ORDER BY created_at', [req.params.id]);
    res.json({ ...orders[0], items, statuses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

export default router;
