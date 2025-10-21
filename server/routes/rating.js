import express from 'express';
import pool from '../models/db.js';

const router = express.Router();

// Submit a rating
router.post('/api/rating', async (req, res) => {
  const { rating, review } = req.body;

  await pool.query('INSERT INTO ratings (rating, review) VALUES (?, ?)', [rating, review]);
  res.sendStatus(200);
});

export default router;
