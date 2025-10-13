import express from 'express';
import { createProduct, getApprovedProducts, approveProduct } from '../models/product.js';

const router = express.Router();

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

// Middleware to check if user is admin
function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') return res.status(403).send('Forbidden');
  next();
}


// Show all approved products or search by query
router.get('/products', async (req, res) => {
  const q = req.query.q;
  let products;
  if (q) {
    const [rows] = await req.app.locals.db.query(
      'SELECT * FROM products WHERE approved = 1 AND name LIKE ?', [`%${q}%`]
    );
    products = rows;
  } else {
    products = await getApprovedProducts();
  }
  res.json(products);
});

// User submits a new product
router.post('/products', requireLogin, async (req, res) => {
  const { name, price, image } = req.body;
  if (!name || !price || !image) return res.status(400).send('All fields required');
  await createProduct({ name, price, image, userId: req.session.user.id });
  res.send('Product submitted for approval');
});

// Admin approves a product
router.post('/products/:id/approve', requireAdmin, async (req, res) => {
  await approveProduct(req.params.id);
  res.send('Product approved');
});

export default router;
