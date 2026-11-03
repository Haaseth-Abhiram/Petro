import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { errorResponse } = await requireSuperAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const res = await query(
      `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1;`,
      [Math.min(limit, 200)]
    );

    return NextResponse.json({ success: true, logs: res.rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
