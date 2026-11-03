import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Client } = pg;

const uri = process.env.DATABASE_URL || "postgresql://postgres.gznvueeroscdfymfuyxf:XQ3FttXtDTdiL46M@aws-0-eu-north-1.pooler.supabase.com:6543/postgres";

async function setupDatabase() {
  console.log("Connecting to Supabase PostgreSQL cluster...");
  const client = new Client({
    connectionString: uri,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected successfully to Supabase.");

    // 1. Admin Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(120) UNIQUE NOT NULL,
        password_hash TEXT,
        full_name VARCHAR(120),
        role VARCHAR(50) DEFAULT 'Super Admin',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    // Ensure password_hash and last_login columns exist if table was already created
    await client.query(`
      ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_hash TEXT;
      ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
    `);
    console.log("✓ admin_users table configured.");

    // Seed/Update Default Admin User
    const adminPasswordHash = bcrypt.hashSync("Admin@123456", 10);
    await client.query(`
      INSERT INTO admin_users (email, password_hash, full_name, role, is_active)
      VALUES ($1, $2, $3, $4, true)
      ON CONFLICT (email) 
      DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        is_active = true;
    `, ['admin@petroeng.in', adminPasswordHash, 'System Administrator', 'Super Admin']);
    console.log("✓ Default admin seeded (admin@petroeng.in / Admin@123456)");

    // 2. Product Categories Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(150) UNIQUE NOT NULL,
        division VARCHAR(50) NOT NULL,
        name VARCHAR(150) NOT NULL,
        short_description TEXT,
        detailed_description TEXT,
        image TEXT,
        key_products JSONB DEFAULT '[]'::jsonb,
        applications JSONB DEFAULT '[]'::jsonb,
        standards JSONB DEFAULT '[]'::jsonb,
        display_order INT DEFAULT 0,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ product_categories table configured.");

    // 3. Products Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(180) UNIQUE NOT NULL,
        category_slug VARCHAR(150) NOT NULL,
        division VARCHAR(50) NOT NULL,
        name VARCHAR(220) NOT NULL,
        short_description TEXT,
        overview TEXT,
        image TEXT,
        featured BOOLEAN DEFAULT false,
        material VARCHAR(200),
        size VARCHAR(200),
        pressure_rating VARCHAR(200),
        connection_type VARCHAR(200),
        temperature_range VARCHAR(200),
        standards JSONB DEFAULT '[]'::jsonb,
        specifications JSONB DEFAULT '{}'::jsonb,
        key_features JSONB DEFAULT '[]'::jsonb,
        applications JSONB DEFAULT '[]'::jsonb,
        package_options JSONB DEFAULT '[]'::jsonb,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ products table configured.");

    // 4. Contact Messages Table
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
        internal_notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ contact_messages table configured.");

    // 5. RFQ Submissions Table
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
        attachment_name VARCHAR(255),
        status VARCHAR(30) DEFAULT 'new',
        internal_notes TEXT,
        quote_amount NUMERIC,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ rfq_submissions table configured.");

    // 6. Website Content Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS website_content (
        key VARCHAR(100) PRIMARY KEY,
        section VARCHAR(100) NOT NULL,
        content JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ website_content table configured.");

    // 7. Documents & Brochures Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(220) NOT NULL,
        category VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT,
        file_url TEXT NOT NULL,
        file_size VARCHAR(50),
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ documents table configured.");

    // 8. Services Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(150) UNIQUE NOT NULL,
        title VARCHAR(200) NOT NULL,
        short_desc TEXT,
        overview TEXT,
        icon_name VARCHAR(50),
        image TEXT,
        key_activities JSONB DEFAULT '[]'::jsonb,
        benefits JSONB DEFAULT '[]'::jsonb,
        related_products JSONB DEFAULT '[]'::jsonb,
        related_industries JSONB DEFAULT '[]'::jsonb,
        display_order INT DEFAULT 0,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ services table configured.");

    // 9. Industries Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS industries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(150) UNIQUE NOT NULL,
        name VARCHAR(150) NOT NULL,
        tagline VARCHAR(250),
        short_overview TEXT,
        detailed_overview TEXT,
        image TEXT,
        common_requirements JSONB DEFAULT '[]'::jsonb,
        relevant_products JSONB DEFAULT '[]'::jsonb,
        relevant_services JSONB DEFAULT '[]'::jsonb,
        display_order INT DEFAULT 0,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ industries table configured.");

    // 10. Audit Logs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        admin_email VARCHAR(120) NOT NULL,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id VARCHAR(100),
        details JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ audit_logs table configured.");

    // Seed Initial Audit Log
    await client.query(`
      INSERT INTO audit_logs (admin_email, action, entity_type, entity_id, details)
      VALUES ('admin@petroeng.in', 'SCHEMA_INITIALIZED', 'system', 'database', '{"message": "Complete CMS schema initialized and connected"}'::jsonb);
    `);

    // Seed Website Content default
    const heroContent = {
      heroTitleLine1: "Industrial Fluid &",
      heroTitleLine2: "Chemical Engineering",
      heroSubtitle: "Engineered chemicals, water treatment systems, and precision instrumentation for oil & gas, petrochemical, and critical process utilities.",
      ctaPrimaryText: "Explore Products",
      ctaPrimaryLink: "/instrumentation",
      ctaSecondaryText: "Request a Quote",
      ctaSecondaryLink: "/request-a-quote",
      stats: [
        { num: "02", lbl: "Divisions under one roof" },
        { num: "08", lbl: "Chemical solution groups" },
        { num: "63", lbl: "Formulated & engineered lines" },
        { num: "6000+", lbl: "PSI High-pressure hardware" }
      ],
      companyEmail: "sales@petroeng.in",
      companyPhone: "+91 96521 11021",
      companyAddress: "Mumbai, Maharashtra, India"
    };

    await client.query(`
      INSERT INTO website_content (key, section, content)
      VALUES ('homepage_hero', 'homepage', $1)
      ON CONFLICT (key) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();
    `, [JSON.stringify(heroContent)]);
    console.log("✓ Default website content seeded.");

    console.log("\nALL TABLES CONFIGURED AND SEEDED SUCCESSFULLY!");
    await client.end();
  } catch (err) {
    console.error("Setup error:", err);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
}

setupDatabase();
