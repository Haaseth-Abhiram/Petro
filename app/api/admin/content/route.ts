import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (key) {
      const res = await query("SELECT * FROM website_content WHERE key = $1;", [key]);
      return NextResponse.json({ success: true, content: res.rows[0] || null });
    }

    const allRes = await query("SELECT * FROM website_content ORDER BY key ASC;");
    return NextResponse.json({ success: true, contents: allRes.rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { key, section, content } = body;

    if (!key || !section || !content) {
      return NextResponse.json(
        { success: false, message: "Key, section, and content are required." },
        { status: 400 }
      );
    }

    const res = await query(
      `INSERT INTO website_content (key, section, content, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (key) DO UPDATE SET
         section = EXCLUDED.section,
         content = EXCLUDED.content,
         updated_at = NOW()
       RETURNING *;`,
      [key, section, JSON.stringify(content)]
    );

    await logAdminAction(admin!.email, "UPDATE_WEBSITE_CONTENT", "website_content", key, {
      section,
    });

    return NextResponse.json({ success: true, content: res.rows[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
