import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, getCurrentAdmin } from "@/lib/admin-session";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const admin = await getCurrentAdmin();
    if (admin) {
      try {
        await query(
          `INSERT INTO audit_logs (admin_email, action, entity_type, entity_id, details)
           VALUES ($1, 'LOGOUT', 'auth', $2, '{}'::jsonb);`,
          [admin.email, admin.id]
        );
      } catch (e) {}
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
