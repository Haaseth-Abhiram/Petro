import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const department = searchParams.get("department")?.trim() || "";

    let sql = `
      SELECT 
        j.id,
        j.role,
        j.title,
        j.slug,
        j.department,
        j.category_id,
        j.location,
        j.employment_type,
        j.experience,
        j.short_description,
        j.description,
        j.responsibilities,
        j.qualifications,
        j.required_skills,
        j.optional_skills,
        j.image,
        j.display_order,
        j.application_deadline,
        j.status,
        j.created_at,
        j.updated_at,
        j.published_at,
        c.name as category_name,
        (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id OR a.role_of_interest = j.role) as application_count
      FROM jobs j
      LEFT JOIN job_categories c ON j.category_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (j.title ILIKE $${params.length} OR j.role ILIKE $${params.length} OR j.department ILIKE $${params.length})`;
    }

    if (status && status !== "all") {
      params.push(status);
      sql += ` AND j.status = $${params.length}`;
    }

    if (department && department !== "all") {
      params.push(department);
      sql += ` AND j.department = $${params.length}`;
    }

    sql += ` ORDER BY j.display_order ASC, j.created_at DESC;`;

    const res = await query(sql, params);

    return NextResponse.json({
      success: true,
      jobs: res.rows,
    });
  } catch (err: any) {
    console.error("Admin jobs GET error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve job listings." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const {
      role,
      title,
      slug: customSlug,
      department,
      categoryId,
      location = "Mumbai, India",
      employmentType = "Full-time",
      experience = "2+ years",
      shortDescription,
      description,
      responsibilities = [],
      qualifications = [],
      requiredSkills = [],
      optionalSkills = [],
      image = "/assets/img/tube-fittings.jpg",
      displayOrder = 0,
      applicationDeadline,
      status = "published",
    } = body;

    if (!role || !title || !shortDescription) {
      return NextResponse.json(
        { success: false, message: "Role, title, and short description are required." },
        { status: 400 }
      );
    }

    // Generate slug
    let baseSlug = customSlug
      ? customSlug
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      : title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

    if (!baseSlug) baseSlug = `job-${Date.now()}`;

    // Ensure slug uniqueness
    const slugCheck = await query(`SELECT id FROM jobs WHERE slug = $1;`, [baseSlug]);
    let finalSlug = baseSlug;
    if ((slugCheck.rowCount ?? 0) > 0) {
      finalSlug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const res = await query(
      `
      INSERT INTO jobs (
        role,
        title,
        slug,
        department,
        category_id,
        location,
        employment_type,
        experience,
        short_description,
        description,
        responsibilities,
        qualifications,
        required_skills,
        optional_skills,
        image,
        display_order,
        application_deadline,
        status,
        created_at,
        updated_at,
        published_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18,
        NOW(), NOW(), ${status === "published" ? "NOW()" : "NULL"}
      )
      RETURNING *;
    `,
      [
        role,
        title,
        finalSlug,
        department || "Engineering",
        categoryId || null,
        location,
        employmentType,
        experience,
        shortDescription,
        description || shortDescription,
        JSON.stringify(responsibilities),
        JSON.stringify(qualifications),
        JSON.stringify(requiredSkills),
        JSON.stringify(optionalSkills),
        image,
        parseInt(String(displayOrder), 10) || 0,
        applicationDeadline ? new Date(applicationDeadline) : null,
        status,
      ]
    );

    const createdJob = res.rows[0];

    // Log admin audit action
    await logAdminAction(
      admin?.email || "admin@petroeng.in",
      "JOB_CREATED",
      "job",
      createdJob.id,
      { title: createdJob.title, role: createdJob.role, status: createdJob.status }
    );

    return NextResponse.json({
      success: true,
      message: "Job position created successfully.",
      job: createdJob,
    });
  } catch (err: any) {
    console.error("Admin jobs POST error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to create job position." },
      { status: 500 }
    );
  }
}
