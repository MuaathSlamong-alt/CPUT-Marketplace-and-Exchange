import express from 'express';
import bcrypt from 'bcryptjs';
import { createUser, findUserByUsername } from '../models/user.js';

const router = express.Router();

// Render login page
router.get('/login', (req, res) => {
  res.sendFile(process.cwd() + '/login/login.html');
});

// Render sign up page
router.get('/signup', (req, res) => {
  res.sendFile(process.cwd() + '/sign-in/signIn.html');
});

// Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user) return res.send('Invalid username or password');
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send('Invalid username or password');
  req.session.user = { id: user.id, username: user.username };
  res.redirect('/home/home.html');
});

// Handle sign up
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.send('All fields required');
  const existing = await findUserByUsername(username);
  if (existing) return res.send('Username already taken');
  const hash = await bcrypt.hash(password, 10);
  // Only allow user role
  await createUser({ username, password: hash });
  // Auto-login after signup
  const user = await findUserByUsername(username);
  req.session.user = { id: user.id, username: user.username };
  res.redirect('/home/home.html');
});

// Handle logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// API: return current logged-in user (used by chat frontend)
router.get('/api/me', (req, res) => {
  if (!req.session.user) return res.status(401).json(null);
  res.json(req.session.user);
});

// API: list users for chat
router.get('/api/users', async (req, res) => {
  // Return a list of users (id, username)
  const rows = await (await import('../models/db.js')).default.query('SELECT id, username FROM users').then(r=>r[0]);
  res.json(rows);
});

export default router;
