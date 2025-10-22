import express from 'express';
import pool from '../models/db.js';

const router = express.Router();

// Submit a report
router.post('/api/report', async (req, res) => {
  try {
    const { firstName, lastName, reportDate, subject, message } = req.body;
    
    // Validate input
    if (!firstName || !lastName || !reportDate || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (firstName.length < 2 || lastName.length < 2) {
      return res.status(400).json({ error: 'Names must be at least 2 characters long' });
    }
    
    if (subject.length < 3 || subject.length > 100) {
      return res.status(400).json({ error: 'Subject must be between 3 and 100 characters' });
    }
    
    if (message.length < 20 || message.length > 500) {
      return res.status(400).json({ error: 'Message must be between 20 and 500 characters' });
    }

    // Create a comprehensive reason combining all form data
    const comprehensiveReason = JSON.stringify({
      reporterFirstName: firstName.trim(),
      reporterLastName: lastName.trim(),
      incidentDate: reportDate,
      subject: subject.trim(),
      description: message.trim(),
      submittedAt: new Date().toISOString()
    });

    // Insert report into database (using schema columns)
    await pool.query(
      'INSERT INTO reports (user_id, product_id, reason) VALUES (?, ?, ?)', 
      [null, null, comprehensiveReason] // Using null for user_id and product_id since no auth system
    );
    
    res.status(200).json({ message: 'Report submitted successfully' });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'There was an error submitting your report. Please try again.' });
  }
});

// Get all reports (optional - for admin viewing)
router.get('/api/reports', async (req, res) => {
  try {
    const [reports] = await pool.query(
      'SELECT id, reason, created_at FROM reports ORDER BY created_at DESC LIMIT 100'
    );
    
    // Parse the JSON reason to make it more readable
    const formattedReports = reports.map(report => {
      try {
        const reasonData = JSON.parse(report.reason);
        return {
          id: report.id,
          reporterName: `${reasonData.reporterFirstName} ${reasonData.reporterLastName}`,
          subject: reasonData.subject,
          description: reasonData.description,
          incidentDate: reasonData.incidentDate,
          submittedAt: report.created_at
        };
      } catch (e) {
        return {
          id: report.id,
          reason: report.reason,
          submittedAt: report.created_at
        };
      }
    });
    
    res.status(200).json(formattedReports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Error fetching reports' });
  }
});

export default router;
