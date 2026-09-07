import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth } from '../auth';

const router = Router();

// PUBLIC: POST /api/bookings
router.post('/bookings', (req: Request, res: Response) => {
  try {
    const { name, email, phone, service, preferred_date, preferred_time, message } = req.body;

    if (!name || !email || !phone || !service) {
      res.status(400).json({ error: 'Name, email, phone, and service are required.' });
      return;
    }

    const id = 'bk-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO bookings (
        id, name, email, phone, service, preferred_date, preferred_time, message, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
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
    );

    const record = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    res.status(201).json({ success: true, record });
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to submit booking.' });
  }
});

// ADMIN: GET /api/admin/bookings
router.get('/admin/bookings', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    res.json(bookings);
  } catch (error: any) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
});

// ADMIN: PATCH /api/admin/bookings/:id/status
router.patch('/admin/bookings/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const id = req.params.id;
    const now = new Date().toISOString();

    db.prepare('UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?').run(status, now, id);
    const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    res.json(updated);
  } catch (error: any) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status.' });
  }
});

export default router;
