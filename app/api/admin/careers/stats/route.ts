import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET() {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    // 1. Job statistics
    const jobStatsRes = await query(`
      SELECT 
        COUNT(*) as total_jobs,
        COUNT(*) FILTER (WHERE status = 'published') as published_jobs,
        COUNT(*) FILTER (WHERE status = 'draft') as draft_jobs,
        COUNT(*) FILTER (WHERE status = 'closed') as closed_jobs
      FROM jobs;
    `);

    // 2. Application statistics
    const appStatsRes = await query(`
      SELECT 
        COUNT(*) as total_applications,
        COUNT(*) FILTER (WHERE status = 'New') as new_applications,
        COUNT(*) FILTER (WHERE status = 'Under Review') as under_review_applications,
        COUNT(*) FILTER (WHERE status = 'Shortlisted') as shortlisted_applications,
        COUNT(*) FILTER (WHERE status = 'Interview') as interview_applications,
        COUNT(*) FILTER (WHERE status = 'Selected') as selected_applications,
        COUNT(*) FILTER (WHERE status = 'Rejected') as rejected_applications
      FROM applications;
    `);

    // 3. Applications by Position
    const byPositionRes = await query(`
      SELECT 
        role_of_interest,
        COUNT(*) as count
      FROM applications
      GROUP BY role_of_interest
      ORDER BY count DESC
      LIMIT 10;
    `);

    // 4. Recent Applications
    const recentAppsRes = await query(`
      SELECT 
        id,
        application_reference,
        full_name,
        email,
        phone,
        role_of_interest,
        experience,
        status,
        submitted_at
      FROM applications
      ORDER BY submitted_at DESC
      LIMIT 6;
    `);

    // 5. Recently Published Jobs
    const recentJobsRes = await query(`
      SELECT 
        id,
        role,
        title,
        slug,
        department,
        location,
        experience,
        status,
        created_at
      FROM jobs
      ORDER BY created_at DESC
      LIMIT 5;
    `);

    const jobStats = jobStatsRes.rows[0];
    const appStats = appStatsRes.rows[0];

    return NextResponse.json({
      success: true,
      stats: {
        totalJobs: parseInt(jobStats.total_jobs || "0", 10),
        publishedJobs: parseInt(jobStats.published_jobs || "0", 10),
        draftJobs: parseInt(jobStats.draft_jobs || "0", 10),
        closedJobs: parseInt(jobStats.closed_jobs || "0", 10),

        totalApplications: parseInt(appStats.total_applications || "0", 10),
        newApplications: parseInt(appStats.new_applications || "0", 10),
        underReviewApplications: parseInt(appStats.under_review_applications || "0", 10),
        shortlistedApplications: parseInt(appStats.shortlisted_applications || "0", 10),
        interviewApplications: parseInt(appStats.interview_applications || "0", 10),
        selectedApplications: parseInt(appStats.selected_applications || "0", 10),
        rejectedApplications: parseInt(appStats.rejected_applications || "0", 10),
      },
      byPosition: byPositionRes.rows.map((r) => ({
        role: r.role_of_interest,
        count: parseInt(r.count, 10),
      })),
      recentApplications: recentAppsRes.rows,
      recentJobs: recentJobsRes.rows,
    });
  } catch (err: any) {
    console.error("Admin careers stats API error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to load recruitment metrics." },
      { status: 500 }
    );
  }
}
