const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

// @POST /api/auth/register
router.post(
  '/register',
  [
    body('fullName').notEmpty().trim().withMessage('Full name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('username').isLength({ min: 3, max: 20 }).withMessage('Username 3-20 chars'),
    body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
    body('role').isIn(['candidate', 'recruiter']).withMessage('Role must be candidate or recruiter'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { fullName, email, username, password, role } = req.body;
    try {
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        const field = existingUser.email === email ? 'Email' : 'Username';
        return res.status(400).json({ message: `${field} already exists` });
      }

      const user = await User.create({ fullName, email, username, password, role });
      const token = generateToken(user._id);
      res.status(201).json({ token, user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// @POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id);
      res.json({ token, user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// @GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// Seed admin (run once)
router.post('/seed-admin', async (req, res) => {
  try {
    const existing = await User.findOne({ role: 'admin' });
    if (existing) return res.json({ message: 'Admin already exists', email: existing.email });
    const admin = await User.create({
      fullName: 'Admin',
      email: 'admin@jobportal.com',
      username: 'admin',
      password: 'Admin@1234',
      role: 'admin',
      isVerified: true,
    });
    res.json({ message: 'Admin created', email: admin.email, password: 'Admin@1234' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
