import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";
import { sendEnquiryStatusUpdateEmail } from "@/lib/email-service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    let sql = `SELECT * FROM contact_messages WHERE 1=1`;
    const params: any[] = [];

    if (search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(full_name) LIKE $${params.length} OR LOWER(company_name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR LOWER(subject) LIKE $${params.length})`;
    }

    if (status.trim() && status !== "all") {
      params.push(status.trim());
      sql += ` AND status = $${params.length}`;
    }

    sql += ` ORDER BY created_at DESC;`;

    const result = await query(sql, params);
    return NextResponse.json({ success: true, enquiries: result.rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { id, status, internal_notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Enquiry ID is required" }, { status: 400 });
    }

    const updateRes = await query(
      `UPDATE contact_messages SET
        status = COALESCE($1, status),
        internal_notes = COALESCE($2, internal_notes)
      WHERE id = $3
      RETURNING *;`,
      [status, internal_notes, id]
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Enquiry not found" }, { status: 404 });
    }

    const updated = updateRes.rows[0];
    await logAdminAction(admin!.email, "UPDATE_ENQUIRY_STATUS", "enquiries", updated.id, {
      status: updated.status,
      contact: updated.full_name,
    });

    // Notify registered email of the enquiry status update & administrative response
    if (updated.email) {
      try {
        await sendEnquiryStatusUpdateEmail({
          id: updated.id,
          fullName: updated.full_name,
          email: updated.email,
          companyName: updated.company_name,
          subject: updated.subject,
          status: updated.status,
          internalNotes: updated.internal_notes,
          isNew: false,
        });
      } catch (emailErr: any) {
        console.warn("Enquiry status email notification failed:", emailErr.message);
      }
    }

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Enquiry ID is required" }, { status: 400 });
    }

    const delRes = await query("DELETE FROM contact_messages WHERE id = $1 RETURNING id, full_name;", [id]);
    if (delRes.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Enquiry not found" }, { status: 404 });
    }

    await logAdminAction(admin!.email, "DELETE_ENQUIRY", "enquiries", id, {
      contact: delRes.rows[0].full_name,
    });

    return NextResponse.json({ success: true, message: "Enquiry deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
