const dns = require("dns");
const path = require("path");
const dotenv = require("dotenv");

// Load .env.local first (primary), then .env if present
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Force IPv4 DNS lookup first to eliminate 5-10 second IPv6 connection timeouts on Windows
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const { Pool } = require("pg");

const rawConn = process.env.DATABASE_URL;
if (!rawConn) {
  console.error("FATAL: DATABASE_URL is not set in environment or .env.local.");
}
const connectionString = (rawConn || "").split("?")[0];

const pool = new Pool({
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

pool.on("error", (err) => {
  console.warn("PostgreSQL pool client warning (idle socket reset):", err.message);
});

async function query(text, params) {
  if (!rawConn) {
    const err = new Error("DATABASE_URL is not configured in environment.");
    err.code = "NO_DB";
    throw err;
  }
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log("Executed query", { text: text.slice(0, 60), duration, rows: res.rowCount });
    }
    return res;
  } catch (err) {
    const msg = err?.message || "";
    if (
      msg.includes("Connection terminated") ||
      msg.includes("client has already been closed") ||
      msg.includes("timeout") ||
      msg.includes("ECONNRESET")
    ) {
      console.warn("Database query failed on stale socket, retrying once...", msg);
      return await pool.query(text, params);
    }
    throw err;
  }
}

module.exports = {
  pool,
  query,
};
