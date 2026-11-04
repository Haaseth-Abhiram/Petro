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
    });
  } catch (err: any) {
    console.error("Dashboard stats error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard statistics", error: err.message },
      { status: 500 }
    );
  }
}
