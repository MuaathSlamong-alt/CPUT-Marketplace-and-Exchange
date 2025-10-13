import express from 'express';
import pool from '../models/db.js';
import { approveProduct } from '../models/product.js';

const router = express.Router();

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') return res.status(403).send('Forbidden');
  next();
}

// Get all pending products
router.get('/admin/pending-products', requireAdmin, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE approved = 0');
  res.json(rows);
});

// Approve a product
router.post('/admin/approve/:id', requireAdmin, async (req, res) => {
  await approveProduct(req.params.id);
  res.send('Product approved');
});

export default router;
