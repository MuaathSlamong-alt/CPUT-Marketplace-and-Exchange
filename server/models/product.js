import pool from './db.js';

export async function createProduct({ name, price, image, userId }) {
  const [result] = await pool.query(
    'INSERT INTO products (name, price, image, user_id, approved) VALUES (?, ?, ?, ?, 0)',
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
