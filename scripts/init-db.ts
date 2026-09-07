import 'dotenv/config';
import { initDatabase, getPool } from '../server/db';

async function main() {
  console.log('=== Prayag Techno Solutions: PostgreSQL Database Initialization ===\n');

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    console.warn('[Warning] DATABASE_URL is not set. Initializing with in-memory PostgreSQL engine...');
  } else {
    const masked = databaseUrl.replace(/:([^:@]+)@/, ':****@');
    console.log(`[Connecting] DATABASE_URL: ${masked}`);
  }

  try {
    console.log('[Step 1/2] Creating tables and indexes if not exists...');
    await initDatabase();

    console.log('\n[Step 2/2] Verifying table creation in PostgreSQL...');
    const pool = getPool();
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    const tableNames = tablesRes.rows.map((r: any) => r.table_name);
    console.log('[Success] Tables currently in database:', tableNames);

    const required = ['admins', 'bookings', 'company_details', 'job_applications', 'jobs'];
    const missing = required.filter((t) => !tableNames.includes(t));

    if (missing.length === 0) {
      console.log('\n✓ All 5 required tables verified: admins, bookings, company_details, job_applications, jobs.');
      console.log('✓ Database initialization completed successfully!');
    } else {
      console.warn('\n[Notice] Some tables were not listed under information_schema.tables:', missing);
    }

    process.exit(0);
  } catch (error: any) {
    console.error('\n✗ Database initialization failed:', error.message || error);
    process.exit(1);
  }
}

main();
