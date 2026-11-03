import { NextResponse } from "next/server";
import { getCurrentAdmin, SessionUser } from "./admin-session";
import { query } from "./db";

export async function requireAdmin(): Promise<{ admin: SessionUser | null; errorResponse: NextResponse | null }> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return {
      admin: null,
      errorResponse: NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in to access admin functions." },
        { status: 401 }
      ),
    };
  }
  return { admin, errorResponse: null };
}

export async function requireSuperAdmin(): Promise<{ admin: SessionUser | null; errorResponse: NextResponse | null }> {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return { admin: null, errorResponse };

  if (admin?.role !== "Super Admin") {
    return {
      admin: null,
      errorResponse: NextResponse.json(
        { success: false, message: "Forbidden. Super Administrator privileges required." },
        { status: 403 }
      ),
    };
  }
  return { admin, errorResponse: null };
}

export async function logAdminAction(
  adminEmail: string,
  action: string,
  entityType: string,
  entityId: string | number,
  details: any = {}
) {
  try {
    await query(
      `INSERT INTO audit_logs (admin_email, action, entity_type, entity_id, details)
       VALUES ($1, $2, $3, $4, $5);`,
      [adminEmail, action, entityType, String(entityId), JSON.stringify(details)]
    );
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}
