import pool from './db.js';

export async function createProduct({ name, price, image, userId }) {
  // Auto-approve new products so users can post directly without admin approval
  const [result] = await pool.query(
    'INSERT INTO products (name, price, image, user_id, approved) VALUES (?, ?, ?, ?, 1)',
    [name, price, image, userId]
  );
  return result.insertId;
}

export async function getApprovedProducts() {
  const [rows] = await pool.query('SELECT * FROM products WHERE approved = 1');
  return rows;
}

export async function approveProduct(productId) {
  await pool.query('UPDATE products SET approved = 1 WHERE id = ?', [productId]);
}

export async function getProductById(id) {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
}

export async function searchProducts(q) {
  const [rows] = await pool.query('SELECT * FROM products WHERE approved = 1 AND name LIKE ?', [`%${q}%`]);
  return rows;
}
