import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET() {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const res = await query(`SELECT value FROM recruitment_settings WHERE key = 'general' LIMIT 1;`);
    if (res.rowCount === 0) {
      return NextResponse.json({
        success: true,
        settings: {
          notification_email: "hr@petroeng.in, sales@petroeng.in",
          auto_acknowledge: true,
          acknowledgement_subject: "Thank you for applying to Petro Engineering",
          cv_max_size_mb: 5,
          allowed_extensions: [".pdf", ".doc", ".docx"],
          allow_general_applications: true,
          retention_period_months: 24,
          recruitment_contact_phone: "+91 96521 11021",
          recruitment_contact_email: "careers@petroeng.in",
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings: res.rows[0].value,
    });
  } catch (err: any) {
    console.error("Admin settings GET error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to load recruitment settings." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const settings = {
      notification_email: body.notification_email || "hr@petroeng.in",
      auto_acknowledge: body.auto_acknowledge ?? true,
      acknowledgement_subject: body.acknowledgement_subject || "Thank you for applying to Petro Engineering",
      cv_max_size_mb: parseInt(String(body.cv_max_size_mb || "5"), 10),
      allowed_extensions: body.allowed_extensions || [".pdf", ".doc", ".docx"],
      allow_general_applications: body.allow_general_applications ?? true,
      retention_period_months: parseInt(String(body.retention_period_months || "24"), 10),
      recruitment_contact_phone: body.recruitment_contact_phone || "+91 96521 11021",
      recruitment_contact_email: body.recruitment_contact_email || "careers@petroeng.in",
    };

    await query(
      `
      INSERT INTO recruitment_settings (key, value, updated_at)
      VALUES ('general', $1, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
    `,
      [JSON.stringify(settings)]
    );

    await logAdminAction(
      admin?.email || "admin@petroeng.in",
      "RECRUITMENT_SETTINGS_UPDATED",
      "settings",
      "general",
      { settings }
    );

    return NextResponse.json({
      success: true,
      message: "Recruitment settings updated successfully.",
      settings,
    });
  } catch (err: any) {
    console.error("Admin settings POST error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update recruitment settings." },
      { status: 500 }
    );
  }
}
