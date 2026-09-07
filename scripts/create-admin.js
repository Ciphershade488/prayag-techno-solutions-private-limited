#!/usr/bin/env node
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL?.trim();

async function main() {
  let pool;
  if (databaseUrl) {
    const isLocalhost = databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1');
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
    });
  } else {
    try {
      const { newDb } = await import('pg-mem');
      const mem = newDb();
      const adapter = mem.adapters.createPg();
      pool = new adapter.Pool();
      console.log('Notice: DATABASE_URL not set, operating on in-memory PostgreSQL instance.');
    } catch {
      console.error('Error: DATABASE_URL must be set in your environment or .env file.');
      process.exit(1);
    }
  }

  // Ensure admins table exists
  await pool.query(`
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

  const existingRes = await pool.query(
    'SELECT id, username, email FROM admins WHERE LOWER(email) = $1 OR LOWER(username) = $2',
    [email, username]
  );
  const existing = existingRes.rows[0];
  const now = new Date().toISOString();
  const hash = bcrypt.hashSync(password, 10);

  if (existing) {
    await pool.query(
      `UPDATE admins
       SET password_hash = $1, email = $2, username = $3
       WHERE id = $4`,
      [hash, email, username, existing.id]
    );
    console.log(`[Admin] Successfully updated credentials for admin account (id: ${existing.id}, email: ${email}, username: ${username})`);
  } else {
    const id = 'admin-' + Math.random().toString(36).substring(2, 8);
    await pool.query(
      `INSERT INTO admins (id, username, email, password_hash, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, username, email, hash, now]
    );
    console.log(`[Admin] Successfully created new administrator account (id: ${id}, email: ${email}, username: ${username})`);
  }

  console.log('\nLogin details:');
  console.log(`Email / Username: ${email} (or username: ${username})`);
  console.log(`Password: ${password}`);
  console.log('Admin Portal: /admin/login\n');

  await pool.end();
}

main().catch((err) => {
  console.error('Failed to create/update admin:', err);
  process.exit(1);
});
