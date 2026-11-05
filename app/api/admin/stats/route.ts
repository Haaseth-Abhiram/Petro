import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET() {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const [
      productsCountRes,
      categoriesCountRes,
      enquiriesCountRes,
      newEnquiriesCountRes,
      rfqCountRes,
      newRfqCountRes,
      docsCountRes,
      servicesCountRes,
      industriesCountRes,
      recentEnquiriesRes,
      recentRfqsRes,
      recentLogsRes,
      appsCountRes,
    ] = await Promise.all([
      query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE is_published = true) AS published FROM products;"),
      query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE division = 'chemicals') AS chemicals, COUNT(*) FILTER (WHERE division = 'instrumentation') AS instrumentation FROM product_categories;"),
      query("SELECT COUNT(*) AS total FROM contact_messages;"),
      query("SELECT COUNT(*) AS total FROM contact_messages WHERE status = 'new';"),
      query("SELECT COUNT(*) AS total FROM rfq_submissions;"),
      query("SELECT COUNT(*) AS total FROM rfq_submissions WHERE status = 'new';"),
      query("SELECT COUNT(*) AS total FROM documents WHERE is_published = true;"),
      query("SELECT COUNT(*) AS total FROM services WHERE is_published = true;"),
      query("SELECT COUNT(*) AS total FROM industries WHERE is_published = true;"),
      query("SELECT id, full_name, company_name, email, subject, status, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5;"),
      query("SELECT id, full_name, company_name, email, product_name, quantity, status, created_at FROM rfq_submissions ORDER BY created_at DESC LIMIT 5;"),
      query("SELECT id, admin_email, action, entity_type, details, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 6;"),
      query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status = 'New') AS new FROM applications;"),
    ]);

    // Extra insight data for the dashboard. Failures here must never break the core stats.
    let activity: any[] = [];
    let topCategories: any[] = [];
    let recentApplications: any[] = [];
    let rfqStatus: any[] = [];
    let enquiryStatus: any[] = [];
    let insights: any = {};
    try {
      const [actRes, topRes, appsRes, rfqStRes, enqStRes, jobsRes, emptyCatRes, oldEnqRes, oldRfqRes, todayRes] = await Promise.all([
        query(`
          SELECT to_char(d::date, 'YYYY-MM-DD') AS day,
            (SELECT COUNT(*) FROM rfq_submissions r WHERE r.created_at::date = d::date) AS rfqs,
            (SELECT COUNT(*) FROM contact_messages m WHERE m.created_at::date = d::date) AS enquiries,
            (SELECT COUNT(*) FROM applications a WHERE a.submitted_at::date = d::date) AS applications
          FROM generate_series(CURRENT_DATE - INTERVAL '13 days', CURRENT_DATE, INTERVAL '1 day') d
          ORDER BY d;`),
        query(`SELECT c.name, c.division, COUNT(p.id) AS products FROM product_categories c LEFT JOIN products p ON p.category_slug = c.slug GROUP BY c.name, c.division ORDER BY products DESC, c.name LIMIT 6;`),
        query("SELECT id, full_name, job_title, status, submitted_at AS created_at FROM applications ORDER BY submitted_at DESC LIMIT 5;"),
        query("SELECT status, COUNT(*) AS total FROM rfq_submissions GROUP BY status;"),
        query("SELECT status, COUNT(*) AS total FROM contact_messages GROUP BY status;"),
        query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status = 'draft') AS draft FROM jobs WHERE status IN ('published','draft');"),
        query("SELECT COUNT(*) AS total FROM product_categories c WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.category_slug = c.slug);"),
        query("SELECT MIN(created_at) AS oldest FROM contact_messages WHERE status = 'new';"),
        query("SELECT MIN(created_at) AS oldest FROM rfq_submissions WHERE status = 'new';"),
        query(`SELECT
          (SELECT COUNT(*) FROM contact_messages WHERE created_at::date = CURRENT_DATE) AS enquiries_today,
          (SELECT COUNT(*) FROM rfq_submissions WHERE created_at::date = CURRENT_DATE) AS rfqs_today,
          (SELECT COUNT(*) FROM applications WHERE submitted_at::date = CURRENT_DATE) AS applications_today,
          (SELECT COUNT(*) FROM applications WHERE status IN ('Selected','Hired')) AS hired,
          (SELECT COUNT(*) FROM jobs) AS jobs_total;`),
      ]);
      insights = {
        openJobs: +(jobsRes.rows[0]?.total || 0) - +(jobsRes.rows[0]?.draft || 0),
        draftJobs: +(jobsRes.rows[0]?.draft || 0),
        emptyCategories: +(emptyCatRes.rows[0]?.total || 0),
        oldestNewEnquiry: oldEnqRes.rows[0]?.oldest || null,
        oldestNewRfq: oldRfqRes.rows[0]?.oldest || null,
        enquiriesToday: +(todayRes.rows[0]?.enquiries_today || 0),
        rfqsToday: +(todayRes.rows[0]?.rfqs_today || 0),
        applicationsToday: +(todayRes.rows[0]?.applications_today || 0),
        hired: +(todayRes.rows[0]?.hired || 0),
        jobsTotal: +(todayRes.rows[0]?.jobs_total || 0),
      };
      activity = actRes.rows.map((r: any) => ({ day: r.day, rfqs: +r.rfqs, enquiries: +r.enquiries, applications: +r.applications }));
      topCategories = topRes.rows.map((r: any) => ({ name: r.name, division: r.division, products: +r.products }));
      recentApplications = appsRes.rows;
      rfqStatus = rfqStRes.rows.map((r: any) => ({ status: r.status, total: +r.total }));
      enquiryStatus = enqStRes.rows.map((r: any) => ({ status: r.status, total: +r.total }));
    } catch (e: any) {
      console.warn("Dashboard extra insights unavailable:", e.message);
    }

    return NextResponse.json({
      success: true,
      stats: {
        products: {
          total: parseInt(productsCountRes.rows[0]?.total || "0", 10),
          published: parseInt(productsCountRes.rows[0]?.published || "0", 10),
        },
        categories: {
          total: parseInt(categoriesCountRes.rows[0]?.total || "0", 10),
          chemicals: parseInt(categoriesCountRes.rows[0]?.chemicals || "0", 10),
          instrumentation: parseInt(categoriesCountRes.rows[0]?.instrumentation || "0", 10),
        },
        enquiries: {
          total: parseInt(enquiriesCountRes.rows[0]?.total || "0", 10),
          new: parseInt(newEnquiriesCountRes.rows[0]?.total || "0", 10),
        },
        rfqs: {
          total: parseInt(rfqCountRes.rows[0]?.total || "0", 10),
          new: parseInt(newRfqCountRes.rows[0]?.total || "0", 10),
        },
        applications: {
          total: parseInt(appsCountRes.rows[0]?.total || "0", 10),
          new: parseInt(appsCountRes.rows[0]?.new || "0", 10),
        },
        documents: parseInt(docsCountRes.rows[0]?.total || "0", 10),
        services: parseInt(servicesCountRes.rows[0]?.total || "0", 10),
        industries: parseInt(industriesCountRes.rows[0]?.total || "0", 10),
      },
      recentEnquiries: recentEnquiriesRes.rows,
      recentRfqs: recentRfqsRes.rows,
      recentLogs: recentLogsRes.rows,
      activity,
      topCategories,
      recentApplications,
      rfqStatus,
      enquiryStatus,
      insights,
    });
  } catch (err: any) {
    console.error("Dashboard stats error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard statistics", error: err.message },
      { status: 500 }
    );
  }
}
