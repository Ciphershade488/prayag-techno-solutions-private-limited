import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth } from '../auth';

const router = Router();

// ADMIN: GET /api/admin/stats
router.get('/admin/stats', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const totalJobsRow = db.prepare('SELECT COUNT(*) as count FROM jobs').get() as { count: number };
    const activeJobsRow = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status = 'active'").get() as { count: number };
    const closedJobsRow = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status = 'closed'").get() as { count: number };

    const totalBookingsRow = db.prepare('SELECT COUNT(*) as count FROM bookings').get() as { count: number };
    const pendingBookingsRow = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'").get() as { count: number };

    const totalAppsRow = db.prepare('SELECT COUNT(*) as count FROM job_applications').get() as { count: number };

    const recentJobs = db.prepare(`
      SELECT id, title, department, location, employment_type, experience, status, created_at, updated_at
      FROM jobs
      ORDER BY created_at DESC
      LIMIT 5
    `).all();

    res.json({
      totalJobs: totalJobsRow.count,
      activeJobs: activeJobsRow.count,
      closedJobs: closedJobsRow.count,
      totalBookings: totalBookingsRow.count,
      pendingBookings: pendingBookingsRow.count,
      totalApplications: totalAppsRow.count,
      recentJobs,
    });
  } catch (error: any) {
    console.error('Fetch admin stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve stats.' });
  }
});

export default router;
