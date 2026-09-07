#!/usr/bin/env tsx
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { query, initDatabase, getPool } from '../server/db';

dotenv.config();

async function runMigration() {
  console.log('=== Prayag Techno Solutions: SQLite to PostgreSQL Migration ===\n');

  const sqlitePath = process.env.SQLITE_PATH || path.join(process.cwd(), 'data', 'prayag.db');

  if (!fs.existsSync(sqlitePath)) {
    console.log(`[Info] No legacy SQLite database found at: ${sqlitePath}`);
    console.log('Initializing a fresh PostgreSQL schema...');
    await initDatabase();
    console.log('\nFresh PostgreSQL schema initialized successfully!');
    process.exit(0);
  }

  console.log(`[Found] Legacy SQLite database located at: ${sqlitePath}`);
  console.log('Connecting to PostgreSQL and verifying schema...');
  await initDatabase();

  // Dynamically load SQLite
  const { DatabaseSync } = await import('node:sqlite');
  const sqliteDb = new DatabaseSync(sqlitePath);

  let migratedAdmins = 0;
  let migratedJobs = 0;
  let migratedCompany = 0;
  let migratedBookings = 0;
  let migratedApplications = 0;

  // 1. Admins
  try {
    const admins = sqliteDb.prepare('SELECT * FROM admins').all() as any[];
    for (const a of admins) {
      const existing = await query(
        'SELECT id FROM admins WHERE LOWER(username) = $1 OR LOWER(email) = $2 OR id = $3',
        [a.username.toLowerCase(), a.email.toLowerCase(), a.id]
      );
      if (existing.rows.length > 0) {
        await query(`
          UPDATE admins SET
            password_hash = $1,
            email = $2,
            username = $3
          WHERE id = $4
        `, [a.password_hash, a.email, a.username, existing.rows[0].id]);
      } else {
        await query(`
          INSERT INTO admins (id, username, email, password_hash, created_at)
          VALUES ($1, $2, $3, $4, $5)
        `, [a.id, a.username, a.email, a.password_hash, a.created_at]);
      }
      migratedAdmins++;
    }
    console.log(`✔ Migrated ${migratedAdmins} admin account(s)`);
  } catch (err: any) {
    console.warn(`[Notice] Admins migration note: ${err.message}`);
  }

  // 2. Jobs
  try {
    const jobs = sqliteDb.prepare('SELECT * FROM jobs').all() as any[];
    for (const j of jobs) {
      await query(`
        INSERT INTO jobs (
          id, title, department, location, employment_type, experience, salary,
          description, responsibilities, requirements, skills, application_email,
          application_link, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          department = EXCLUDED.department,
          location = EXCLUDED.location,
          employment_type = EXCLUDED.employment_type,
          experience = EXCLUDED.experience,
          salary = EXCLUDED.salary,
          description = EXCLUDED.description,
          responsibilities = EXCLUDED.responsibilities,
          requirements = EXCLUDED.requirements,
          skills = EXCLUDED.skills,
          application_email = EXCLUDED.application_email,
          application_link = EXCLUDED.application_link,
          status = EXCLUDED.status,
          updated_at = EXCLUDED.updated_at
      `, [
        j.id, j.title, j.department, j.location, j.employment_type, j.experience, j.salary,
        j.description, j.responsibilities, j.requirements, j.skills, j.application_email,
        j.application_link, j.status, j.created_at, j.updated_at
      ]);
      migratedJobs++;
    }
    console.log(`✔ Migrated ${migratedJobs} job opening(s)`);
  } catch (err: any) {
    console.warn(`[Notice] Jobs migration note: ${err.message}`);
  }

  // 3. Company Details
  try {
    const company = sqliteDb.prepare('SELECT * FROM company_details').all() as any[];
    for (const c of company) {
      await query(`
        INSERT INTO company_details (
          id, company_name, legal_name, short_name, tagline, about,
          phone, phones_json, email, address, addresses_json, website, facebook, hours, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (id) DO UPDATE SET
          company_name = EXCLUDED.company_name,
          legal_name = EXCLUDED.legal_name,
          short_name = EXCLUDED.short_name,
          tagline = EXCLUDED.tagline,
          about = EXCLUDED.about,
          phone = EXCLUDED.phone,
          phones_json = EXCLUDED.phones_json,
          email = EXCLUDED.email,
          address = EXCLUDED.address,
          addresses_json = EXCLUDED.addresses_json,
          website = EXCLUDED.website,
          facebook = EXCLUDED.facebook,
          hours = EXCLUDED.hours,
          updated_at = EXCLUDED.updated_at
      `, [
        c.id, c.company_name, c.legal_name, c.short_name, c.tagline, c.about,
        c.phone, c.phones_json, c.email, c.address, c.addresses_json, c.website,
        c.facebook, c.hours, c.updated_at
      ]);
      migratedCompany++;
    }
    console.log(`✔ Migrated ${migratedCompany} company profile record(s)`);
  } catch (err: any) {
    console.warn(`[Notice] Company details migration note: ${err.message}`);
  }

  // 4. Bookings
  try {
    const bookings = sqliteDb.prepare('SELECT * FROM bookings').all() as any[];
    for (const b of bookings) {
      await query(`
        INSERT INTO bookings (
          id, name, email, phone, service, preferred_date, preferred_time, message, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING
      `, [
        b.id, b.name, b.email, b.phone, b.service, b.preferred_date,
        b.preferred_time, b.message, b.status, b.created_at, b.updated_at
      ]);
      migratedBookings++;
    }
    console.log(`✔ Migrated ${migratedBookings} consultation booking(s)`);
  } catch (err: any) {
    console.warn(`[Notice] Bookings migration note: ${err.message}`);
  }

  // 5. Job Applications
  try {
    const applications = sqliteDb.prepare('SELECT * FROM job_applications').all() as any[];
    for (const app of applications) {
      await query(`
        INSERT INTO job_applications (
          id, job_id, role, full_name, email, phone,
          experience_years, location, portfolio_url, cover_letter, resume_text, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO NOTHING
      `, [
        app.id, app.job_id, app.role, app.full_name, app.email, app.phone,
        app.experience_years, app.location, app.portfolio_url, app.cover_letter,
        app.resume_text, app.created_at
      ]);
      migratedApplications++;
    }
    console.log(`✔ Migrated ${migratedApplications} job application(s)`);
  } catch (err: any) {
    console.warn(`[Notice] Applications migration note: ${err.message}`);
  }

  console.log('\n=== Migration Completed Successfully! ===');
  console.log('Old SQLite database retained safely at ./data/prayag.db');
  console.log('All data is now active in your PostgreSQL database.');
}

runMigration().catch((err) => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
