import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'prayag.db');

// Ensure data directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(DB_PATH);

// Enable WAL mode for better concurrency
try {
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
} catch (e) {
  console.warn('SQLite PRAGMA warning:', e);
}

export function initDatabase() {
  // 1. Admins table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // 2. Jobs table
  db.exec(`
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
  `);

  // 3. Company Details table
  db.exec(`
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
  `);

  // 4. Bookings table
  db.exec(`
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
  `);

  // 5. Job Applications table
  db.exec(`
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
  `);

  seedInitialData();
}

function seedInitialData() {
  // Seed initial Admin if table empty
  const countAdminRow = db.prepare('SELECT COUNT(*) as count FROM admins').get() as { count: number };
  if (countAdminRow.count === 0) {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@prayagtechno.com').trim().toLowerCase();
    const adminUser = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin@Prayag2026!';
    const hash = bcrypt.hashSync(adminPass, 10);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO admins (id, username, email, password_hash, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run('admin-1', adminUser, adminEmail, hash, now);

    console.log(`[Database] Initial admin seeded: ${adminEmail} (username: ${adminUser})`);
  }

  // Seed initial Company Details if table empty
  const countCompanyRow = db.prepare('SELECT COUNT(*) as count FROM company_details').get() as { count: number };
  if (countCompanyRow.count === 0) {
    const now = new Date().toISOString();
    const defaultAddresses = [
      { label: 'Corporate Office', line: '53C/12D, M.L.N. Road, Prayagraj (Allahabad), U.P. – 211002' },
      { label: 'Branch Office', line: '620/489B, Mumfordganj, Prayagraj (Allahabad), U.P. – 211002' },
      { label: 'Business Center', line: '11/1315, Fort Kochi, Ernakulam, Kerala – 682001' },
    ];
    const defaultPhones = ['+91-9336737908', '+91-8800646846'];

    db.prepare(`
      INSERT INTO company_details (
        id, company_name, legal_name, short_name, tagline, about,
        phone, phones_json, email, address, addresses_json, website, facebook, hours, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'company-main',
      'PRAYAG TECHNO SOLUTIONS',
      'PRAYAG TECHNO SOLUTIONS PRIVATE LIMITED',
      'Prayag Techno',
      'IT Services, HR Services & BPO Solutions',
      "We're PRAYAG TECHNO SOLUTIONS PRIVATE LIMITED, and we can't wait to start working together. Your vision is important to us — we map out the needs of your business and provide the necessary tools to achieve a successful future.",
      '+91-9336737908',
      JSON.stringify(defaultPhones),
      'pts.info@mail.com',
      '53C/12D, M.L.N. Road, Prayagraj (Allahabad), U.P. – 211002',
      JSON.stringify(defaultAddresses),
      'https://prayagtechno.com',
      'https://www.facebook.com/prayagtechnosolutions',
      'Monday – Saturday, 09:30 – 18:30 IST',
      now
    );
    console.log('[Database] Initial company details seeded.');
  }

  // Seed initial Jobs if table empty
  const countJobsRow = db.prepare('SELECT COUNT(*) as count FROM jobs').get() as { count: number };
  if (countJobsRow.count === 0) {
    const now = new Date().toISOString();
    const initialJobs = [
      {
        id: 'job-it-support',
        title: 'IT Support Engineer',
        department: 'IT Services',
        location: 'Prayagraj, U.P.',
        employment_type: 'Full-time',
        experience: '1-3 years',
        salary: '₹2,40,000 - ₹3,60,000 / year',
        description: 'Provide laptop, desktop and server support, AMC services, remote and onsite troubleshooting, hardware diagnostics, and data recovery for corporate clients.',
        responsibilities: '• Diagnose and troubleshoot laptop, desktop, server, and printer hardware/software issues\n• Deliver reliable Annual Maintenance Contract (AMC) support on-site and remotely\n• Configure operating systems, network connections, security tools, and drivers\n• Assist in data recovery, regular backup maintenance, and disaster recovery preparations\n• Maintain clear service logs, client documentation, and ticket resolutions',
        requirements: '• Diploma or Bachelor degree in Computer Science, IT, Electronics or related technical field\n• 1 to 3 years hands-on experience in desktop/laptop repair, OS installation, and LAN setup\n• Familiarity with Windows Server, Active Directory, network printers, and router setups\n• Strong communication skills and willingness to handle client on-site visits in Prayagraj',
        skills: 'Desktop Support, Server Maintenance, Hardware Diagnostics, Networking (LAN/WAN), Data Recovery, Windows Server, Printer Solutions',
        application_email: 'pts.info@mail.com',
        application_link: '',
        status: 'active',
      },
      {
        id: 'job-hr-exec',
        title: 'HR Executive',
        department: 'HR & BPO',
        location: 'Prayagraj / Kochi',
        employment_type: 'Full-time',
        experience: '2+ years',
        salary: '₹2,80,000 - ₹4,20,000 / year',
        description: 'Manage human resource operations, employee onboarding, attendance management, payroll coordination, and client talent sourcing across our service centers.',
        responsibilities: '• Manage end-to-end recruitment cycle for IT, BPO, and administrative roles\n• Prepare job descriptions, screen resumes, and conduct initial candidate interviews\n• Maintain employee records, attendance tracking, leave balances, and payroll reports\n• Coordinate employee engagement initiatives, compliance documentation, and training sessions\n• Provide HR consulting support to corporate clients in Prayagraj and Kochi',
        requirements: '• MBA / BBA in Human Resources or relevant degree\n• Minimum 2 years of relevant experience in HR operations or recruitment\n• Proficient in HRMS tools, MS Excel, and statutory compliance basics (ESI, PF)\n• Strong interpersonal, organizational, and negotiation skills',
        skills: 'Talent Acquisition, Employee Relations, Payroll Coordination, Onboarding, HR Compliance, Performance Management, MS Excel',
        application_email: 'pts.info@mail.com',
        application_link: '',
        status: 'active',
      },
      {
        id: 'job-bpo-exec',
        title: 'BPO / Data Entry Executive',
        department: 'HR & BPO',
        location: 'Prayagraj, U.P.',
        employment_type: 'Full-time',
        experience: '0-2 years',
        salary: '₹1,80,000 - ₹2,50,000 / year',
        description: 'Handle BPO operations, high-speed data processing, document digitization, translation coordination, and customer verification workflows with speed and accuracy.',
        responsibilities: '• Accurately enter and verify customer records, financial figures, and forms into client databases\n• Review source documents for completeness and resolve data discrepancies\n• Assist in back-office digitization, document indexing, and Hindi-English translation tasks\n• Meet daily throughput and accuracy benchmarks consistently\n• Support team leads with batch audit checks and reporting',
        requirements: '• Intermediate (10+2) or Graduate in any stream\n• Minimum typing speed of 30+ WPM with 95%+ accuracy\n• Good command of English and Hindi reading and comprehension\n• Freshers with strong typing skills and attention to detail are welcome to apply',
        skills: 'Data Entry, Typing Speed, MS Office, Document Verification, Back-office Support, Data Quality Control',
        application_email: 'pts.info@mail.com',
        application_link: '',
        status: 'active',
      },
      {
        id: 'job-gem-consultant',
        title: 'GeM Consultant',
        department: 'GeM Services',
        location: 'Prayagraj / Remote',
        employment_type: 'Full-time',
        experience: '2+ years',
        salary: '₹3,00,000 - ₹4,80,000 / year',
        description: 'Provide end-to-end GeM (Government e-Marketplace) consulting — vendor registration, product catalogue listing, bid evaluation, tender submission, and compliance management.',
        responsibilities: '• Assist manufacturers, traders, and service providers with GeM portal registration and brand approval\n• Create and optimize product and service listings conforming to GeM specifications and categories\n• Monitor daily government tenders, perform comparative pricing analysis, and prepare bid submissions\n• Guide clients on GeM legal compliance, incident management, invoice generation, and payment follow-ups\n• Deliver sales growth strategies to help clients expand their government procurement revenue',
        requirements: '• Bachelor’s degree in Commerce, Business, IT, or related field\n• Proven track record of at least 2 years handling GeM portal workflows and government tenders\n• In-depth understanding of GeM bidding rules, reverse auctions, L1 procurement, and OEM panel creation\n• Strong numerical aptitude and client advisory capabilities',
        skills: 'GeM Portal, Tender Analysis, E-Bidding, Product Listing, Vendor Assessment, Government Procurement, Compliance',
        application_email: 'pts.info@mail.com',
        application_link: '',
        status: 'active',
      },
    ];

    const stmt = db.prepare(`
      INSERT INTO jobs (
        id, title, department, location, employment_type, experience, salary,
        description, responsibilities, requirements, skills, application_email,
        application_link, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const job of initialJobs) {
      stmt.run(
        job.id,
        job.title,
        job.department,
        job.location,
        job.employment_type,
        job.experience,
        job.salary,
        job.description,
        job.responsibilities,
        job.requirements,
        job.skills,
        job.application_email,
        job.application_link,
        job.status,
        now,
        now
      );
    }
    console.log('[Database] Initial jobs seeded successfully.');
  }
}
