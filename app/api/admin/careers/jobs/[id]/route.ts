import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { id } = params;
    const res = await query(
      `
      SELECT 
        j.*,
        c.name as category_name
      FROM jobs j
      LEFT JOIN job_categories c ON j.category_id = c.id
      WHERE j.id = $1
      LIMIT 1;
    `,
      [id]
    );

    if (res.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Job opening not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job: res.rows[0],
    });
  } catch (err: any) {
    console.error("Admin job GET by ID error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve job details." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { id } = params;
    const body = await req.json();

    // Check if job exists
    const currentRes = await query(`SELECT * FROM jobs WHERE id = $1;`, [id]);
    if (currentRes.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Job position not found." },
        { status: 404 }
      );
    }

    const current = currentRes.rows[0];

    const role = body.role ?? current.role;
    const title = body.title ?? current.title;
    const slug = body.slug ?? current.slug;
    const department = body.department ?? current.department;
    const categoryId = body.categoryId !== undefined ? body.categoryId : current.category_id;
    const location = body.location ?? current.location;
    const employmentType = body.employmentType ?? current.employment_type;
    const experience = body.experience ?? current.experience;
    const shortDescription = body.shortDescription ?? current.short_description;
    const description = body.description ?? current.description;
    const responsibilities = body.responsibilities ?? current.responsibilities;
    const qualifications = body.qualifications ?? current.qualifications;
    const requiredSkills = body.requiredSkills ?? current.required_skills;
    const optionalSkills = body.optionalSkills ?? current.optional_skills;
    const image = body.image ?? current.image;
    const displayOrder = body.displayOrder !== undefined ? parseInt(String(body.displayOrder), 10) : current.display_order;
    const applicationDeadline = body.applicationDeadline !== undefined ? body.applicationDeadline : current.application_deadline;
    const status = body.status ?? current.status;

    let publishedAt = current.published_at;
    if (status === "published" && current.status !== "published") {
      publishedAt = new Date();
    }

    const updateRes = await query(
      `
      UPDATE jobs SET
        role = $1,
        title = $2,
        slug = $3,
        department = $4,
        category_id = $5,
        location = $6,
        employment_type = $7,
        experience = $8,
        short_description = $9,
        description = $10,
        responsibilities = $11,
        qualifications = $12,
        required_skills = $13,
        optional_skills = $14,
        image = $15,
        display_order = $16,
        application_deadline = $17,
        status = $18,
        published_at = $19,
        updated_at = NOW()
      WHERE id = $20
      RETURNING *;
    `,
      [
        role,
        title,
        slug,
        department,
        categoryId || null,
        location,
        employmentType,
        experience,
        shortDescription,
        description,
        JSON.stringify(responsibilities),
        JSON.stringify(qualifications),
        JSON.stringify(requiredSkills),
        JSON.stringify(optionalSkills),
        image,
        displayOrder,
        applicationDeadline ? new Date(applicationDeadline) : null,
        status,
        publishedAt,
        id,
      ]
    );

    const updated = updateRes.rows[0];

    await logAdminAction(
      admin?.email || "admin@petroeng.in",
      "JOB_UPDATED",
      "job",
      id,
      { title: updated.title, status: updated.status, previousStatus: current.status }
    );

    return NextResponse.json({
      success: true,
      message: "Job position updated successfully.",
      job: updated,
    });
  } catch (err: any) {
    console.error("Admin job PUT error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update job position." },
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
    const currentRes = await query(`SELECT id, title, role FROM jobs WHERE id = $1;`, [id]);
    if (currentRes.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Job position not found." },
        { status: 404 }
      );
    }

    const job = currentRes.rows[0];

    await query(`DELETE FROM jobs WHERE id = $1;`, [id]);

    await logAdminAction(
      admin?.email || "admin@petroeng.in",
      "JOB_DELETED",
      "job",
      id,
      { title: job.title, role: job.role }
    );

    return NextResponse.json({
      success: true,
      message: `Job position "${job.title}" has been removed.`,
    });
  } catch (err: any) {
    console.error("Admin job DELETE error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete job position." },
      { status: 500 }
    );
  }
}
