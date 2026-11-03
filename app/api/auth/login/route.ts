import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Query admin user
    const result = await query(
      "SELECT id, email, password_hash, full_name, role, is_active FROM admin_users WHERE email = $1;",
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, message: "Account is inactive. Please contact system administration." },
        { status: 403 }
      );
    }

    // Verify password using bcrypt
    let passwordMatches = false;
    if (user.password_hash) {
      passwordMatches = bcrypt.compareSync(password, user.password_hash);
    }

    // Fallback if password was unhashed
    if (!passwordMatches && user.password_hash === password) {
      passwordMatches = true;
      // Upgrade to bcrypt hash
      const newHash = bcrypt.hashSync(password, 10);
      await query("UPDATE admin_users SET password_hash = $1 WHERE id = $2;", [newHash, user.id]);
    }

    if (!passwordMatches) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Update last_login
    await query("UPDATE admin_users SET last_login = NOW() WHERE id = $1;", [user.id]);

    // Insert Audit Log
    try {
      await query(
        `INSERT INTO audit_logs (admin_email, action, entity_type, entity_id, details)
         VALUES ($1, 'LOGIN_SUCCESS', 'auth', $2, $3);`,
        [user.email, user.id, JSON.stringify({ userAgent: req.headers.get("user-agent") || "" })]
      );
    } catch (e) {
      console.error("Audit log error:", e);
    }

    // Create session token
    const token = createSessionToken({
      id: user.id,
      email: user.email,
      name: user.full_name || "Administrator",
      role: user.role || "Admin",
    });

    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 days or 7 days

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${user.full_name || user.email}!`,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role,
      },
      redirectTo: "/admin/dashboard",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return response;
  } catch (err: any) {
    console.error("Auth error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Authentication service error.",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
