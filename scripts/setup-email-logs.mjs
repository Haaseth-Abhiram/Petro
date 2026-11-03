import pg from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres.gznvueeroscdfymfuyxf:XQ3FttXtDTdiL46M@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?sslmode=require";

async function setupEmailLogs() {
  const cleanUrl = connectionString.split("?")[0];
  const pool = new pg.Pool({
    connectionString: cleanUrl,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        recipient_email VARCHAR(255) NOT NULL,
        recipient_name VARCHAR(255),
        subject VARCHAR(255) NOT NULL,
        email_type VARCHAR(50) NOT NULL,
        reference_id VARCHAR(100),
        status VARCHAR(50) DEFAULT 'sent',
        error_message TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ email_logs table created successfully in Supabase.");
  } catch (err) {
    console.error("Error creating email_logs table:", err);
  } finally {
    await pool.end();
  }
}

setupEmailLogs();
