import express from 'express';
import { createMessage, getMessagesBetweenUsers } from '../models/message.js';

const router = express.Router();

// Check if user is logged in
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

// Get chat messages between two users
router.get('/chat/:userId', requireLogin, async (req, res) => {
  const userA = req.session.user.id;
  const userB = req.params.userId;
  const messages = await getMessagesBetweenUsers(userA, userB);
  res.json(messages);
});

// Send a chat message
router.post('/chat/:userId', requireLogin, async (req, res) => {
  const fromUserId = req.session.user.id;
  const toUserId = req.params.userId;
  const { content } = req.body;
  if (!content) return res.status(400).send('Message required');
  await createMessage({ fromUserId, toUserId, content });
  res.send('Message sent');
});

export default router;
