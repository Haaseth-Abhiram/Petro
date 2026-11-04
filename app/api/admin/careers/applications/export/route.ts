import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "excel";
    const status = searchParams.get("status");
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    if (status && status !== "all") {
      params.push(status);
      whereClause += ` AND a.status = $${params.length}`;
    }

    if (role && role !== "all") {
      params.push(role);
      whereClause += ` AND a.role_of_interest = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      whereClause += ` AND (LOWER(a.full_name) LIKE $${params.length} OR LOWER(a.email) LIKE $${params.length} OR LOWER(a.application_reference) LIKE $${params.length})`;
    }

    const res = await query(
      `
      SELECT 
        a.id,
        a.application_reference,
        a.full_name,
        a.email,
        a.phone,
        a.role_of_interest,
        a.experience,
        a.status,
        a.linkedin_url,
        a.resume_original_name,
        a.resume_file_size,
        a.cover_note,
        a.submitted_at,
        (SELECT COUNT(*) FROM application_notes an WHERE an.application_id = a.id) as notes_count
      FROM applications a
      ${whereClause}
      ORDER BY a.submitted_at DESC;
    `,
      params
    );

    const applications = res.rows;

    // 1. EXCEL EXPORT (.csv with UTF-8 BOM)
    if (format === "excel" || format === "csv") {
      const headers = [
        "Application Reference",
        "Candidate Full Name",
        "Email Address",
        "Phone Number",
        "Position / Role",
        "Experience Level",
        "Hiring Status",
        "Resume Filename",
        "Resume Size (KB)",
        "LinkedIn Profile",
        "Cover Note",
        "Submission Date",
      ];

      const rows = applications.map((app) => [
        `"${app.application_reference || ""}"`,
        `"${(app.full_name || "").replace(/"/g, '""')}"`,
        `"${app.email || ""}"`,
        `"${app.phone || ""}"`,
        `"${(app.role_of_interest || "").replace(/"/g, '""')}"`,
        `"${app.experience || ""}"`,
        `"${app.status || ""}"`,
        `"${(app.resume_original_name || "").replace(/"/g, '""')}"`,
        `"${app.resume_file_size ? Math.round(app.resume_file_size / 1024) : 0}"`,
        `"${(app.linkedin_url || "").replace(/"/g, '""')}"`,
        `"${(app.cover_note || "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`,
        `"${app.submitted_at ? new Date(app.submitted_at).toLocaleDateString("en-IN") : ""}"`,
      ]);

      // Prepend UTF-8 Byte Order Mark (BOM) so Excel opens UTF-8 text perfectly
      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="Petro_Candidate_Applications_${Date.now()}.csv"`,
        },
      });
    }

    // 2. PDF / PRINTABLE REPORT FORMAT
    if (format === "pdf") {
      const dateStr = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const rowsHtml = applications
        .map(
          (app, idx) => `
        <tr style="border-bottom: 1px solid #E5E7EB; ${idx % 2 === 1 ? "background-color: #F9FAFB;" : ""}">
          <td style="padding: 8px 10px; font-family: monospace; font-weight: bold; color: #FF4B32;">${app.application_reference || "—"}</td>
          <td style="padding: 8px 10px;">
            <div style="font-weight: bold; color: #17191C;">${app.full_name || "—"}</div>
            <div style="font-size: 11px; color: #5F6871;">${app.email || ""} &bull; ${app.phone || ""}</div>
          </td>
          <td style="padding: 8px 10px;">
            <div style="font-weight: 600; color: #17191C;">${app.role_of_interest || "—"}</div>
            <div style="font-size: 11px; color: #5F6871;">${app.experience || ""}</div>
          </td>
          <td style="padding: 8px 10px;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; ${getStatusStyle(
              app.status
            )}">
              ${app.status || "New"}
            </span>
          </td>
          <td style="padding: 8px 10px; font-size: 11px; color: #5F6871;">
            ${app.resume_original_name || "Resume on file"}
          </td>
          <td style="padding: 8px 10px; font-size: 11px; color: #5F6871; white-space: nowrap;">
            ${app.submitted_at ? new Date(app.submitted_at).toLocaleDateString("en-IN") : "—"}
          </td>
        </tr>
      `
        )
        .join("");

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Candidate Applications Report - Petro Engineering</title>
  <style>
    @page { size: A4 landscape; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #17191C; margin: 0; padding: 20px; font-size: 12px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #FF4B32; padding-bottom: 12px; margin-bottom: 16px; }
    .logo-box { font-size: 20px; font-weight: 900; color: #17191C; letter-spacing: -0.5px; }
    .logo-box span { color: #FF4B32; }
    .title { font-size: 18px; font-weight: 900; margin: 0; color: #17191C; }
    .meta { font-size: 11px; color: #5F6871; margin-top: 4px; }
    .stats-bar { display: flex; gap: 16px; margin-bottom: 16px; }
    .stat-pill { background: #F5F6F7; border: 1px solid #D8DDE2; padding: 6px 12px; border-radius: 8px; font-size: 11px; }
    .stat-pill strong { font-size: 13px; color: #FF4B32; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { background: #17191C; color: #FFFFFF; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 10px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background: #FFF1EF; border: 1px solid #FF4B32; border-radius: 8px; padding: 10px 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
    <div><strong>Ready to Print / Save as PDF:</strong> Use your browser print dialog to save as PDF.</div>
    <button onclick="window.print()" style="background: #FF4B32; color: #fff; border: none; padding: 6px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">Print / Save PDF</button>
  </div>

  <div class="header">
    <div>
      <div class="logo-box">PETRO <span>ENGINEERING</span></div>
      <div class="meta">Candidate Applications &amp; Recruitment Roster</div>
    </div>
    <div style="text-align: right;">
      <div class="title">Candidate Applications Summary</div>
      <div class="meta">Generated: ${dateStr} &bull; Total Candidates: ${applications.length}</div>
    </div>
  </div>

  <div class="stats-bar">
    <div class="stat-pill">Total Candidates: <strong>${applications.length}</strong></div>
    <div class="stat-pill">New: <strong>${applications.filter((a) => a.status === "New").length}</strong></div>
    <div class="stat-pill">Under Review: <strong>${applications.filter((a) => a.status === "Under Review").length}</strong></div>
    <div class="stat-pill">Shortlisted: <strong>${applications.filter((a) => a.status === "Shortlisted").length}</strong></div>
    <div class="stat-pill">Interviews: <strong>${applications.filter((a) => (a.status || "").includes("Interview")).length}</strong></div>
    <div class="stat-pill">Selected: <strong>${applications.filter((a) => a.status === "Selected").length}</strong></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Reference</th>
        <th>Candidate Details</th>
        <th>Position &amp; Experience</th>
        <th>Status</th>
        <th>CV Attached</th>
        <th>Date Applied</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml || '<tr><td colspan="6" style="text-align:center; padding: 20px;">No applications found matching the selected criteria.</td></tr>'}
    </tbody>
  </table>

  <div style="margin-top: 24px; padding-top: 10px; border-top: 1px solid #D8DDE2; display: flex; justify-content: space-between; font-size: 10px; color: #929DA7;">
    <div>Confidential &bull; Petro Engineering Private Limited Internal Recruitment Use Only</div>
    <div>Page 1 of 1</div>
  </div>

  <script>
    window.onload = function() {
      // Auto trigger print prompt if parameter auto=true
      if (window.location.search.includes('auto=true')) {
        setTimeout(function() { window.print(); }, 500);
      }
    };
  </script>
</body>
</html>`;

      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    return NextResponse.json({ success: false, message: "Invalid format requested." }, { status: 400 });
  } catch (err: any) {
    console.error("Export error:", err);
    return NextResponse.json({ success: false, message: "Export failed." }, { status: 500 });
  }
}

function getStatusStyle(status: string): string {
  switch (status) {
    case "New":
      return "background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE;";
    case "Under Review":
      return "background: #FFFBEB; color: #B45309; border: 1px solid #FDE68A;";
    case "Shortlisted":
      return "background: #FAF5FF; color: #7E22CE; border: 1px solid #E9D5FF;";
    case "Interview":
    case "Interview Scheduled":
      return "background: #FFF7ED; color: #C2410C; border: 1px solid #FFEDD5;";
    case "Selected":
      return "background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0;";
    case "Rejected":
      return "background: #FFF1F2; color: #BE123C; border: 1px solid #FECDD3;";
    default:
      return "background: #F3F4F6; color: #374151; border: 1px solid #E5E7EB;";
  }
}
