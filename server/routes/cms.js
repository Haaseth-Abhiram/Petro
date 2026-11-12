const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const { query } = require("../db");
const { authenticate, requireAdmin, requireSuperAdmin, logAdminAction } = require("../auth");

const router = express.Router();

// Multer storage for image uploads
const imageDir = path.resolve(process.cwd(), "public", "uploads", "images");
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imageDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const unique = `${base || "img"}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext || ".jpg"}`;
    cb(null, unique);
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"].includes(ext) || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid image format. Allowed: PNG, JPG, JPEG, WEBP, SVG, GIF."));
    }
  },
});

/* ========================================================
   UPLOAD IMAGE
   ======================================================== */
router.post("/upload-image", requireAdmin, uploadImage.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided." });
    }

    const publicUrl = `/uploads/images/${req.file.filename}`;
    return res.json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "Failed to upload image." });
  }
});

/* ========================================================
   WEBSITE CONTENT
   ======================================================== */
router.get("/content", async (req, res) => {
  try {
    const key = req.query.key;
    if (key) {
      const r = await query("SELECT * FROM website_content WHERE key = $1;", [key]);
      return res.json({ success: true, content: r.rows[0] || null });
    }
    const all = await query("SELECT * FROM website_content ORDER BY key ASC;");
    return res.json({ success: true, contents: all.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/content", requireAdmin, async (req, res) => {
  try {
    const { key, section, content } = req.body || {};
    if (!key || !section || !content) {
      return res.status(400).json({ success: false, message: "Key, section, and content are required." });
    }

    const r = await query(
      `INSERT INTO website_content (key, section, content, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (key) DO UPDATE SET
         section = EXCLUDED.section,
         content = EXCLUDED.content,
         updated_at = NOW()
       RETURNING *;`,
      [key, section, JSON.stringify(content)]
    );

    await logAdminAction(req.admin.email, "UPDATE_WEBSITE_CONTENT", "website_content", key, { section });
    return res.json({ success: true, content: r.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* ========================================================
   DOCUMENTS
   ======================================================== */
router.get("/documents", requireAdmin, async (req, res) => {
  try {
    const category = req.query.category;
    let sql = `SELECT * FROM documents`;
    const params = [];
    if (category && category !== "all") {
      params.push(category);
      sql += ` WHERE category = $1`;
    }
    sql += ` ORDER BY created_at DESC;`;

    const r = await query(sql, params);
    return res.json({ success: true, documents: r.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/documents", requireAdmin, async (req, res) => {
  try {
    const { title, category, type, description, file_url, file_size, is_published } = req.body || {};
    if (!title || !category || !type || !file_url) {
      return res.status(400).json({ success: false, message: "Title, category, type, and file URL are required." });
    }

    const r = await query(
      `INSERT INTO documents (title, category, type, description, file_url, file_size, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *;`,
      [title, category, type, description || "", file_url, file_size || "1.5 MB", is_published ?? true]
    );

    await logAdminAction(req.admin.email, "CREATE_DOCUMENT", "documents", r.rows[0].id, { title });
    return res.json({ success: true, document: r.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/documents", requireAdmin, async (req, res) => {
  try {
    const { id, ...fields } = req.body || {};
    if (!id) return res.status(400).json({ success: false, message: "Document ID is required" });

    const r = await query(
      `UPDATE documents SET
        title = COALESCE($1, title),
        category = COALESCE($2, category),
        type = COALESCE($3, type),
        description = COALESCE($4, description),
        file_url = COALESCE($5, file_url),
        file_size = COALESCE($6, file_size),
        is_published = COALESCE($7, is_published)
      WHERE id = $8
      RETURNING *;`,
      [fields.title, fields.category, fields.type, fields.description, fields.file_url, fields.file_size, fields.is_published, id]
    );

    if (r.rows.length === 0) return res.status(404).json({ success: false, message: "Document not found" });
    return res.json({ success: true, document: r.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/documents", requireAdmin, async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ success: false, message: "Document ID is required" });

    const r = await query("DELETE FROM documents WHERE id = $1 RETURNING id, title;", [id]);
    if (r.rows.length === 0) return res.status(404).json({ success: false, message: "Document not found" });

    await logAdminAction(req.admin.email, "DELETE_DOCUMENT", "documents", id, { title: r.rows[0].title });
    return res.json({ success: true, message: "Document deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* ========================================================
   SERVICES
   ======================================================== */
router.get("/services", async (req, res) => {
  try {
    const r = await query("SELECT * FROM services ORDER BY display_order ASC, title ASC;");
    return res.json({ success: true, services: r.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/services", requireAdmin, async (req, res) => {
  try {
    const { title, slug, short_desc, overview, icon_name, image, key_activities, benefits, display_order, is_published } = req.body || {};
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });

    const cleanSlug = (slug || title).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const r = await query(
      `INSERT INTO services (slug, title, short_desc, overview, icon_name, image, key_activities, benefits, display_order, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *;`,
      [
        cleanSlug,
        title,
        short_desc || "",
        overview || "",
        icon_name || "Flame",
        image || "",
        JSON.stringify(key_activities || []),
        JSON.stringify(benefits || []),
        display_order || 0,
        is_published ?? true,
      ]
    );

    return res.json({ success: true, service: r.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/services", requireAdmin, async (req, res) => {
  try {
    const { id, ...fields } = req.body || {};
    if (!id) return res.status(400).json({ success: false, message: "Service ID is required" });

    const r = await query(
      `UPDATE services SET
        title = COALESCE($1, title),
        short_desc = COALESCE($2, short_desc),
        overview = COALESCE($3, overview),
        icon_name = COALESCE($4, icon_name),
        image = COALESCE($5, image),
        key_activities = COALESCE($6, key_activities),
        benefits = COALESCE($7, benefits),
        display_order = COALESCE($8, display_order),
        is_published = COALESCE($9, is_published)
      WHERE id = $10
      RETURNING *;`,
      [
        fields.title,
        fields.short_desc,
        fields.overview,
        fields.icon_name,
        fields.image,
        fields.key_activities ? JSON.stringify(fields.key_activities) : null,
        fields.benefits ? JSON.stringify(fields.benefits) : null,
        fields.display_order,
        fields.is_published,
        id,
      ]
    );

    if (r.rows.length === 0) return res.status(404).json({ success: false, message: "Service not found" });
    return res.json({ success: true, service: r.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/services", requireAdmin, async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ success: false, message: "Service ID is required" });

    const r = await query("DELETE FROM services WHERE id = $1 RETURNING id, title;", [id]);
    if (r.rows.length === 0) return res.status(404).json({ success: false, message: "Service not found" });

    return res.json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* ========================================================
   INDUSTRIES
   ======================================================== */
router.get("/industries", async (req, res) => {
  try {
    const r = await query("SELECT * FROM industries ORDER BY display_order ASC, name ASC;");
    return res.json({ success: true, industries: r.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/industries", requireAdmin, async (req, res) => {
  try {
    const { name, slug, tagline, short_overview, detailed_overview, image, common_requirements, relevant_products, relevant_services, display_order, is_published } = req.body || {};
    if (!name) return res.status(400).json({ success: false, message: "Industry name is required" });

    const cleanSlug = (slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const r = await query(
      `INSERT INTO industries (slug, name, tagline, short_overview, detailed_overview, image, common_requirements, relevant_products, relevant_services, display_order, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *;`,
      [
        cleanSlug,
        name,
        tagline || "",
        short_overview || "",
        detailed_overview || "",
        image || "",
        JSON.stringify(common_requirements || []),
        JSON.stringify(relevant_products || []),
        JSON.stringify(relevant_services || []),
        display_order || 0,
        is_published ?? true,
      ]
    );

    return res.json({ success: true, industry: r.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/industries", requireAdmin, async (req, res) => {
  try {
    const { id, ...fields } = req.body || {};
    if (!id) return res.status(400).json({ success: false, message: "Industry ID is required" });

    const r = await query(
      `UPDATE industries SET
        name = COALESCE($1, name),
        tagline = COALESCE($2, tagline),
        short_overview = COALESCE($3, short_overview),
        detailed_overview = COALESCE($4, detailed_overview),
        image = COALESCE($5, image),
        common_requirements = COALESCE($6, common_requirements),
        relevant_products = COALESCE($7, relevant_products),
        relevant_services = COALESCE($8, relevant_services),
        display_order = COALESCE($9, display_order),
        is_published = COALESCE($10, is_published)
      WHERE id = $11
      RETURNING *;`,
      [
        fields.name,
        fields.tagline,
        fields.short_overview,
        fields.detailed_overview,
        fields.image,
        fields.common_requirements ? JSON.stringify(fields.common_requirements) : null,
        fields.relevant_products ? JSON.stringify(fields.relevant_products) : null,
        fields.relevant_services ? JSON.stringify(fields.relevant_services) : null,
        fields.display_order,
        fields.is_published,
        id,
      ]
    );

    if (r.rows.length === 0) return res.status(404).json({ success: false, message: "Industry not found" });
    return res.json({ success: true, industry: r.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/industries", requireAdmin, async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ success: false, message: "Industry ID is required" });

    const r = await query("DELETE FROM industries WHERE id = $1 RETURNING id, name;", [id]);
    if (r.rows.length === 0) return res.status(404).json({ success: false, message: "Industry not found" });

    return res.json({ success: true, message: "Industry deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* ========================================================
   ROLES & ACCESS MANAGEMENT
   ======================================================== */
router.get("/roles/users", authenticate, async (req, res) => {
  try {
    const r = await query(`
      SELECT id, email, full_name, company, phone, role, is_active, last_login, created_at 
      FROM admin_users 
      ORDER BY 
        CASE WHEN role = 'Pending' OR role IS NULL THEN 0 ELSE 1 END,
        created_at DESC;
    `);
    return res.json({ success: true, users: r.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.patch("/roles/assign", authenticate, async (req, res) => {
  try {
    const { userId, role } = req.body || {};
    if (!userId || !role) {
      return res.status(400).json({ success: false, message: "User ID and role are required." });
    }

    const validRoles = ["HR", "Employee", "Client", "Admin", "Pending"];
    const matchedRole = validRoles.find((r) => r.toLowerCase() === String(role).toLowerCase()) || role;

    const r = await query(
      `UPDATE admin_users SET role = $1 WHERE id = $2 
       RETURNING id, email, full_name, company, phone, role, is_active;`,
      [matchedRole, userId]
    );

    if (r.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (req.admin) {
      await logAdminAction(req.admin.email || "admin", "ROLE_ASSIGNED", "admin_users", userId, {
        assignedRole: matchedRole,
        userEmail: r.rows[0].email,
      });
    }

    return res.json({
      success: true,
      message: `Role "${matchedRole}" successfully assigned to ${r.rows[0].full_name || r.rows[0].email}.`,
      user: r.rows[0],
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.patch("/roles/status", authenticate, async (req, res) => {
  try {
    const { userId, isActive } = req.body || {};
    if (!userId) return res.status(400).json({ success: false, message: "User ID is required." });

    const r = await query(
      `UPDATE admin_users SET is_active = $1 WHERE id = $2 RETURNING id, email, full_name, is_active;`,
      [Boolean(isActive), userId]
    );

    if (r.rows.length === 0) return res.status(404).json({ success: false, message: "User not found." });

    return res.json({ success: true, user: r.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/roles/users/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "User ID is required." });

    if (req.admin && req.admin.id === id) {
      return res.status(400).json({ success: false, message: "You cannot delete your own account." });
    }

    const r = await query("DELETE FROM admin_users WHERE id = $1 RETURNING id, email, full_name;", [id]);
    if (r.rows.length === 0) return res.status(404).json({ success: false, message: "User not found." });

    return res.json({ success: true, message: "User deleted successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* ========================================================
   USERS & AUDIT LOGS
   ======================================================== */
router.get("/users", requireSuperAdmin, async (req, res) => {
  try {
    const r = await query("SELECT id, email, full_name, role, is_active, last_login, created_at FROM admin_users ORDER BY created_at ASC;");
    return res.json({ success: true, users: r.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/users", requireSuperAdmin, async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const passwordHash = bcrypt.hashSync(password, 10);

    const r = await query(
      `INSERT INTO admin_users (email, password_hash, full_name, role, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, email, full_name, role, is_active, created_at;`,
      [cleanEmail, passwordHash, full_name || "Admin", role || "Admin"]
    );

    return res.json({ success: true, user: r.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.patch("/users", requireSuperAdmin, async (req, res) => {
  try {
    const { id, is_active, role, password, full_name } = req.body || {};
    if (!id) return res.status(400).json({ success: false, message: "User ID is required" });

    let passwordHash = null;
    if (password && password.trim()) {
      passwordHash = bcrypt.hashSync(password.trim(), 10);
    }

    const r = await query(
      `UPDATE admin_users SET
        is_active = COALESCE($1, is_active),
        role = COALESCE($2, role),
        full_name = COALESCE($3, full_name),
        password_hash = COALESCE($4, password_hash)
      WHERE id = $5
      RETURNING id, email, full_name, role, is_active, last_login;`,
      [is_active, role, full_name, passwordHash, id]
    );

    if (r.rows.length === 0) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user: r.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/users", requireSuperAdmin, async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ success: false, message: "User ID is required" });
    if (id === req.admin.id) {
      return res.status(400).json({ success: false, message: "You cannot delete your own account." });
    }

    const r = await query("DELETE FROM admin_users WHERE id = $1 RETURNING id, email;", [id]);
    if (r.rows.length === 0) return res.status(404).json({ success: false, message: "User not found" });

    return res.json({ success: true, message: "Admin user deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/audit-logs", requireSuperAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "50", 10);
    const r = await query("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1;", [Math.min(limit, 200)]);
    return res.json({ success: true, logs: r.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
