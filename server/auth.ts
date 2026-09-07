import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'prayag-techno-solutions-jwt-secret-2026';
const TOKEN_EXPIRY = '7d';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  created_at?: string;
}

export interface AuthRequest extends Request {
  admin?: AdminUser;
}

export function generateToken(user: AdminUser): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || !decoded.id) return null;
    return {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };
  } catch {
    return null;
  }
}

export async function requireAdminAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  let token: string | undefined;

  // 1. Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 2. Fallback to cookie
  if (!token && req.cookies && req.cookies.pts_token) {
    token = req.cookies.pts_token;
  }

  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please sign in.' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
    return;
  }

  try {
    // Verify admin still exists in PostgreSQL database
    const adminRes = await query('SELECT id, username, email, created_at FROM admins WHERE id = $1', [payload.id]);
    const adminRow = adminRes.rows[0] as AdminUser | undefined;
    
    if (!adminRow) {
      res.status(401).json({ error: 'Admin account not found or removed.' });
      return;
    }

    req.admin = adminRow;
    next();
  } catch (err: any) {
    console.error('Auth verification error:', err);
    res.status(500).json({ error: 'Authentication verification error.' });
  }
}
