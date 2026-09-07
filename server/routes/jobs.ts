import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth } from '../auth';

const router = Router();

// PUBLIC: GET /api/jobs
// Returns active/published jobs for public careers page
router.get('/jobs', (_req: Request, res: Response) => {
  try {
    const jobs = db.prepare(`
      SELECT * FROM jobs
      WHERE status = 'active'
      ORDER BY created_at DESC
    `).all();

    res.json(jobs);
  } catch (error: any) {
    console.error('Fetch public jobs error:', error);
    res.status(500).json({ error: 'Failed to retrieve jobs.' });
  }
});

// PUBLIC: GET /api/jobs/:id
router.get('/jobs/:id', (req: Request, res: Response) => {
  try {
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
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
router.get('/admin/jobs', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const jobs = db.prepare(`
      SELECT * FROM jobs
      ORDER BY created_at DESC
    `).all();

    res.json(jobs);
  } catch (error: any) {
    console.error('Fetch admin jobs error:', error);
    res.status(500).json({ error: 'Failed to retrieve jobs list.' });
  }
});

// ADMIN: GET /api/admin/jobs/:id
router.get('/admin/jobs/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
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
router.post('/admin/jobs', requireAdminAuth, (req: Request, res: Response) => {
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

    db.prepare(`
      INSERT INTO jobs (
        id, title, department, location, employment_type, experience, salary,
        description, responsibilities, requirements, skills, application_email,
        application_link, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
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
    );

    const createdJob = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    res.status(201).json(createdJob);
  } catch (error: any) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job.' });
  }
});

// ADMIN: PUT /api/admin/jobs/:id
// Edit job
router.put('/admin/jobs/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const existing = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    if (!existing) {
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

    db.prepare(`
      UPDATE jobs SET
        title = ?,
        department = ?,
        location = ?,
        employment_type = ?,
        experience = ?,
        salary = ?,
        description = ?,
        responsibilities = ?,
        requirements = ?,
        skills = ?,
        application_email = ?,
        application_link = ?,
        status = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
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
    );

    const updated = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    res.json(updated);
  } catch (error: any) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Failed to update job opening.' });
  }
});

// ADMIN: PATCH /api/admin/jobs/:id/status
// Toggle or set status (active / closed)
router.patch('/admin/jobs/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const existing = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id) as any;
    if (!existing) {
      res.status(404).json({ error: 'Job not found.' });
      return;
    }

    const newStatus = req.body.status
      ? (req.body.status === 'closed' ? 'closed' : 'active')
      : (existing.status === 'active' ? 'closed' : 'active');

    const now = new Date().toISOString();
    db.prepare('UPDATE jobs SET status = ?, updated_at = ? WHERE id = ?').run(newStatus, now, id);

    const updated = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    res.json(updated);
  } catch (error: any) {
    console.error('Toggle job status error:', error);
    res.status(500).json({ error: 'Failed to update job status.' });
  }
});

// ADMIN: DELETE /api/admin/jobs/:id
router.delete('/admin/jobs/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const existing = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    if (!existing) {
      res.status(404).json({ error: 'Job not found.' });
      return;
    }

    db.prepare('DELETE FROM jobs WHERE id = ?').run(id);
    res.json({ success: true, message: 'Job opening deleted successfully.' });
  } catch (error: any) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job opening.' });
  }
});

export default router;
