import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET() {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const res = await query("SELECT * FROM industries ORDER BY display_order ASC, name ASC;");
    return NextResponse.json({ success: true, industries: res.rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { name, slug, tagline, short_overview, detailed_overview, image, common_requirements, relevant_products, relevant_services, display_order, is_published } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: "Industry name is required" }, { status: 400 });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const res = await query(
      `INSERT INTO industries (
        slug, name, tagline, short_overview, detailed_overview, image,
        common_requirements, relevant_products, relevant_services, display_order, is_published
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;`,
      [
        cleanSlug,
        name,
        tagline || "",
        short_overview || "",
        detailed_overview || "",
        image || "",
        JSON.stringify(common_requirements || []),
        JSON.stringify(relevant_products || []),
        JSON.stringify(relevant_services || []),
        display_order || 0,
        is_published ?? true,
      ]
    );

    const ind = res.rows[0];
    await logAdminAction(admin!.email, "CREATE_INDUSTRY", "industries", ind.id, { name: ind.name });
    return NextResponse.json({ success: true, industry: ind });
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
      return NextResponse.json({ success: false, message: "Industry ID is required" }, { status: 400 });
    }

    const res = await query(
      `UPDATE industries SET
        name = COALESCE($1, name),
        tagline = COALESCE($2, tagline),
        short_overview = COALESCE($3, short_overview),
        detailed_overview = COALESCE($4, detailed_overview),
        image = COALESCE($5, image),
        common_requirements = COALESCE($6, common_requirements),
        relevant_products = COALESCE($7, relevant_products),
        relevant_services = COALESCE($8, relevant_services),
        display_order = COALESCE($9, display_order),
        is_published = COALESCE($10, is_published)
      WHERE id = $11
      RETURNING *;`,
      [
        fields.name,
        fields.tagline,
        fields.short_overview,
        fields.detailed_overview,
        fields.image,
        fields.common_requirements ? JSON.stringify(fields.common_requirements) : null,
        fields.relevant_products ? JSON.stringify(fields.relevant_products) : null,
        fields.relevant_services ? JSON.stringify(fields.relevant_services) : null,
        fields.display_order,
        fields.is_published,
        id,
      ]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Industry not found" }, { status: 404 });
    }

    const ind = res.rows[0];
    await logAdminAction(admin!.email, "UPDATE_INDUSTRY", "industries", ind.id, { name: ind.name });
    return NextResponse.json({ success: true, industry: ind });
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
      return NextResponse.json({ success: false, message: "Industry ID is required" }, { status: 400 });
    }

    const res = await query("DELETE FROM industries WHERE id = $1 RETURNING id, name;", [id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Industry not found" }, { status: 404 });
    }

    await logAdminAction(admin!.email, "DELETE_INDUSTRY", "industries", id, { name: res.rows[0].name });
    return NextResponse.json({ success: true, message: "Industry deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
