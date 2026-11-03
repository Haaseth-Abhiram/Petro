import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { requireSuperAdmin, logAdminAction } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET() {
  const { errorResponse } = await requireSuperAdmin();
  if (errorResponse) return errorResponse;

  try {
    const res = await query(
      "SELECT id, email, full_name, role, is_active, last_login, created_at FROM admin_users ORDER BY created_at ASC;"
    );
    return NextResponse.json({ success: true, users: res.rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { admin, errorResponse } = await requireSuperAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { email, password, full_name, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const passwordHash = bcrypt.hashSync(password, 10);

    const res = await query(
      `INSERT INTO admin_users (email, password_hash, full_name, role, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, email, full_name, role, is_active, created_at;`,
      [cleanEmail, passwordHash, full_name || "Admin", role || "Admin"]
    );

    const newUser = res.rows[0];
    await logAdminAction(admin!.email, "CREATE_ADMIN_USER", "admin_users", newUser.id, {
      email: newUser.email,
      role: newUser.role,
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { admin, errorResponse } = await requireSuperAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { id, is_active, role, password, full_name } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    let passwordHash = null;
    if (password && password.trim()) {
      passwordHash = bcrypt.hashSync(password.trim(), 10);
    }

    const res = await query(
      `UPDATE admin_users SET
        is_active = COALESCE($1, is_active),
        role = COALESCE($2, role),
        full_name = COALESCE($3, full_name),
        password_hash = COALESCE($4, password_hash)
      WHERE id = $5
      RETURNING id, email, full_name, role, is_active, last_login;`,
      [is_active, role, full_name, passwordHash, id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const u = res.rows[0];
    await logAdminAction(admin!.email, "UPDATE_ADMIN_USER", "admin_users", u.id, {
      email: u.email,
      role: u.role,
      is_active: u.is_active,
    });

    return NextResponse.json({ success: true, user: u });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { admin, errorResponse } = await requireSuperAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    if (id === admin!.id) {
      return NextResponse.json(
        { success: false, message: "You cannot delete your own active admin account." },
        { status: 400 }
      );
    }

    const res = await query("DELETE FROM admin_users WHERE id = $1 RETURNING id, email;", [id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    await logAdminAction(admin!.email, "DELETE_ADMIN_USER", "admin_users", id, {
      email: res.rows[0].email,
    });

    return NextResponse.json({ success: true, message: "Admin user deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
