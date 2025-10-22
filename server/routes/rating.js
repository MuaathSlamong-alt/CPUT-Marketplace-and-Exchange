import express from 'express';
import pool from '../models/db.js';

const router = express.Router();

// Submit a rating
router.post('/api/rating', async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    // Validate input
    if (!rating || !review) {
      return res.status(400).json({ error: 'Rating and review are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    if (review.length < 10) {
      return res.status(400).json({ error: 'Review must be at least 10 characters long' });
    }

    // Insert rating into database (using correct column names from schema)
    await pool.query(
      'INSERT INTO ratings (user_id, product_id, score, comment) VALUES (?, ?, ?, ?)', 
      [null, null, rating, review] // Using null for user_id and product_id since no auth system
    );
    
    res.status(200).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: 'There was an error submitting your rating. Please try again.' });
  }
});

// Get all ratings (optional - for displaying ratings)
router.get('/api/ratings', async (req, res) => {
  try {
    const [ratings] = await pool.query(
      'SELECT score, comment, created_at FROM ratings ORDER BY created_at DESC LIMIT 50'
    );
    
    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Error fetching ratings' });
  }
});

export default router;
