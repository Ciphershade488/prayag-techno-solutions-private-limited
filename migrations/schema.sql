-- Prayag Techno Solutions Private Limited
-- PostgreSQL Database Schema

-- 1. Administrators Table
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- 2. Careers & Job Openings Table
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  employment_type TEXT NOT NULL,
  experience TEXT NOT NULL,
  salary TEXT,
  description TEXT NOT NULL,
  responsibilities TEXT,
  requirements TEXT,
  skills TEXT,
  application_email TEXT,
  application_link TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 3. Corporate Profile & Branch Details Table
CREATE TABLE IF NOT EXISTS company_details (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  short_name TEXT,
  tagline TEXT,
  about TEXT NOT NULL,
  phone TEXT NOT NULL,
  phones_json TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  addresses_json TEXT NOT NULL,
  website TEXT,
  facebook TEXT,
  hours TEXT,
  updated_at TEXT NOT NULL
);

-- 4. Client Consultation Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 5. Candidate Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
  id TEXT PRIMARY KEY,
  job_id TEXT,
  role TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  experience_years TEXT,
  location TEXT,
  portfolio_url TEXT,
  cover_letter TEXT,
  resume_text TEXT,
  created_at TEXT NOT NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at DESC);
