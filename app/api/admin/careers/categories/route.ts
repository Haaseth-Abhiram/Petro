import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET() {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const res = await query(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM jobs j WHERE j.category_id = c.id) as job_count
      FROM job_categories c
      ORDER BY c.display_order ASC, c.created_at ASC;
    `);

    return NextResponse.json({
      success: true,
      categories: res.rows,
    });
  } catch (err: any) {
    console.error("Admin categories GET error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve job categories." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { name, slug: customSlug, description, displayOrder = 0, isActive = true } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Category name is required." },
        { status: 400 }
      );
    }

    let slug = customSlug
      ? customSlug
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      : name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

    if (!slug) slug = `cat-${Date.now()}`;

    const check = await query(`SELECT id FROM job_categories WHERE slug = $1;`, [slug]);
    if ((check.rowCount ?? 0) > 0) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const res = await query(
      `
      INSERT INTO job_categories (name, slug, description, display_order, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *;
    `,
      [name.trim(), slug, description || "", parseInt(String(displayOrder), 10) || 0, isActive]
    );

    const created = res.rows[0];

    await logAdminAction(
      admin?.email || "admin@petroeng.in",
      "JOB_CATEGORY_CREATED",
      "job_category",
      created.id,
      { name: created.name, slug: created.slug }
    );

    return NextResponse.json({
      success: true,
      message: "Job category created successfully.",
      category: created,
    });
  } catch (err: any) {
    console.error("Admin categories POST error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to create job category." },
      { status: 500 }
    );
  }
}
