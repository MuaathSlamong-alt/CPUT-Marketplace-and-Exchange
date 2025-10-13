import pool from './db.js';

export async function createMessage({ fromUserId, toUserId, content }) {
  const [result] = await pool.query(
    'INSERT INTO messages (from_user_id, to_user_id, content) VALUES (?, ?, ?)',
    [fromUserId, toUserId, content]
  );
  return result.insertId;
}

export async function getMessagesBetweenUsers(userA, userB) {
  const [rows] = await pool.query(
    'SELECT * FROM messages WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?) ORDER BY id ASC',
    [userA, userB, userB, userA]
  );
  return rows;
}
