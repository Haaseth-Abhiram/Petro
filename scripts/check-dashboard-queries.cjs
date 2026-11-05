// Read-only check: runs the dashboard's SELECT queries against the configured database and prints only counts / errors.
const fs = require("fs");
const { Pool } = require("pg");

const src = fs.readFileSync(require("path").join(__dirname, "..", "lib", "db.ts"), "utf8");
const fallback = (src.match(/"(postgresql:\/\/[^"]+)"/) || [])[1];
const conn = (process.env.DATABASE_URL || fallback || "").split("?")[0];
const pool = new Pool({ connectionString: conn, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000 });

const Q = {
  products: "SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE is_published = true) AS published FROM products;",
  categories: "SELECT COUNT(*) AS total FROM product_categories;",
  rfqs: "SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='new') AS new FROM rfq_submissions;",
  enquiries: "SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='new') AS new FROM contact_messages;",
  applications: "SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='New') AS new FROM applications;",
  jobs: "SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='draft') AS draft FROM jobs WHERE status IN ('published','draft');",
  emptyCategories: "SELECT COUNT(*) AS total FROM product_categories c WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.category_slug = c.slug);",
  activityJoin: "SELECT SUM((SELECT COUNT(*) FROM rfq_submissions r WHERE r.created_at::date = d::date) + (SELECT COUNT(*) FROM contact_messages m WHERE m.created_at::date = d::date) + (SELECT COUNT(*) FROM applications a WHERE a.submitted_at::date = d::date)) AS events FROM generate_series(CURRENT_DATE - INTERVAL '13 days', CURRENT_DATE, INTERVAL '1 day') d;",
  topCategories: "SELECT c.name, COUNT(p.id) AS products FROM product_categories c LEFT JOIN products p ON p.category_slug = c.slug GROUP BY c.name, c.division ORDER BY products DESC LIMIT 3;",
  statusGroups: "SELECT status, COUNT(*) AS total FROM rfq_submissions GROUP BY status;",
  todayAndHired: "SELECT (SELECT COUNT(*) FROM contact_messages WHERE created_at::date = CURRENT_DATE) AS enquiries_today, (SELECT COUNT(*) FROM rfq_submissions WHERE created_at::date = CURRENT_DATE) AS rfqs_today, (SELECT COUNT(*) FROM applications WHERE submitted_at::date = CURRENT_DATE) AS applications_today, (SELECT COUNT(*) FROM applications WHERE status IN ('Selected','Hired')) AS hired, (SELECT COUNT(*) FROM jobs) AS jobs_total;",
  activity14d: "SELECT COUNT(*) AS days FROM generate_series(CURRENT_DATE - INTERVAL '13 days', CURRENT_DATE, INTERVAL '1 day') d;",
  recentApplications: "SELECT COUNT(*) AS total FROM (SELECT id, full_name, job_title, status, submitted_at AS created_at FROM applications ORDER BY submitted_at DESC LIMIT 5) x;",
};

(async () => {
  for (const [k, sql] of Object.entries(Q)) {
    try {
      const r = await pool.query(sql);
      console.log("OK  ", k.padEnd(18), JSON.stringify(r.rows[0]));
    } catch (e) {
      console.log("FAIL", k.padEnd(18), e.message);
    }
  }
  await pool.end();
})();
