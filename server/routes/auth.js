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
  req.session.user = { id: user.id, username: user.username, role: user.role };
  res.redirect('/home/home.html');
});

// Handle sign up
router.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.send('All fields required');
  const existing = await findUserByUsername(username);
  if (existing) return res.send('Username already taken');
  const hash = await bcrypt.hash(password, 10);
  await createUser({ username, password: hash, role: role || 'user' });
  // Auto-login after signup
  const user = await findUserByUsername(username);
  req.session.user = { id: user.id, username: user.username, role: user.role };
  res.redirect('/home/home.html');
});

// Handle logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

export default router;
