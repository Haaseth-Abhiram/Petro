import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { id } = params;
    const body = await req.json();
    const { name, description, displayOrder, isActive } = body;

    const currentRes = await query(`SELECT * FROM job_categories WHERE id = $1;`, [id]);
    if (currentRes.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 }
      );
    }

    const current = currentRes.rows[0];

    const updatedName = name !== undefined ? name.trim() : current.name;
    const updatedDesc = description !== undefined ? description : current.description;
    const updatedOrder = displayOrder !== undefined ? parseInt(String(displayOrder), 10) : current.display_order;
    const updatedActive = isActive !== undefined ? isActive : current.is_active;

    const res = await query(
      `
      UPDATE job_categories SET
        name = $1,
        description = $2,
        display_order = $3,
        is_active = $4,
        updated_at = NOW()
      WHERE id = $5
      RETURNING *;
    `,
      [updatedName, updatedDesc, updatedOrder, updatedActive, id]
    );

    const updated = res.rows[0];

    await logAdminAction(
      admin?.email || "admin@petroeng.in",
      "JOB_CATEGORY_UPDATED",
      "job_category",
      id,
      { name: updated.name }
    );

    return NextResponse.json({
      success: true,
      message: "Job category updated successfully.",
      category: updated,
    });
  } catch (err: any) {
    console.error("Admin category PUT error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update category." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { id } = params;
    const currentRes = await query(`SELECT id, name FROM job_categories WHERE id = $1;`, [id]);
    if (currentRes.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 }
      );
    }

    // Set category_id = null for any jobs using this category
    await query(`UPDATE jobs SET category_id = NULL WHERE category_id = $1;`, [id]);
    await query(`DELETE FROM job_categories WHERE id = $1;`, [id]);

    await logAdminAction(
      admin?.email || "admin@petroeng.in",
      "JOB_CATEGORY_DELETED",
      "job_category",
      id,
      { name: currentRes.rows[0].name }
    );

    return NextResponse.json({
      success: true,
      message: `Category "${currentRes.rows[0].name}" removed.`,
    });
  } catch (err: any) {
    console.error("Admin category DELETE error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete category." },
      { status: 500 }
    );
  }
}
