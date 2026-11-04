import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { id } = params;
    const body = await req.json();
    const { note } = body;

    if (!note || !note.trim()) {
      return NextResponse.json(
        { success: false, message: "Note text cannot be empty." },
        { status: 400 }
      );
    }

    const checkRes = await query(`SELECT id, application_reference FROM applications WHERE id = $1;`, [id]);
    if (checkRes.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Application not found." },
        { status: 404 }
      );
    }

    const res = await query(
      `
      INSERT INTO application_notes (
        application_id,
        admin_email,
        admin_name,
        note,
        created_at
      )
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `,
      [
        id,
        admin?.email || "admin@petroeng.in",
        admin?.name || "Administrator",
        note.trim(),
      ]
    );

    await logAdminAction(
      admin?.email || "admin@petroeng.in",
      "APPLICATION_NOTE_ADDED",
      "application",
      id,
      { notePreview: note.slice(0, 50) }
    );

    return NextResponse.json({
      success: true,
      message: "Note added successfully.",
      note: res.rows[0],
    });
  } catch (err: any) {
    console.error("Admin add note error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to add recruiter note." },
      { status: 500 }
    );
  }
}
