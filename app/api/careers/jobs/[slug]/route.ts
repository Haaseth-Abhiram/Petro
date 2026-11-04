import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const res = await query(
      `
      SELECT 
        j.id,
        j.role,
        j.title,
        j.slug,
        j.department,
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
        j.published_at,
        c.name as category_name,
        c.slug as category_slug
      FROM jobs j
      LEFT JOIN job_categories c ON j.category_id = c.id
      WHERE j.slug = $1 AND j.status = 'published'
      LIMIT 1;
    `,
      [slug]
    );

    if (res.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Job opening not found or no longer active." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job: res.rows[0],
    });
  } catch (err: any) {
    console.error("Error fetching job by slug:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch job details." },
      { status: 500 }
    );
  }
}
