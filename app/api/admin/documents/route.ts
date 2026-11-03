import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let sql = `SELECT * FROM documents`;
    const params: any[] = [];

    if (category && category !== "all") {
      params.push(category);
      sql += ` WHERE category = $1`;
    }

    sql += ` ORDER BY created_at DESC;`;

    const res = await query(sql, params);
    return NextResponse.json({ success: true, documents: res.rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { title, category, type, description, file_url, file_size, is_published } = body;

    if (!title || !category || !type || !file_url) {
      return NextResponse.json(
        { success: false, message: "Title, category, type, and file URL are required." },
        { status: 400 }
      );
    }

    const res = await query(
      `INSERT INTO documents (title, category, type, description, file_url, file_size, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *;`,
      [title, category, type, description || "", file_url, file_size || "1.5 MB", is_published ?? true]
    );

    const doc = res.rows[0];
    await logAdminAction(admin!.email, "CREATE_DOCUMENT", "documents", doc.id, { title: doc.title });

    return NextResponse.json({ success: true, document: doc });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Document ID is required" }, { status: 400 });
    }

    const res = await query(
      `UPDATE documents SET
        title = COALESCE($1, title),
        category = COALESCE($2, category),
        type = COALESCE($3, type),
        description = COALESCE($4, description),
        file_url = COALESCE($5, file_url),
        file_size = COALESCE($6, file_size),
        is_published = COALESCE($7, is_published)
      WHERE id = $8
      RETURNING *;`,
      [fields.title, fields.category, fields.type, fields.description, fields.file_url, fields.file_size, fields.is_published, id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Document not found" }, { status: 404 });
    }

    const doc = res.rows[0];
    await logAdminAction(admin!.email, "UPDATE_DOCUMENT", "documents", doc.id, { title: doc.title });

    return NextResponse.json({ success: true, document: doc });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Document ID is required" }, { status: 400 });
    }

    const res = await query("DELETE FROM documents WHERE id = $1 RETURNING id, title;", [id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Document not found" }, { status: 404 });
    }

    await logAdminAction(admin!.email, "DELETE_DOCUMENT", "documents", id, { title: res.rows[0].title });

    return NextResponse.json({ success: true, message: "Document deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
