import { Router, Request, Response } from 'express';
import { query } from '../db';
import { requireAdminAuth } from '../auth';

const router = Router();

// ADMIN: GET /api/admin/stats
router.get('/admin/stats', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    const totalJobsRes = await query('SELECT COUNT(*) as count FROM jobs');
    const activeJobsRes = await query("SELECT COUNT(*) as count FROM jobs WHERE status = 'active'");
    const closedJobsRes = await query("SELECT COUNT(*) as count FROM jobs WHERE status = 'closed'");

    const totalBookingsRes = await query('SELECT COUNT(*) as count FROM bookings');
    const pendingBookingsRes = await query("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");

    const totalAppsRes = await query('SELECT COUNT(*) as count FROM job_applications');

    const recentJobsRes = await query(`
      SELECT id, title, department, location, employment_type, experience, status, created_at, updated_at
      FROM jobs
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json({
      totalJobs: parseInt(totalJobsRes.rows[0]?.count || '0', 10),
      activeJobs: parseInt(activeJobsRes.rows[0]?.count || '0', 10),
      closedJobs: parseInt(closedJobsRes.rows[0]?.count || '0', 10),
      totalBookings: parseInt(totalBookingsRes.rows[0]?.count || '0', 10),
      pendingBookings: parseInt(pendingBookingsRes.rows[0]?.count || '0', 10),
      totalApplications: parseInt(totalAppsRes.rows[0]?.count || '0', 10),
      recentJobs: recentJobsRes.rows,
    });
  } catch (error: any) {
    console.error('Fetch admin stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve stats.' });
  }
});

export default router;
