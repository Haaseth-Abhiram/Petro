import dns from "dns";
import { Pool } from "pg";

// Force IPv4 DNS lookup first on Node.js to eliminate 5-10 second IPv6 connection timeouts on Windows
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

// Prevent multiple pool instances in Next.js development hot-reloading
declare global {
  var _pgPool: Pool | undefined;
}

const rawConn = process.env.DATABASE_URL || "";
const connectionString = rawConn.split("?")[0];

export const pool =
  global._pgPool ||
  new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  });

// Handle idle client disconnects cleanly without crashing process
pool.on("error", (err) => {
  console.warn("PostgreSQL pool idle client warning:", err.message);
});

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log("Executed query", { text: text.slice(0, 60), duration, rows: res.rowCount });
    }
    return res;
  } catch (err: any) {
    const msg = err?.message || "";
    // If connection dropped, idle socket timed out, or connection reset, retry once with a fresh client
    if (
      msg.includes("Connection terminated") ||
      msg.includes("client has already been closed") ||
      msg.includes("timeout") ||
      msg.includes("ECONNRESET")
    ) {
      console.warn("DB query failed, retrying once...", msg);
      return await pool.query(text, params);
    }
    throw err;
  }
}

export default pool;
