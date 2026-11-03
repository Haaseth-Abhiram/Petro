import { Pool } from "pg";

// Prevent multiple pool instances in Next.js development hot-reloading
declare global {
  var _pgPool: Pool | undefined;
}

const rawConn =
  process.env.DATABASE_URL ||
  "postgresql://postgres.gznvueeroscdfymfuyxf:XQ3FttXtDTdiL46M@aws-0-eu-north-1.pooler.supabase.com:6543/postgres";
const connectionString = rawConn.split("?")[0];

export const pool =
  global._pgPool ||
  new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000,
  });

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === "development") {
    console.log("Executed query", { text: text.slice(0, 60), duration, rows: res.rowCount });
  }
  return res;
}

export default pool;
