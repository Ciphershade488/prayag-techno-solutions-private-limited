import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { generateToken, requireAdminAuth, AuthRequest } from '../auth';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const identifier = (username || email || '').trim().toLowerCase();

    if (!identifier || !password) {
      res.status(400).json({ error: 'Username/Email and password are required.' });
      return;
    }

    // Look up by username or email
    const admin = db.prepare(`
      SELECT id, username, email, password_hash, created_at
      FROM admins
      WHERE LOWER(username) = ? OR LOWER(email) = ?
    `).get(identifier, identifier) as any;

    if (!admin) {
      res.status(401).json({ error: 'Invalid username/email or password.' });
      return;
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid username/email or password.' });
      return;
    }

    const adminUser = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      created_at: admin.created_at,
    };

    const token = generateToken(adminUser);

    // Set cookie
    res.cookie('pts_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      token,
      user: adminUser,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAdminAuth, (req: AuthRequest, res: Response) => {
  res.json({ user: req.admin });
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('pts_token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
