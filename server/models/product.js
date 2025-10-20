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
  // Join with users to include seller info (id and username)
  const [rows] = await pool.query(
    `SELECT p.*, u.id AS seller_id, u.username AS seller_username
     FROM products p
     JOIN users u ON p.user_id = u.id
     WHERE p.approved = 1`
  );
  return rows;
}


export async function getProductById(id) {
  const [rows] = await pool.query(
    `SELECT p.*, u.id AS seller_id, u.username AS seller_username
     FROM products p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0];
}

export async function searchProducts(q) {
  const [rows] = await pool.query(
    `SELECT p.*, u.id AS seller_id, u.username AS seller_username
     FROM products p
     JOIN users u ON p.user_id = u.id
     WHERE p.approved = 1 AND p.name LIKE ?`,
    [`%${q}%`]
  );
  return rows;
}
