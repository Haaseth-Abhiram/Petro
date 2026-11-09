import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";
import { sendRfqStatusUpdateEmail } from "@/lib/email-service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    let sql = `SELECT * FROM rfq_submissions WHERE 1=1`;
    const params: any[] = [];

    if (search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(full_name) LIKE $${params.length} OR LOWER(company_name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR LOWER(product_name) LIKE $${params.length} OR LOWER(product_category) LIKE $${params.length})`;
    }

    if (status.trim() && status !== "all") {
      params.push(status.trim());
      sql += ` AND status = $${params.length}`;
    }

    sql += ` ORDER BY created_at DESC;`;

    const [result, countsRes] = await Promise.all([
      query(sql, params),
      query(`
        SELECT status, COUNT(*)::int AS count
        FROM rfq_submissions
        GROUP BY status;
      `),
    ]);

    const statusCounts: Record<string, number> = {};
    let totalAll = 0;
    (countsRes.rows || []).forEach((r: any) => {
      const s = r.status || "new";
      statusCounts[s] = r.count;
      totalAll += r.count;
    });

    return NextResponse.json({
      success: true,
      quoteRequests: result.rows,
      counts: statusCounts,
      totalAll,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { id, status, internal_notes, quote_amount } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Quote Request ID is required" }, { status: 400 });
    }

    const updateRes = await query(
      `UPDATE rfq_submissions SET
        status = COALESCE($1, status),
        internal_notes = COALESCE($2, internal_notes),
        quote_amount = COALESCE($3, quote_amount)
      WHERE id = $4
      RETURNING *;`,
      [status, internal_notes, quote_amount, id]
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Quote request not found" }, { status: 404 });
    }

    const updated = updateRes.rows[0];
    await logAdminAction(admin!.email, "UPDATE_RFQ_STATUS", "quote_requests", updated.id, {
      status: updated.status,
      company: updated.company_name,
      product: updated.product_name,
    });

    // Notify client's registered email with updated quotation specifications
    if (updated.email) {
      try {
        await sendRfqStatusUpdateEmail({
          id: updated.id,
          fullName: updated.full_name,
          email: updated.email,
          companyName: updated.company_name,
          productName: updated.product_name,
          quantity: updated.quantity,
          status: updated.status,
          quoteAmount: updated.quote_amount,
          internalNotes: updated.internal_notes,
          isNew: false,
        });
      } catch (emailErr: any) {
        console.warn("RFQ status email notification failed:", emailErr.message);
      }
    }

    return NextResponse.json({ success: true, quoteRequest: updated });
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
      return NextResponse.json({ success: false, message: "Quote Request ID is required" }, { status: 400 });
    }

    const delRes = await query("DELETE FROM rfq_submissions WHERE id = $1 RETURNING id, company_name, product_name;", [id]);
    if (delRes.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Quote request not found" }, { status: 404 });
    }

    await logAdminAction(admin!.email, "DELETE_RFQ", "quote_requests", id, {
      company: delRes.rows[0].company_name,
      product: delRes.rows[0].product_name,
    });

    return NextResponse.json({ success: true, message: "Quote request deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
