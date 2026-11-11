const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { randomUUID } = require("crypto");
const { query } = require("../db");
const { requireAdmin, logAdminAction } = require("../auth");

const router = express.Router();

// Multer storage for candidate resumes
const resumeDir = path.resolve(process.cwd(), "uploads", "resumes");
if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, resumeDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${randomUUID()}${ext}`;
    cb(null, unique);
  },
});

const uploadResume = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".pdf", ".doc", ".docx"].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .pdf, .doc, and .docx formats are permitted."));
    }
  },
});

/* ========================================================
   PUBLIC CAREERS ENDPOINTS
   ======================================================== */

// GET /api/careers/jobs
router.get("/jobs", async (req, res) => {
  try {
    const department = req.query.department;
    let sql = `
      SELECT id, role, title, slug, department, location, employment_type, experience, short_description, description, responsibilities, qualifications, required_skills, optional_skills, image, application_deadline, created_at
      FROM jobs
      WHERE status = 'published'
    `;
    const params = [];
    if (department && department !== "all") {
      params.push(department);
      sql += ` AND department = $1`;
    }
    sql += ` ORDER BY display_order ASC, created_at DESC;`;

    const result = await query(sql, params);
    return res.json({ success: true, jobs: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/careers/jobs/:slug
router.get("/jobs/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await query(`SELECT * FROM jobs WHERE slug = $1 AND status = 'published' LIMIT 1;`, [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    return res.json({ success: true, job: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/careers (Candidate Application)
router.post("/applications/submit", uploadResume.single("resume"), async (req, res) => {
  try {
    const { fullName, email, phone, role, experience, link, message } = req.body || {};

    if (!fullName || !email || !phone || !role) {
      return res.status(400).json({ success: false, message: "Full name, email, phone, and role are required." });
    }

    const ref = `APP-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const resumeFile = req.file;
    const resumePath = resumeFile ? `uploads/resumes/${resumeFile.filename}` : null;
    const resumeName = resumeFile ? resumeFile.originalname : null;
    const resumeSize = resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB` : null;

    const insertRes = await query(
      `INSERT INTO applications (
        application_reference, full_name, email, phone, role_of_interest,
        experience, linkedin_url, cover_note, resume_storage_path,
        resume_original_name, resume_file_size, status, submitted_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'New', NOW(), NOW())
      RETURNING id, application_reference, full_name, email, role_of_interest, status, submitted_at;`,
      [
        ref,
        fullName,
        email,
        phone,
        role,
        experience || "Entry",
        link || "",
        message || "",
        resumePath,
        resumeName,
        resumeSize,
      ]
    );

    return res.json({
      success: true,
      message: "Application submitted successfully.",
      application: insertRes.rows[0],
    });
  } catch (err) {
    console.error("Application submit error:", err);
    return res.status(500).json({ success: false, message: "Failed to submit application.", error: err.message });
  }
});

/* ========================================================
   ADMIN RECRUITMENT & CAREERS ENDPOINTS
   ======================================================== */

// GET /api/admin/careers/stats
router.get("/admin/stats", requireAdmin, async (req, res) => {
  try {
    const [jobStatsRes, appStatsRes, byPositionRes, recentAppsRes, recentJobsRes] = await Promise.all([
      query(`
        SELECT 
          COUNT(*) as total_jobs,
          COUNT(*) FILTER (WHERE status = 'published') as published_jobs,
          COUNT(*) FILTER (WHERE status = 'draft') as draft_jobs,
          COUNT(*) FILTER (WHERE status = 'closed') as closed_jobs
        FROM jobs;
      `),
      query(`
        SELECT 
          COUNT(*) as total_applications,
          COUNT(*) FILTER (WHERE status = 'New') as new_applications,
          COUNT(*) FILTER (WHERE status = 'Under Review') as under_review_applications,
          COUNT(*) FILTER (WHERE status = 'Shortlisted') as shortlisted_applications,
          COUNT(*) FILTER (WHERE status = 'Interview') as interview_applications,
          COUNT(*) FILTER (WHERE status = 'Selected') as selected_applications,
          COUNT(*) FILTER (WHERE status = 'Rejected') as rejected_applications
        FROM applications;
      `),
      query(`SELECT role_of_interest, COUNT(*) as count FROM applications GROUP BY role_of_interest ORDER BY count DESC LIMIT 10;`),
      query(`SELECT id, application_reference, full_name, email, phone, role_of_interest, experience, status, submitted_at FROM applications ORDER BY submitted_at DESC LIMIT 6;`),
      query(`SELECT id, role, title, slug, department, location, experience, status, created_at FROM jobs ORDER BY created_at DESC LIMIT 5;`),
    ]);

    const jobStats = jobStatsRes.rows[0] || {};
    const appStats = appStatsRes.rows[0] || {};

    return res.json({
      success: true,
      stats: {
        totalJobs: parseInt(jobStats.total_jobs || "0", 10),
        publishedJobs: parseInt(jobStats.published_jobs || "0", 10),
        draftJobs: parseInt(jobStats.draft_jobs || "0", 10),
        closedJobs: parseInt(jobStats.closed_jobs || "0", 10),
        totalApplications: parseInt(appStats.total_applications || "0", 10),
        newApplications: parseInt(appStats.new_applications || "0", 10),
        underReviewApplications: parseInt(appStats.under_review_applications || "0", 10),
        shortlistedApplications: parseInt(appStats.shortlisted_applications || "0", 10),
        interviewApplications: parseInt(appStats.interview_applications || "0", 10),
        selectedApplications: parseInt(appStats.selected_applications || "0", 10),
        rejectedApplications: parseInt(appStats.rejected_applications || "0", 10),
      },
      byPosition: byPositionRes.rows.map((r) => ({ role: r.role_of_interest, count: parseInt(r.count, 10) })),
      recentApplications: recentAppsRes.rows,
      recentJobs: recentJobsRes.rows,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/careers/jobs
router.get("/admin/jobs", requireAdmin, async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";
    const status = req.query.status?.trim() || "";
    const department = req.query.department?.trim() || "";

    let sql = `
      SELECT j.*, c.name as category_name,
        (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id OR a.role_of_interest = j.role) as application_count
      FROM jobs j
      LEFT JOIN job_categories c ON j.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (j.title ILIKE $${params.length} OR j.role ILIKE $${params.length} OR j.department ILIKE $${params.length})`;
    }

    if (status && status !== "all") {
      params.push(status);
      sql += ` AND j.status = $${params.length}`;
    }

    if (department && department !== "all") {
      params.push(department);
      sql += ` AND j.department = $${params.length}`;
    }

    sql += ` ORDER BY j.display_order ASC, j.created_at DESC;`;

    const r = await query(sql, params);
    return res.json({ success: true, jobs: r.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/careers/jobs
router.post("/admin/jobs", requireAdmin, async (req, res) => {
  try {
    const {
      role,
      title,
      slug: customSlug,
      department = "Engineering",
      categoryId = null,
      location = "Mumbai, India",
      employmentType = "Full-time",
      experience = "2+ years",
      shortDescription,
      description,
      responsibilities = [],
      qualifications = [],
      requiredSkills = [],
      optionalSkills = [],
      image = "/assets/img/tube-fittings.jpg",
      displayOrder = 0,
      applicationDeadline,
      status = "published",
    } = req.body || {};

    if (!role || !title || !shortDescription) {
      return res.status(400).json({ success: false, message: "Role, title, and short description are required." });
    }

    let baseSlug = (customSlug || title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!baseSlug) baseSlug = `job-${Date.now()}`;

    const slugCheck = await query(`SELECT id FROM jobs WHERE slug = $1;`, [baseSlug]);
    let finalSlug = baseSlug;
    if ((slugCheck.rowCount ?? 0) > 0) {
      finalSlug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const r = await query(
      `INSERT INTO jobs (
        role, title, slug, department, category_id, location, employment_type,
        experience, short_description, description, responsibilities, qualifications,
        required_skills, optional_skills, image, display_order, application_deadline,
        status, created_at, updated_at, published_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW(), NOW())
      RETURNING *;`,
      [
        role,
        title,
        finalSlug,
        department,
        categoryId,
        location,
        employmentType,
        experience,
        shortDescription,
        description || shortDescription,
        JSON.stringify(responsibilities),
        JSON.stringify(qualifications),
        JSON.stringify(requiredSkills),
        JSON.stringify(optionalSkills),
        image,
        parseInt(String(displayOrder), 10) || 0,
        applicationDeadline ? new Date(applicationDeadline) : null,
        status,
      ]
    );

    await logAdminAction(req.admin.email, "JOB_CREATED", "job", r.rows[0].id, { title, role });
    return res.json({ success: true, job: r.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/careers/jobs/:id
router.put("/admin/jobs/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const updateRes = await query(
      `UPDATE jobs SET
        role = COALESCE($1, role),
        title = COALESCE($2, title),
        department = COALESCE($3, department),
        location = COALESCE($4, location),
        employment_type = COALESCE($5, employment_type),
        experience = COALESCE($6, experience),
        short_description = COALESCE($7, short_description),
        description = COALESCE($8, description),
        status = COALESCE($9, status),
        updated_at = NOW()
      WHERE id = $10
      RETURNING *;`,
      [
        body.role,
        body.title,
        body.department,
        body.location,
        body.employmentType || body.employment_type,
        body.experience,
        body.shortDescription || body.short_description,
        body.description,
        body.status,
        id,
      ]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Job position not found" });
    }

    return res.json({ success: true, job: updateRes.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/careers/jobs/:id
router.delete("/admin/jobs/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const delRes = await query("DELETE FROM jobs WHERE id = $1 RETURNING id, title;", [id]);
    if (delRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Job position not found" });
    }
    return res.json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/careers/applications
router.get("/admin/applications", requireAdmin, async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";
    const status = req.query.status?.trim() || "";
    const role = req.query.role?.trim() || "";
    const page = parseInt(req.query.page || "1", 10) || 1;
    const limit = parseInt(req.query.limit || "20", 10) || 20;
    const offset = (page - 1) * limit;

    let baseSql = `
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      baseSql += ` AND (a.full_name ILIKE $${params.length} OR a.email ILIKE $${params.length} OR a.application_reference ILIKE $${params.length})`;
    }

    if (status && status !== "all") {
      params.push(status);
      baseSql += ` AND a.status = $${params.length}`;
    }

    if (role && role !== "all") {
      params.push(role);
      baseSql += ` AND (a.role_of_interest = $${params.length} OR a.job_title = $${params.length})`;
    }

    const countRes = await query(`SELECT COUNT(*) as total ${baseSql};`, params);
    const total = parseInt(countRes.rows[0]?.total || "0", 10);

    const queryParams = [...params, limit, offset];
    const dataRes = await query(
      `SELECT a.*, j.slug as job_slug,
        (SELECT COUNT(*) FROM application_notes an WHERE an.application_id = a.id) as notes_count
       ${baseSql}
       ORDER BY a.submitted_at DESC
       LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length};`,
      queryParams
    );

    return res.json({
      success: true,
      applications: dataRes.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/careers/applications/:id
router.get("/admin/applications/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const appRes = await query("SELECT * FROM applications WHERE id = $1;", [id]);
    if (appRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const [notesRes, historyRes] = await Promise.all([
      query("SELECT * FROM application_notes WHERE application_id = $1 ORDER BY created_at DESC;", [id]),
      query("SELECT * FROM application_status_history WHERE application_id = $1 ORDER BY created_at DESC;", [id]),
    ]);

    return res.json({
      success: true,
      application: appRes.rows[0],
      notes: notesRes.rows,
      history: historyRes.rows,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/careers/applications/:id/status
router.put("/admin/applications/:id/status", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body || {};

    const cur = await query("SELECT status, application_reference FROM applications WHERE id = $1;", [id]);
    if (cur.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const prev = cur.rows[0].status;
    await query("UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2;", [status, id]);
    await query(
      `INSERT INTO application_status_history (application_id, previous_status, new_status, changed_by, note, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW());`,
      [id, prev, status, req.admin.name || req.admin.email, note || `Status updated to ${status}`]
    );

    return res.json({ success: true, status });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/careers/applications/:id/notes
router.post("/admin/applications/:id/notes", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body || {};

    if (!note || !note.trim()) {
      return res.status(400).json({ success: false, message: "Note text is required" });
    }

    const r = await query(
      `INSERT INTO application_notes (application_id, note_text, created_by, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *;`,
      [id, note.trim(), req.admin.name || req.admin.email]
    );

    return res.json({ success: true, note: r.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/careers/applications/:id/cv
router.get("/admin/applications/:id/cv", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const r = await query("SELECT resume_storage_path, resume_original_name FROM applications WHERE id = $1;", [id]);
    if (r.rows.length === 0 || !r.rows[0].resume_storage_path) {
      return res.status(404).json({ success: false, message: "CV file not found" });
    }

    const absPath = path.resolve(process.cwd(), r.rows[0].resume_storage_path);
    if (!fs.existsSync(absPath)) {
      return res.status(404).json({ success: false, message: "File does not exist on disk" });
    }

    res.download(absPath, r.rows[0].resume_original_name || "resume.pdf");
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
