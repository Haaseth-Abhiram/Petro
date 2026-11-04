import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { id } = params;

    // 1. Candidate Application record
    const appRes = await query(
      `
      SELECT 
        a.*,
        j.slug as job_slug,
        j.department as job_department
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE a.id = $1
      LIMIT 1;
    `,
      [id]
    );

    if (appRes.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Candidate application not found." },
        { status: 404 }
      );
    }

    const application = appRes.rows[0];

    // 2. Notes
    const notesRes = await query(
      `
      SELECT * FROM application_notes 
      WHERE application_id = $1 
      ORDER BY created_at DESC;
    `,
      [id]
    );

    // 3. Status History
    const historyRes = await query(
      `
      SELECT * FROM application_status_history 
      WHERE application_id = $1 
      ORDER BY created_at DESC;
    `,
      [id]
    );

    return NextResponse.json({
      success: true,
      application,
      notes: notesRes.rows,
      history: historyRes.rows,
    });
  } catch (err: any) {
    console.error("Admin application detail error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to load candidate application details." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { id } = params;
    const checkRes = await query(
      `SELECT id, application_reference, full_name FROM applications WHERE id = $1;`,
      [id]
    );

    if (checkRes.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Candidate application not found." },
        { status: 404 }
      );
    }

    const app = checkRes.rows[0];
    await query(`DELETE FROM applications WHERE id = $1;`, [id]);

    await logAdminAction(
      admin?.email || "admin@petroeng.in",
      "APPLICATION_DELETED",
      "application",
      id,
      { reference: app.application_reference, name: app.full_name }
    );

    return NextResponse.json({
      success: true,
      message: `Application ${app.application_reference} has been removed.`,
    });
  } catch (err: any) {
    console.error("Admin application DELETE error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete candidate application." },
      { status: 500 }
    );
  }
}
