import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const role = searchParams.get("role")?.trim() || "";
    const page = parseInt(searchParams.get("page") || "1", 10) || 1;
    const limit = parseInt(searchParams.get("limit") || "15", 10) || 15;
    const offset = (page - 1) * limit;

    let baseSql = `
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      baseSql += ` AND (
        a.full_name ILIKE $${params.length} OR 
        a.email ILIKE $${params.length} OR 
        a.application_reference ILIKE $${params.length} OR 
        a.phone ILIKE $${params.length}
      )`;
    }

    if (status && status !== "all") {
      params.push(status);
      baseSql += ` AND a.status = $${params.length}`;
    }

    if (role && role !== "all") {
      params.push(role);
      baseSql += ` AND (a.role_of_interest = $${params.length} OR a.job_title = $${params.length})`;
    }

    // Count total
    const countRes = await query(`SELECT COUNT(*) as total ${baseSql};`, params);
    const total = parseInt(countRes.rows[0].total, 10);

    // Fetch paginated data
    params.push(limit);
    const limitIdx = params.length;
    params.push(offset);
    const offsetIdx = params.length;

    const selectSql = `
      SELECT 
        a.id,
        a.application_reference,
        a.job_id,
        a.job_title,
        a.full_name,
        a.phone,
        a.email,
        a.role_of_interest,
        a.experience,
        a.linkedin_url,
        a.resume_original_name,
        a.resume_file_size,
        a.cover_note,
        a.status,
        a.submitted_at,
        a.updated_at,
        j.slug as job_slug,
        (SELECT COUNT(*) FROM application_notes an WHERE an.application_id = a.id) as notes_count
      ${baseSql}
      ORDER BY a.submitted_at DESC
      LIMIT $${limitIdx} OFFSET $${offsetIdx};
    `;

    const dataRes = await query(selectSql, params);

    return NextResponse.json({
      success: true,
      applications: dataRes.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err: any) {
    console.error("Admin applications GET error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to load candidate applications." },
      { status: 500 }
    );
  }
}
