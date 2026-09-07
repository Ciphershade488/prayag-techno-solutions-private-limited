import { Router, Request, Response } from 'express';
import { query } from '../db';
import { requireAdminAuth } from '../auth';

const router = Router();

// PUBLIC: GET /api/jobs
// Returns active/published jobs for public careers page
router.get('/jobs', async (_req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT * FROM jobs
      WHERE status = 'active'
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error: any) {
    console.error('Fetch public jobs error:', error);
    res.status(500).json({ error: 'Failed to retrieve jobs.' });
  }
});

// PUBLIC: GET /api/jobs/:id
router.get('/jobs/:id', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    const job = result.rows[0];
    if (!job) {
      res.status(404).json({ error: 'Job opening not found.' });
      return;
    }
    res.json(job);
  } catch (error: any) {
    console.error('Fetch job by id error:', error);
    res.status(500).json({ error: 'Failed to retrieve job opening.' });
  }
});

// ADMIN: GET /api/admin/jobs
// Returns all jobs (active and closed)
router.get('/admin/jobs', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT * FROM jobs
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error: any) {
    console.error('Fetch admin jobs error:', error);
    res.status(500).json({ error: 'Failed to retrieve jobs list.' });
  }
});

// ADMIN: GET /api/admin/jobs/:id
router.get('/admin/jobs/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    const job = result.rows[0];
    if (!job) {
      res.status(404).json({ error: 'Job opening not found.' });
      return;
    }
    res.json(job);
  } catch (error: any) {
    console.error('Fetch admin job detail error:', error);
    res.status(500).json({ error: 'Failed to retrieve job details.' });
  }
});

// ADMIN: POST /api/admin/jobs
// Add new job
router.post('/admin/jobs', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const {
      title,
      department,
      location,
      employment_type,
      experience,
      salary,
      description,
      responsibilities,
      requirements,
      skills,
      application_email,
      application_link,
      status,
    } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ error: 'Job title is required.' });
      return;
    }
    if (!department || !department.trim()) {
      res.status(400).json({ error: 'Department is required.' });
      return;
    }
    if (!location || !location.trim()) {
      res.status(400).json({ error: 'Location is required.' });
      return;
    }
    if (!description || !description.trim()) {
      res.status(400).json({ error: 'Job description is required.' });
      return;
    }

    const id = 'job-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
    const now = new Date().toISOString();
    const jobStatus = status === 'closed' ? 'closed' : 'active';

    const insertRes = await query(`
      INSERT INTO jobs (
        id, title, department, location, employment_type, experience, salary,
        description, responsibilities, requirements, skills, application_email,
        application_link, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `, [
      id,
      title.trim(),
      department.trim(),
      location.trim(),
      employment_type ? employment_type.trim() : 'Full-time',
      experience ? experience.trim() : '1-3 years',
      salary ? salary.trim() : null,
      description.trim(),
      responsibilities ? responsibilities.trim() : '',
      requirements ? requirements.trim() : '',
      skills ? skills.trim() : '',
      application_email ? application_email.trim() : 'pts.info@mail.com',
      application_link ? application_link.trim() : '',
      jobStatus,
      now,
      now
    ]);

    res.status(201).json(insertRes.rows[0]);
  } catch (error: any) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job.' });
  }
});

// ADMIN: PUT /api/admin/jobs/:id
// Edit job
router.put('/admin/jobs/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const existingRes = await query('SELECT * FROM jobs WHERE id = $1', [id]);
    if (!existingRes.rows[0]) {
      res.status(404).json({ error: 'Job not found.' });
      return;
    }

    const {
      title,
      department,
      location,
      employment_type,
      experience,
      salary,
      description,
      responsibilities,
      requirements,
      skills,
      application_email,
      application_link,
      status,
    } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ error: 'Job title is required.' });
      return;
    }
    if (!department || !department.trim()) {
      res.status(400).json({ error: 'Department is required.' });
      return;
    }
    if (!location || !location.trim()) {
      res.status(400).json({ error: 'Location is required.' });
      return;
    }
    if (!description || !description.trim()) {
      res.status(400).json({ error: 'Job description is required.' });
      return;
    }

    const now = new Date().toISOString();
    const jobStatus = status === 'closed' ? 'closed' : 'active';

    const updateRes = await query(`
      UPDATE jobs SET
        title = $1,
        department = $2,
        location = $3,
        employment_type = $4,
        experience = $5,
        salary = $6,
        description = $7,
        responsibilities = $8,
        requirements = $9,
        skills = $10,
        application_email = $11,
        application_link = $12,
        status = $13,
        updated_at = $14
      WHERE id = $15
      RETURNING *
    `, [
      title.trim(),
      department.trim(),
      location.trim(),
      employment_type ? employment_type.trim() : 'Full-time',
      experience ? experience.trim() : '1-3 years',
      salary ? salary.trim() : null,
      description.trim(),
      responsibilities ? responsibilities.trim() : '',
      requirements ? requirements.trim() : '',
      skills ? skills.trim() : '',
      application_email ? application_email.trim() : '',
      application_link ? application_link.trim() : '',
      jobStatus,
      now,
      id
    ]);

    res.json(updateRes.rows[0]);
  } catch (error: any) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Failed to update job opening.' });
  }
});

// ADMIN: PATCH /api/admin/jobs/:id/status
// Toggle or set status (active / closed)
router.patch('/admin/jobs/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const existingRes = await query('SELECT * FROM jobs WHERE id = $1', [id]);
    const existing = existingRes.rows[0];
    if (!existing) {
      res.status(404).json({ error: 'Job not found.' });
      return;
    }

    const newStatus = req.body.status
      ? (req.body.status === 'closed' ? 'closed' : 'active')
      : (existing.status === 'active' ? 'closed' : 'active');

    const now = new Date().toISOString();
    const updateRes = await query(
      'UPDATE jobs SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      [newStatus, now, id]
    );

    res.json(updateRes.rows[0]);
  } catch (error: any) {
    console.error('Toggle job status error:', error);
    res.status(500).json({ error: 'Failed to update job status.' });
  }
});

// ADMIN: DELETE /api/admin/jobs/:id
router.delete('/admin/jobs/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const existingRes = await query('SELECT id FROM jobs WHERE id = $1', [id]);
    if (!existingRes.rows[0]) {
      res.status(404).json({ error: 'Job not found.' });
      return;
    }

    await query('DELETE FROM jobs WHERE id = $1', [id]);
    res.json({ success: true, message: 'Job opening deleted successfully.' });
  } catch (error: any) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job opening.' });
  }
});

export default router;
