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
        `"${r.application_reference}"`,
        `"${(r.full_name || "").replace(/"/g, '""')}"`,
        `"${r.email}"`,
        `"${r.phone}"`,
        `"${(r.role_of_interest || "").replace(/"/g, '""')}"`,
        `"${r.experience}"`,
        `"${r.status}"`,
        `"${(r.linkedin_url || "").replace(/"/g, '""')}"`,
        `"${new Date(r.submitted_at).toISOString().split("T")[0]}"`,
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
        role_of_interest as role,
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
        experience,
        COUNT(*) as count
      FROM applications a
      WHERE 1=1 ${dateFilter}
      GROUP BY experience
      ORDER BY count DESC;
    `, params);

    // 4. Monthly Submissions Trend (last 6 months)
    const trendRes = await query(`
      SELECT 
        TO_CHAR(submitted_at, 'Mon YYYY') as period,
        DATE_TRUNC('month', submitted_at) as sort_date,
        COUNT(*) as count
      FROM applications a
      WHERE 1=1 ${dateFilter}
      GROUP BY period, sort_date
      ORDER BY sort_date ASC
      LIMIT 12;
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
    const totalApps = byStatusRes.rows.reduce((acc, cur) => acc + parseInt(cur.count, 10), 0);
    const selectedCount = byStatusRes.rows.find((r) => r.status === "Selected")?.count || 0;
    const interviewCount = byStatusRes.rows.find((r) => r.status === "Interview")?.count || 0;
    const shortlistedCount = byStatusRes.rows.find((r) => r.status === "Shortlisted")?.count || 0;

    return NextResponse.json({
      success: true,
      byJob: byJobRes.rows.map((r) => ({ role: r.role, count: parseInt(r.count, 10) })),
      byStatus: byStatusRes.rows.map((r) => ({ status: r.status, count: parseInt(r.count, 10) })),
      byExperience: byExpRes.rows.map((r) => ({ experience: r.experience, count: parseInt(r.count, 10) })),
      trends: trendRes.rows.map((r) => ({ period: r.period, count: parseInt(r.count, 10) })),
      jobStatuses: jobStatusRes.rows.map((r) => ({ status: r.status, count: parseInt(r.count, 10) })),
      funnel: {
        total: totalApps,
        shortlisted: parseInt(shortlistedCount, 10),
        interview: parseInt(interviewCount, 10),
        selected: parseInt(selectedCount, 10),
        conversionRate: totalApps > 0 ? ((parseInt(selectedCount, 10) / totalApps) * 100).toFixed(1) : "0.0",
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
