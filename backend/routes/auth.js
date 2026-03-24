import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
};

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').trim().notEmpty().withMessage('First name required'),
    body('lastName').trim().notEmpty().withMessage('Last name required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password, firstName, lastName, phone } = req.body;

      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        'INSERT INTO users (email, password_hash, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)',
        [email, passwordHash, firstName, lastName, phone || null]
      );

      const [users] = await pool.query('SELECT id, email, first_name, last_name, role FROM users WHERE id = ?', [result.insertId]);
      const u = users[0];
      const user = {
        id: u.id,
        email: u.email,
        firstName: u.first_name,
        lastName: u.last_name,
        role: u.role,
      };
      const token = generateToken(u);
      res.status(201).json({ user, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;

      const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = users[0];
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateToken(user);
      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

export default router;
