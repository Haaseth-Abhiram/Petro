import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const exportCsv = searchParams.get("export") === "csv";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let dateFilter = "";
    const params: any[] = [];
    if (startDate) {
      params.push(startDate);
      dateFilter += ` AND a.submitted_at >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      dateFilter += ` AND a.submitted_at <= $${params.length}`;
    }

    // CSV Export Workflow
    if (exportCsv) {
      const exportRes = await query(
        `
        SELECT 
          a.application_reference,
          a.full_name,
          a.email,
          a.phone,
          a.role_of_interest,
          a.experience,
          a.status,
          a.linkedin_url,
          a.submitted_at
        FROM applications a
        WHERE 1=1 ${dateFilter}
        ORDER BY a.submitted_at DESC;
      `,
        params
      );

      const headers = [
        "Reference",
        "Full Name",
        "Email",
        "Phone",
        "Position",
        "Experience",
        "Status",
        "LinkedIn URL",
        "Submitted Date",
      ];

      const rows = exportRes.rows.map((r) => [
        `"${r.application_reference || ""}"`,
        `"${(r.full_name || "").replace(/"/g, '""')}"`,
        `"${r.email || ""}"`,
        `"${r.phone || ""}"`,
        `"${(r.role_of_interest || "").replace(/"/g, '""')}"`,
        `"${r.experience || ""}"`,
        `"${r.status || ""}"`,
        `"${(r.linkedin_url || "").replace(/"/g, '""')}"`,
        `"${r.submitted_at ? new Date(r.submitted_at).toISOString().split("T")[0] : ""}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="petro_candidate_applications_${Date.now()}.csv"`,
        },
      });
    }

    // 1. Applications by Job
    const byJobRes = await query(`
      SELECT 
        COALESCE(role_of_interest, 'General Application') as role,
        COUNT(*) as count
      FROM applications a
      WHERE 1=1 ${dateFilter}
      GROUP BY role_of_interest
      ORDER BY count DESC;
    `, params);

    // 2. Applications by Status
    const byStatusRes = await query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM applications a
      WHERE 1=1 ${dateFilter}
      GROUP BY status
      ORDER BY count DESC;
    `, params);

    // 3. Applications by Experience
    const byExpRes = await query(`
      SELECT 
        COALESCE(experience, 'Not specified') as experience,
        COUNT(*) as count
      FROM applications a
      WHERE 1=1 ${dateFilter}
      GROUP BY experience
      ORDER BY count DESC;
    `, params);

    // 4. Monthly Submissions Trend (last 12 months)
    const trendRes = await query(`
      SELECT 
        TO_CHAR(submitted_at, 'YYYY-MM-DD') as period,
        DATE_TRUNC('day', submitted_at) as sort_date,
        COUNT(*) as count
      FROM applications a
      WHERE 1=1 ${dateFilter}
      GROUP BY period, sort_date
      ORDER BY sort_date ASC
      LIMIT 30;
    `, params);

    // 5. Job Status Summary
    const jobStatusRes = await query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM jobs
      GROUP BY status;
    `);

    // 6. Overall Funnel Stats
    const statusMap: Record<string, number> = {};
    let totalApps = 0;
    byStatusRes.rows.forEach((r) => {
      const cnt = parseInt(r.count, 10) || 0;
      statusMap[r.status] = cnt;
      totalApps += cnt;
    });

    const stats = {
      totalApplications: totalApps,
      new: statusMap["New"] || 0,
      underReview: statusMap["Under Review"] || 0,
      shortlisted: statusMap["Shortlisted"] || 0,
      interview: (statusMap["Interview Scheduled"] || 0) + (statusMap["Interview"] || 0),
      selected: statusMap["Selected"] || 0,
      rejected: statusMap["Rejected"] || 0,
    };

    const byPosition = byJobRes.rows.map((r) => ({
      role: r.role || "General Application",
      count: parseInt(r.count, 10) || 0,
    }));

    const timeline = trendRes.rows.map((r) => ({
      date: r.period,
      count: parseInt(r.count, 10) || 0,
    }));

    return NextResponse.json({
      success: true,
      stats,
      byPosition,
      byJob: byPosition,
      byStatus: byStatusRes.rows.map((r) => ({ status: r.status, count: parseInt(r.count, 10) || 0 })),
      byExperience: byExpRes.rows.map((r) => ({ experience: r.experience, count: parseInt(r.count, 10) || 0 })),
      timeline,
      trends: timeline,
      jobStatuses: jobStatusRes.rows.map((r) => ({ status: r.status, count: parseInt(r.count, 10) || 0 })),
      funnel: {
        total: totalApps,
        shortlisted: stats.shortlisted,
        interview: stats.interview,
        selected: stats.selected,
        conversionRate: totalApps > 0 ? ((stats.selected / totalApps) * 100).toFixed(1) : "0.0",
      },
    });
  } catch (err: any) {
    console.error("Admin reports GET error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to generate recruitment reports." },
      { status: 500 }
    );
  }
}
