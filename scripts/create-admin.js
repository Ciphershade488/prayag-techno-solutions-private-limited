#!/usr/bin/env node
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'prayag.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);

// Ensure admins table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

const args = process.argv.slice(2);
const emailArg = args[0] || process.env.ADMIN_EMAIL || 'admin@prayagtechno.com';
const passwordArg = args[1] || process.env.ADMIN_PASSWORD || 'Admin@Prayag2026!';
const usernameArg = args[2] || process.env.ADMIN_USERNAME || (emailArg.includes('@') ? emailArg.split('@')[0] : 'admin');

if (!emailArg || !passwordArg) {
  console.error('Usage: node scripts/create-admin.js <email> <password> [username]');
  process.exit(1);
}

const email = emailArg.trim().toLowerCase();
const username = usernameArg.trim().toLowerCase();
const password = passwordArg;

const existing = db.prepare('SELECT id, username, email FROM admins WHERE LOWER(email) = ? OR LOWER(username) = ?').get(email, username);
const now = new Date().toISOString();
const hash = bcrypt.hashSync(password, 10);

if (existing) {
  db.prepare(`
    UPDATE admins
    SET password_hash = ?, email = ?, username = ?
    WHERE id = ?
  `).run(hash, email, username, existing.id);
  console.log(`[Admin] Successfully updated credentials for admin account (id: ${existing.id}, email: ${email}, username: ${username})`);
} else {
  const id = 'admin-' + Math.random().toString(36).substring(2, 8);
  db.prepare(`
    INSERT INTO admins (id, username, email, password_hash, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, username, email, hash, now);
  console.log(`[Admin] Successfully created new administrator account (id: ${id}, email: ${email}, username: ${username})`);
}

console.log('\nLogin details:');
console.log(`Email / Username: ${email} (or username: ${username})`);
console.log(`Password: ${password}`);
console.log('Admin Portal: http://localhost:3000/admin/login\n');
