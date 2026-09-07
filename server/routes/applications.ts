import { Router, Request, Response } from 'express';
import { query } from '../db';
import { requireAdminAuth } from '../auth';

const router = Router();

// PUBLIC: POST /api/job-applications and /api/jobs/apply
router.post(['/job-applications', '/jobs/apply'], async (req: Request, res: Response) => {
  try {
    const {
      job_id,
      role,
      full_name,
      email,
      phone,
      experience_years,
      location,
      portfolio_url,
      cover_letter,
      resume_text,
    } = req.body;

    if (!full_name || !email || !phone || !role) {
      res.status(400).json({ error: 'Name, email, phone, and role are required.' });
      return;
    }

    const id = 'app-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
    const now = new Date().toISOString();

    const insertRes = await query(`
      INSERT INTO job_applications (
        id, job_id, role, full_name, email, phone,
        experience_years, location, portfolio_url, cover_letter, resume_text, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      id,
      job_id || null,
      role.trim(),
      full_name.trim(),
      email.trim(),
      phone.trim(),
      experience_years ? String(experience_years) : '',
      location ? location.trim() : '',
      portfolio_url ? portfolio_url.trim() : '',
      cover_letter ? cover_letter.trim() : '',
      resume_text ? resume_text.trim() : '',
      now
    ]);

    res.status(201).json({ success: true, record: insertRes.rows[0] });
  } catch (error: any) {
    console.error('Job application error:', error);
    res.status(500).json({ error: 'Failed to submit application.' });
  }
});

// ADMIN: GET /api/admin/job-applications
router.get('/admin/job-applications', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM job_applications ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error: any) {
    console.error('Fetch job applications error:', error);
    res.status(500).json({ error: 'Failed to retrieve job applications.' });
  }
});

export default router;
