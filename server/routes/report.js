import express from 'express';
import pool from '../models/db.js';

const router = express.Router();

// Submit a report
router.post('/api/report', async (req, res) => {
  const { firstName, lastName, reportDate, subject, message } = req.body;
  await pool.query(
    'INSERT INTO reports (first_name, last_name, report_date, subject, message) VALUES (?, ?, ?, ?, ?)',
    [firstName, lastName, reportDate, subject, message]
  );
  res.sendStatus(200);
});

export default router;
