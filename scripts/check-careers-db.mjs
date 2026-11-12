import pg from 'pg';
const { Client } = pg;

const uri = process.env.DATABASE_URL || process.env.DATABASE_URL;
const client = new Client({
  connectionString: uri.split('?')[0],
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log("Current public tables:", res.rows.map(r => r.table_name));
  await client.end();
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
