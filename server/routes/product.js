import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../models/db.js';
import { createProduct, getApprovedProducts, getProductById, searchProducts } from '../models/product.js';

const router = express.Router();

// ensure upload directory exists under project root (../img/uploads)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', '..', 'img', 'uploads');
try {
  fs.mkdirSync(uploadDir, { recursive: true });
} catch (e) {
  console.error('Failed to create upload directory', uploadDir, e);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}



// Show all approved products or search by query
router.get('/products', async (req, res) => {
  const q = req.query.q;
  let products;
  if (q) {
    products = await searchProducts(q);
  } else {
    products = await getApprovedProducts();
  }
  res.json(products);
});

// Product detail
router.get('/products/:id', async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).send('Not found');
  res.json(product);
});

// User submits a new product (multipart with image)
router.post('/products', requireLogin, upload.single('image'), async (req, res) => {
  const { name, price } = req.body;
  let imagePath = '';
  if (req.file) {
    // expose path relative to served static root
    imagePath = `/img/uploads/${req.file.filename}`;
  }
  if (!name || !price || !imagePath) return res.status(400).send('All fields required');

  // Sanitize price: remove currency symbols/commas and parse to float
  const cleaned = String(price).replace(/[^0-9.\-]/g, '');
  const numericPrice = parseFloat(cleaned);
  if (Number.isNaN(numericPrice)) return res.status(400).send('Invalid price');

  try {
    await createProduct({ name, price: numericPrice, image: imagePath, userId: req.session.user.id });
    // Since products are auto-approved, return success and the newly created product will appear on the home page
    res.send('Product posted');
  } catch (err) {
    console.error('Error creating product', err);
    res.status(500).send('Failed to save product');
  }
});


export default router;
