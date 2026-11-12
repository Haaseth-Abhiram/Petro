const express = require("express");
const { query } = require("../db");
const { requireAdmin } = require("../auth");

const router = express.Router();

let memoryCache = null;
const CACHE_TTL_MS = 5000;

router.get("/stats", requireAdmin, async (req, res) => {
  const forceRefresh = req.query.refresh === "true";
  const now = Date.now();

  if (!forceRefresh && memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return res.json(memoryCache.data);
  }

  try {
    const [
      coreRes,
      recentEnquiriesRes,
      recentRfqsRes,
      recentLogsRes,
      actRes,
      topRes,
      appsRes,
      statusRes,
      insightsRes,
    ] = await Promise.all([
      // 1. Consolidated Core Counters
      query(`
        SELECT
          (SELECT json_build_object('total', COUNT(*), 'published', COUNT(*) FILTER (WHERE is_published = true)) FROM products) AS products,
          (SELECT json_build_object('total', COUNT(*), 'chemicals', COUNT(*) FILTER (WHERE division = 'chemicals'), 'instrumentation', COUNT(*) FILTER (WHERE division = 'instrumentation')) FROM product_categories) AS categories,
          (SELECT json_build_object('total', COUNT(*), 'new', COUNT(*) FILTER (WHERE status = 'new')) FROM contact_messages) AS enquiries,
          (SELECT json_build_object('total', COUNT(*), 'new', COUNT(*) FILTER (WHERE status = 'new')) FROM rfq_submissions) AS rfqs,
          (SELECT json_build_object('total', COUNT(*), 'new', COUNT(*) FILTER (WHERE status = 'New')) FROM applications) AS applications,
          (SELECT COUNT(*) FROM documents WHERE is_published = true) AS documents,
          (SELECT COUNT(*) FROM services WHERE is_published = true) AS services,
          (SELECT COUNT(*) FROM industries WHERE is_published = true) AS industries,
          (SELECT COUNT(*) FROM admin_users WHERE role = 'Pending' OR role IS NULL) AS pending_roles,
          (SELECT COUNT(*) FROM admin_users) AS total_users;
      `),
      // 2. Recent Enquiries
      query("SELECT id, full_name, company_name, email, subject, status, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5;"),
      // 3. Recent RFQs
      query("SELECT id, full_name, company_name, email, product_name, quantity, status, created_at FROM rfq_submissions ORDER BY created_at DESC LIMIT 5;"),
      // 4. Recent Audit Logs
      query("SELECT id, admin_email, action, entity_type, details, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 6;"),
      // 5. 14-Day Activity
      query(`
        SELECT to_char(d::date, 'YYYY-MM-DD') AS day,
          (SELECT COUNT(*) FROM rfq_submissions r WHERE r.created_at::date = d::date) AS rfqs,
          (SELECT COUNT(*) FROM contact_messages m WHERE m.created_at::date = d::date) AS enquiries,
          (SELECT COUNT(*) FROM applications a WHERE a.submitted_at::date = d::date) AS applications
        FROM generate_series(CURRENT_DATE - INTERVAL '13 days', CURRENT_DATE, INTERVAL '1 day') d
        ORDER BY d;
      `),
      // 6. Top Categories
      query(`SELECT c.name, c.division, COUNT(p.id) AS products FROM product_categories c LEFT JOIN products p ON p.category_slug = c.slug GROUP BY c.name, c.division ORDER BY products DESC, c.name LIMIT 6;`),
      // 7. Recent Applications
      query("SELECT id, full_name, job_title, status, submitted_at AS created_at FROM applications ORDER BY submitted_at DESC LIMIT 5;"),
      // 8. Status Breakdown
      query(`
        SELECT 'rfq' AS type, status, COUNT(*)::int AS total FROM rfq_submissions GROUP BY status
        UNION ALL
        SELECT 'enquiry' AS type, status, COUNT(*)::int AS total FROM contact_messages GROUP BY status;
      `),
      // 9. Consolidated Insights
      query(`
        SELECT
          (SELECT COUNT(*) FROM jobs WHERE status IN ('published','draft')) AS jobs_active,
          (SELECT COUNT(*) FROM jobs WHERE status = 'draft') AS jobs_draft,
          (SELECT COUNT(*) FROM product_categories c WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.category_slug = c.slug)) AS empty_categories,
          (SELECT MIN(created_at) FROM contact_messages WHERE status = 'new') AS oldest_enquiry,
          (SELECT MIN(created_at) FROM rfq_submissions WHERE status = 'new') AS oldest_rfq,
          (SELECT COUNT(*) FROM contact_messages WHERE created_at::date = CURRENT_DATE) AS enquiries_today,
          (SELECT COUNT(*) FROM rfq_submissions WHERE created_at::date = CURRENT_DATE) AS rfqs_today,
          (SELECT COUNT(*) FROM applications WHERE submitted_at::date = CURRENT_DATE) AS applications_today,
          (SELECT COUNT(*) FROM applications WHERE status IN ('Selected','Hired')) AS hired,
          (SELECT COUNT(*) FROM jobs) AS jobs_total;
      `),
    ]);

    const cRow = coreRes.rows[0] || {};
    const insRow = insightsRes.rows[0] || {};

    const stats = {
      products: {
        total: parseInt(cRow.products?.total || "0", 10),
        published: parseInt(cRow.products?.published || "0", 10),
      },
      categories: {
        total: parseInt(cRow.categories?.total || "0", 10),
        chemicals: parseInt(cRow.categories?.chemicals || "0", 10),
        instrumentation: parseInt(cRow.categories?.instrumentation || "0", 10),
      },
      enquiries: {
        total: parseInt(cRow.enquiries?.total || "0", 10),
        new: parseInt(cRow.enquiries?.new || "0", 10),
      },
      rfqs: {
        total: parseInt(cRow.rfqs?.total || "0", 10),
        new: parseInt(cRow.rfqs?.new || "0", 10),
      },
      applications: {
        total: parseInt(cRow.applications?.total || "0", 10),
        new: parseInt(cRow.applications?.new || "0", 10),
      },
      documents: parseInt(cRow.documents || "0", 10),
      services: parseInt(cRow.services || "0", 10),
      industries: parseInt(cRow.industries || "0", 10),
      pendingRoles: parseInt(cRow.pending_roles || "0", 10),
      totalUsers: parseInt(cRow.total_users || "0", 10),
    };

    const insights = {
      openJobs: +(insRow.jobs_active || 0) - +(insRow.jobs_draft || 0),
      draftJobs: +(insRow.jobs_draft || 0),
      emptyCategories: +(insRow.empty_categories || 0),
      oldestNewEnquiry: insRow.oldest_enquiry || null,
      oldestNewRfq: insRow.oldest_rfq || null,
      enquiriesToday: +(insRow.enquiries_today || 0),
      rfqsToday: +(insRow.rfqs_today || 0),
      applicationsToday: +(insRow.applications_today || 0),
      hired: +(insRow.hired || 0),
      jobsTotal: +(insRow.jobs_total || 0),
    };

    const activity = actRes.rows.map((r) => ({
      day: r.day,
      rfqs: +r.rfqs,
      enquiries: +r.enquiries,
      applications: +r.applications,
    }));

    const topCategories = topRes.rows.map((r) => ({
      name: r.name,
      division: r.division,
      products: +r.products,
    }));

    const rfqStatus = statusRes.rows
      .filter((r) => r.type === "rfq")
      .map((r) => ({ status: r.status, total: +r.total }));

    const enquiryStatus = statusRes.rows
      .filter((r) => r.type === "enquiry")
      .map((r) => ({ status: r.status, total: +r.total }));

    const payload = {
      success: true,
      stats,
      recentEnquiries: recentEnquiriesRes.rows,
      recentRfqs: recentRfqsRes.rows,
      recentLogs: recentLogsRes.rows,
      activity,
      topCategories,
      recentApplications: appsRes.rows,
      rfqStatus,
      enquiryStatus,
      insights,
    };

    memoryCache = {
      data: payload,
      timestamp: Date.now(),
    };

    return res.json(payload);
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch dashboard statistics", error: err.message });
  }
});

module.exports = router;
