import pg from 'pg';
const { Client } = pg;

const uri = process.env.DATABASE_URL || "postgresql://postgres.gznvueeroscdfymfuyxf:XQ3FttXtDTdiL46M@aws-0-eu-north-1.pooler.supabase.com:6543/postgres";

async function initializeTables() {
  console.log("Connecting to Supabase to initialize core schema...");
  const client = new Client({
    connectionString: uri,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected to Supabase.");

    // Create RFQ submissions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS rfq_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(120) NOT NULL,
        company_name VARCHAR(150) NOT NULL,
        email VARCHAR(120) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        industry VARCHAR(100),
        product_category VARCHAR(100),
        product_name VARCHAR(150),
        quantity VARCHAR(50),
        unit_of_measurement VARCHAR(50),
        technical_specifications TEXT,
        delivery_location VARCHAR(200),
        required_delivery_date VARCHAR(100),
        additional_comments TEXT,
        status VARCHAR(30) DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ rfq_submissions table ready");

    // Create Contact Messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(120) NOT NULL,
        company_name VARCHAR(150),
        email VARCHAR(120) NOT NULL,
        phone VARCHAR(30),
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(30) DEFAULT 'new',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ contact_messages table ready");

    // Create Admin Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(120) UNIQUE NOT NULL,
        full_name VARCHAR(120),
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ admin_users table ready");

    // Fetch existing tables to confirm
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log("\nConfirmed Supabase Tables:", res.rows.map(r => r.table_name));

    await client.end();
  } catch (err) {
    console.error("Initialization error:", err.message);
    try { await client.end(); } catch (e) {}
  }
}

initializeTables();
