import { Router, Request, Response } from 'express';
import { query } from '../db';
import { requireAdminAuth } from '../auth';

const router = Router();

// PUBLIC: POST /api/bookings
router.post('/bookings', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, service, preferred_date, preferred_time, message } = req.body;

    if (!name || !email || !phone || !service) {
      res.status(400).json({ error: 'Name, email, phone, and service are required.' });
      return;
    }

    const id = 'bk-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
    const now = new Date().toISOString();

    const insertRes = await query(`
      INSERT INTO bookings (
        id, name, email, phone, service, preferred_date, preferred_time, message, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      id,
      name.trim(),
      email.trim(),
      phone.trim(),
      service.trim(),
      preferred_date || '',
      preferred_time || '',
      message ? message.trim() : '',
      'pending',
      now,
      now
    ]);

    res.status(201).json({ success: true, record: insertRes.rows[0] });
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to submit booking.' });
  }
});

// ADMIN: GET /api/admin/bookings
router.get('/admin/bookings', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error: any) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
});

// ADMIN: PATCH /api/admin/bookings/:id/status
router.patch('/admin/bookings/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const id = req.params.id;
    const now = new Date().toISOString();

    const updateRes = await query(
      'UPDATE bookings SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      [status, now, id]
    );

    if (!updateRes.rows[0]) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }

    res.json(updateRes.rows[0]);
  } catch (error: any) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status.' });
  }
});

export default router;
