import pool from './db.js';

export async function createProduct({ name, price, image, userId, categoryId }) {
  // Auto-approve new products so users can post directly without admin approval
  const [result] = await pool.query(
    'INSERT INTO products (name, price, image, user_id, category_id, approved) VALUES (?, ?, ?, ?, ?, 1)',
    [name, price, image, userId, categoryId]
  );
  return result.insertId;
}

export async function getApprovedProducts(limit = null, offset = 0) {
  // Join with users and categories to include seller info and category name
  let query = `SELECT p.*, u.id AS seller_id, u.username AS seller_username, c.name AS category_name
     FROM products p
     JOIN users u ON p.user_id = u.id
     JOIN categories c ON p.category_id = c.id
     WHERE p.approved = 1
     ORDER BY p.id DESC`;
  
  const params = [];
  if (limit) {
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
  }
  
  const [rows] = await pool.query(query, params);
  return rows;
}

export async function getApprovedProductsCount() {
  const [rows] = await pool.query(
    'SELECT COUNT(*) as total FROM products WHERE approved = 1'
  );
  return rows[0].total;
}


export async function getProductById(id) {
  const [rows] = await pool.query(
    `SELECT p.*, u.id AS seller_id, u.username AS seller_username, c.name AS category_name
     FROM products p
     JOIN users u ON p.user_id = u.id
     JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0];
}

export async function searchProducts(q, categoryId, limit = null, offset = 0) {
  let query = `SELECT p.*, u.id AS seller_id, u.username AS seller_username, c.name AS category_name
               FROM products p
               JOIN users u ON p.user_id = u.id
               JOIN categories c ON p.category_id = c.id
               WHERE p.approved = 1`;
  const params = [];
  if (q) {
    query += ' AND p.name LIKE ?';
    params.push(`%${q}%`);
  }
  if (categoryId) {
    query += ' AND p.category_id = ?';
    params.push(categoryId);
  }
  
  query += ' ORDER BY p.id DESC';
  
  if (limit) {
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
  }
  
  const [rows] = await pool.query(query, params);
  return rows;
}

export async function searchProductsCount(q, categoryId) {
  let query = `SELECT COUNT(*) as total FROM products p WHERE p.approved = 1`;
  const params = [];
  if (q) {
    query += ' AND p.name LIKE ?';
    params.push(`%${q}%`);
  }
  if (categoryId) {
    query += ' AND p.category_id = ?';
    params.push(categoryId);
  }
  const [rows] = await pool.query(query, params);
  return rows[0].total;
}

// Get all categories
export async function getCategories() {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
  return rows;
}
