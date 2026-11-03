import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const division = searchParams.get("division");

    let sql = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM product_categories c
      LEFT JOIN products p ON c.slug = p.category_slug
    `;
    const params: any[] = [];

    if (division && division !== "all") {
      params.push(division);
      sql += ` WHERE c.division = $1`;
    }

    sql += ` GROUP BY c.id ORDER BY c.division, c.display_order ASC, c.name ASC;`;

    const result = await query(sql, params);
    return NextResponse.json({ success: true, categories: result.rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const {
      slug,
      division,
      name,
      short_description,
      detailed_description,
      image,
      key_products,
      applications,
      standards,
      display_order,
      is_published,
    } = body;

    if (!name || !division) {
      return NextResponse.json(
        { success: false, message: "Category name and division are required." },
        { status: 400 }
      );
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const insertRes = await query(
      `INSERT INTO product_categories (
        slug, division, name, short_description, detailed_description,
        image, key_products, applications, standards, display_order, is_published
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;`,
      [
        cleanSlug,
        division,
        name,
        short_description || "",
        detailed_description || "",
        image || "",
        JSON.stringify(key_products || []),
        JSON.stringify(applications || []),
        JSON.stringify(standards || []),
        display_order || 0,
        is_published ?? true,
      ]
    );

    const newCat = insertRes.rows[0];
    await logAdminAction(admin!.email, "CREATE_CATEGORY", "categories", newCat.id, {
      name: newCat.name,
      slug: newCat.slug,
    });

    return NextResponse.json({ success: true, category: newCat });
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
      return NextResponse.json({ success: false, message: "Category ID is required" }, { status: 400 });
    }

    const updateRes = await query(
      `UPDATE product_categories SET
        name = COALESCE($1, name),
        division = COALESCE($2, division),
        short_description = COALESCE($3, short_description),
        detailed_description = COALESCE($4, detailed_description),
        image = COALESCE($5, image),
        key_products = COALESCE($6, key_products),
        applications = COALESCE($7, applications),
        standards = COALESCE($8, standards),
        display_order = COALESCE($9, display_order),
        is_published = COALESCE($10, is_published)
      WHERE id = $11
      RETURNING *;`,
      [
        fields.name,
        fields.division,
        fields.short_description,
        fields.detailed_description,
        fields.image,
        fields.key_products ? JSON.stringify(fields.key_products) : null,
        fields.applications ? JSON.stringify(fields.applications) : null,
        fields.standards ? JSON.stringify(fields.standards) : null,
        fields.display_order,
        fields.is_published,
        id,
      ]
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    const updated = updateRes.rows[0];
    await logAdminAction(admin!.email, "UPDATE_CATEGORY", "categories", updated.id, {
      name: updated.name,
      is_published: updated.is_published,
    });

    return NextResponse.json({ success: true, category: updated });
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
      return NextResponse.json({ success: false, message: "Category ID is required" }, { status: 400 });
    }

    // Get slug
    const catCheck = await query("SELECT slug, name FROM product_categories WHERE id = $1;", [id]);
    if (catCheck.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    const cat = catCheck.rows[0];

    // Check if any products use this category
    const countCheck = await query("SELECT COUNT(*) as count FROM products WHERE category_slug = $1;", [cat.slug]);
    const pCount = parseInt(countCheck.rows[0]?.count || "0", 10);
    if (pCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete category because it contains ${pCount} active products. Reassign or delete those products first.`,
        },
        { status: 400 }
      );
    }

    await query("DELETE FROM product_categories WHERE id = $1;", [id]);

    await logAdminAction(admin!.email, "DELETE_CATEGORY", "categories", id, { name: cat.name });

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
