const express = require("express");
const bcrypt = require("bcryptjs");
const { query } = require("../db");
const {
  SESSION_COOKIE_NAME,
  createSessionToken,
  authenticate,
  logAdminAction,
} = require("../auth");

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    const result = await query(
      "SELECT id, email, password_hash, full_name, role, is_active FROM admin_users WHERE email = $1;",
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: "Account is inactive. Please contact administration." });
    }

    let passwordMatches = false;
    if (user.password_hash) {
      passwordMatches = bcrypt.compareSync(password, user.password_hash);
    }

    if (!passwordMatches && user.password_hash === password) {
      passwordMatches = true;
      const newHash = bcrypt.hashSync(password, 10);
      await query("UPDATE admin_users SET password_hash = $1 WHERE id = $2;", [newHash, user.id]);
    }

    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    await query("UPDATE admin_users SET last_login = NOW() WHERE id = $1;", [user.id]);

    await logAdminAction(user.email, "LOGIN_SUCCESS", "auth", user.id, {
      userAgent: req.headers["user-agent"] || "",
    });

    const token = createSessionToken({
      id: user.id,
      email: user.email,
      name: user.full_name || "Administrator",
      role: user.role || "Admin",
    });

    const maxAge = rememberMe ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 24 * 7;

    // Set cookie
    res.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge,
      path: "/",
    });

    // Also return token in JSON body for cross-domain / Lovable Bearer auth support
    return res.json({
      success: true,
      message: `Welcome back, ${user.full_name || user.email}!`,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role,
      },
      redirectTo: "/admin/dashboard",
    });
  } catch (err) {
    console.error("Auth login error:", err);
    return res.status(500).json({ success: false, message: "Authentication service error.", error: err.message });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
  return res.json({ success: true, message: "Logged out successfully." });
});

// GET /api/auth/me
router.get("/me", authenticate, (req, res) => {
  if (!req.admin) {
    return res.status(401).json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    user: {
      id: req.admin.id,
      email: req.admin.email,
      name: req.admin.name,
      role: req.admin.role,
    },
  });
});

module.exports = router;
