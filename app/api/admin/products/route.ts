import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const division = searchParams.get("division") || "";
    const categorySlug = searchParams.get("category") || "";

    let sql = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN product_categories c ON p.category_slug = c.slug
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(p.name) LIKE $${params.length} OR LOWER(p.slug) LIKE $${params.length} OR LOWER(p.short_description) LIKE $${params.length} OR LOWER(COALESCE(p.material, '')) LIKE $${params.length})`;
    }

    if (division.trim() && division !== "all") {
      params.push(division.trim());
      sql += ` AND p.division = $${params.length}`;
    }

    if (categorySlug.trim() && categorySlug !== "all") {
      params.push(categorySlug.trim());
      sql += ` AND p.category_slug = $${params.length}`;
    }

    sql += ` ORDER BY p.created_at DESC;`;

    const result = await query(sql, params);
    return NextResponse.json({ success: true, products: result.rows });
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
      name,
      slug,
      category_slug,
      division,
      short_description,
      overview,
      image,
      featured,
      material,
      size,
      pressure_rating,
      connection_type,
      temperature_range,
      standards,
      specifications,
      key_features,
      applications,
      is_published,
    } = body;

    if (!name || !category_slug || !division) {
      return NextResponse.json(
        { success: false, message: "Product name, category, and division are required." },
        { status: 400 }
      );
    }

    // Auto-generate slug if blank
    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const insertRes = await query(
      `INSERT INTO products (
        name, slug, category_slug, division, short_description, overview, image,
        featured, material, size, pressure_rating, connection_type, temperature_range,
        standards, specifications, key_features, applications, is_published, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW())
      RETURNING *;`,
      [
        name,
        cleanSlug,
        category_slug,
        division,
        short_description || "",
        overview || "",
        image || "",
        !!featured,
        material || "",
        size || "",
        pressure_rating || "",
        connection_type || "",
        temperature_range || "",
        JSON.stringify(standards || []),
        JSON.stringify(specifications || {}),
        JSON.stringify(key_features || []),
        JSON.stringify(applications || []),
        is_published ?? true,
      ]
    );

    const newProduct = insertRes.rows[0];
    await logAdminAction(admin!.email, "CREATE_PRODUCT", "products", newProduct.id, {
      name: newProduct.name,
      slug: newProduct.slug,
    });

    return NextResponse.json({ success: true, product: newProduct });
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
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const updateRes = await query(
      `UPDATE products SET
        name = COALESCE($1, name),
        category_slug = COALESCE($2, category_slug),
        division = COALESCE($3, division),
        short_description = COALESCE($4, short_description),
        overview = COALESCE($5, overview),
        image = COALESCE($6, image),
        featured = COALESCE($7, featured),
        material = COALESCE($8, material),
        size = COALESCE($9, size),
        pressure_rating = COALESCE($10, pressure_rating),
        connection_type = COALESCE($11, connection_type),
        temperature_range = COALESCE($12, temperature_range),
        standards = COALESCE($13, standards),
        specifications = COALESCE($14, specifications),
        key_features = COALESCE($15, key_features),
        applications = COALESCE($16, applications),
        is_published = COALESCE($17, is_published),
        updated_at = NOW()
      WHERE id = $18
      RETURNING *;`,
      [
        fields.name,
        fields.category_slug,
        fields.division,
        fields.short_description,
        fields.overview,
        fields.image,
        fields.featured,
        fields.material,
        fields.size,
        fields.pressure_rating,
        fields.connection_type,
        fields.temperature_range,
        fields.standards ? JSON.stringify(fields.standards) : null,
        fields.specifications ? JSON.stringify(fields.specifications) : null,
        fields.key_features ? JSON.stringify(fields.key_features) : null,
        fields.applications ? JSON.stringify(fields.applications) : null,
        fields.is_published,
        id,
      ]
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const updated = updateRes.rows[0];
    await logAdminAction(admin!.email, "UPDATE_PRODUCT", "products", updated.id, {
      name: updated.name,
      is_published: updated.is_published,
    });

    return NextResponse.json({ success: true, product: updated });
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
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const delRes = await query("DELETE FROM products WHERE id = $1 RETURNING id, name;", [id]);
    if (delRes.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    await logAdminAction(admin!.email, "DELETE_PRODUCT", "products", id, {
      name: delRes.rows[0].name,
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
