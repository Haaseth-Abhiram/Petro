import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

const VALID_STATUSES = [
  "New",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { id } = params;
    const body = await req.json();
    const { status, note } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid status. Valid statuses are: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const currentRes = await query(
      `SELECT id, status, application_reference, full_name, email FROM applications WHERE id = $1;`,
      [id]
    );

    if (currentRes.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Application not found." },
        { status: 404 }
      );
    }

    const current = currentRes.rows[0];
    const previousStatus = current.status;

    // Update application status
    await query(
      `
      UPDATE applications 
      SET status = $1, updated_at = NOW() 
      WHERE id = $2;
    `,
      [status, id]
    );

    // Record in history table
    await query(
      `
      INSERT INTO application_status_history (
        application_id,
        previous_status,
        new_status,
        changed_by,
        note,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW());
    `,
      [
        id,
        previousStatus,
        status,
        admin?.name || admin?.email || "Recruiter",
        note || `Status updated to ${status}`,
      ]
    );

    await logAdminAction(
      admin?.email || "admin@petroeng.in",
      "APPLICATION_STATUS_UPDATED",
      "application",
      id,
      {
        reference: current.application_reference,
        previousStatus,
        newStatus: status,
        note,
      }
    );

    return NextResponse.json({
      success: true,
      message: `Candidate status updated to "${status}".`,
      previousStatus,
      newStatus: status,
    });
  } catch (err: any) {
    console.error("Admin status update error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update candidate status." },
      { status: 500 }
    );
  }
}
