import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET() {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const res = await query("SELECT * FROM services ORDER BY display_order ASC, title ASC;");
    return NextResponse.json({ success: true, services: res.rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { title, slug, short_desc, overview, icon_name, image, key_activities, benefits, display_order, is_published } = body;

    if (!title) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const res = await query(
      `INSERT INTO services (
        slug, title, short_desc, overview, icon_name, image,
        key_activities, benefits, display_order, is_published
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;`,
      [
        cleanSlug,
        title,
        short_desc || "",
        overview || "",
        icon_name || "Flame",
        image || "",
        JSON.stringify(key_activities || []),
        JSON.stringify(benefits || []),
        display_order || 0,
        is_published ?? true,
      ]
    );

    const s = res.rows[0];
    await logAdminAction(admin!.email, "CREATE_SERVICE", "services", s.id, { title: s.title });
    return NextResponse.json({ success: true, service: s });
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
      return NextResponse.json({ success: false, message: "Service ID is required" }, { status: 400 });
    }

    const res = await query(
      `UPDATE services SET
        title = COALESCE($1, title),
        short_desc = COALESCE($2, short_desc),
        overview = COALESCE($3, overview),
        icon_name = COALESCE($4, icon_name),
        image = COALESCE($5, image),
        key_activities = COALESCE($6, key_activities),
        benefits = COALESCE($7, benefits),
        display_order = COALESCE($8, display_order),
        is_published = COALESCE($9, is_published)
      WHERE id = $10
      RETURNING *;`,
      [
        fields.title,
        fields.short_desc,
        fields.overview,
        fields.icon_name,
        fields.image,
        fields.key_activities ? JSON.stringify(fields.key_activities) : null,
        fields.benefits ? JSON.stringify(fields.benefits) : null,
        fields.display_order,
        fields.is_published,
        id,
      ]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });
    }

    const s = res.rows[0];
    await logAdminAction(admin!.email, "UPDATE_SERVICE", "services", s.id, { title: s.title });
    return NextResponse.json({ success: true, service: s });
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
      return NextResponse.json({ success: false, message: "Service ID is required" }, { status: 400 });
    }

    const res = await query("DELETE FROM services WHERE id = $1 RETURNING id, title;", [id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });
    }

    await logAdminAction(admin!.email, "DELETE_SERVICE", "services", id, { title: res.rows[0].title });
    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
