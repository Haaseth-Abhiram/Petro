const crypto = require("crypto");
const { query } = require("./db");

const SESSION_COOKIE_NAME = "petronex_admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

function createSessionToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name || user.full_name || "Administrator",
      role: user.role || "Admin",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
}

function verifySessionToken(token) {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(`${header}.${payload}`)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return data;
  } catch (e) {
    return null;
  }
}

function extractToken(req) {
  // 1. Check Authorization header: Bearer <token>
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && typeof authHeader === "string") {
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      return parts[1];
    }
  }

  // 2. Check cookies
  if (req.cookies && req.cookies[SESSION_COOKIE_NAME]) {
    return req.cookies[SESSION_COOKIE_NAME];
  }

  // 3. Fallback: custom header
  if (req.headers["x-admin-token"]) {
    return req.headers["x-admin-token"];
  }

  return null;
}

function authenticate(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    req.admin = null;
    return next();
  }

  const user = verifySessionToken(token);
  req.admin = user;
  next();
}

function requireAdmin(req, res, next) {
  const token = extractToken(req);
  const user = token ? verifySessionToken(token) : null;
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please sign in to access admin functions.",
    });
  }
  req.admin = user;
  next();
}

function requireSuperAdmin(req, res, next) {
  const token = extractToken(req);
  const user = token ? verifySessionToken(token) : null;
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please sign in to access admin functions.",
    });
  }

  const role = (user.role || "").toLowerCase();
  if (role !== "admin" && role !== "super admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden. Administrator privileges required.",
    });
  }

  req.admin = user;
  next();
}

async function logAdminAction(adminEmail, action, entityType, entityId, details = {}) {
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

module.exports = {
  SESSION_COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
  authenticate,
  requireAdmin,
  requireSuperAdmin,
  logAdminAction,
};
