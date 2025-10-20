import pool from './db.js';

export async function createMessage({ fromUserId, toUserId, content }) {
  // Insert message with timestamp
  const [result] = await pool.query(
    'INSERT INTO messages (from_user_id, to_user_id, content, created_at) VALUES (?, ?, ?, NOW())',
    [fromUserId, toUserId, content]
  );
  return result.insertId;
}

export async function getMessagesBetweenUsers(userA, userB) {
  // Include sender and recipient usernames and timestamp
  const [rows] = await pool.query(
    `SELECT m.id, m.from_user_id, m.to_user_id, m.content, m.created_at,
            fu.username AS from_username, tu.username AS to_username
     FROM messages m
     JOIN users fu ON m.from_user_id = fu.id
     JOIN users tu ON m.to_user_id = tu.id
     WHERE (m.from_user_id = ? AND m.to_user_id = ?) OR (m.from_user_id = ? AND m.to_user_id = ?)
     ORDER BY m.id ASC`,
    [userA, userB, userB, userA]
  );
  return rows;
}
