const express = require("express");
const path = require("path");
const fs = require("fs");
const os = require("os");
const multer = require("multer");
const { randomUUID } = require("crypto");
const { createClient } = require("@supabase/supabase-js");
const { query } = require("../db");
const { requireAdmin, logAdminAction } = require("../auth");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gznvueeroscdfymfuyxf.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Uje5n9Scgfli0rncEI2qIw_dThOfEto";
const supabase = createClient(supabaseUrl, supabaseKey);

const router = express.Router();

// Multer storage for candidate resumes (use os.tmpdir() on serverless/Vercel)
const resumeDir = process.env.VERCEL
  ? path.join(os.tmpdir(), "petronex_uploads", "resumes")
  : path.resolve(process.cwd(), "uploads", "resumes");
try {
  if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
  }
} catch (e) {
  console.warn("Could not create local resumeDir:", e.message);
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

// Middleware supporting both 'cv' and 'resume' field names
const uploadApplicantCV = (req, res, next) => {
  uploadResume.fields([
    { name: "cv", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed. Only .pdf, .doc, and .docx files under 10MB are accepted.",
      });
    }
    next();
  });
};

/* ========================================================
   CAREERS & JOBS ENDPOINTS (PUBLIC & ADMIN)
   ======================================================== */

// GET /api/careers/jobs & /api/admin/careers/jobs
router.get(["/jobs", "/admin/jobs"], async (req, res) => {
  try {
    const isAdmin = req.baseUrl.includes("admin") || req.path.includes("admin") || req.query.admin === "true";
    if (isAdmin) {
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
    }

    // Public published jobs
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

// Handler for Candidate Application Submission
const handleApplicationSubmit = async (req, res) => {
  try {
    const { fullName, email, phone, role, experience, link, message } = req.body || {};

    if (!fullName || !email || !phone || !role) {
      return res.status(400).json({ success: false, message: "Full name, email, phone, and role are required." });
    }

    const ref = `APP-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const resumeFile = req.file || (req.files && (req.files.cv?.[0] || req.files.resume?.[0]));
    const resumePath = resumeFile ? `uploads/resumes/${resumeFile.filename}` : "uploads/resumes/none";
    const resumeName = resumeFile ? resumeFile.originalname : "resume";
    const resumeSize = resumeFile ? Math.round(resumeFile.size) : 0;

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
        String(fullName).trim(),
        String(email).toLowerCase().trim(),
        String(phone).trim(),
        String(role).trim(),
        experience || "Entry",
        link || "",
        message || "Application submitted via online careers portal",
        resumePath,
        resumeName,
        resumeSize,
      ]
    );

    // Upload physical resume to Supabase Storage resumes bucket
    if (resumeFile && fs.existsSync(resumeFile.path)) {
      try {
        const fileBuffer = fs.readFileSync(resumeFile.path);
        const storageKey = `${ref}-${resumeName}`;
        const { error: cloudUploadErr } = await supabase.storage
          .from("resumes")
          .upload(storageKey, fileBuffer, {
            contentType: resumeFile.mimetype || "application/pdf",
            upsert: true,
          });

        if (cloudUploadErr) {
          console.warn("Supabase Storage upload warning:", cloudUploadErr.message);
        } else {
          console.log(`✓ Resume uploaded to Supabase Storage: resumes/${storageKey}`);
        }
      } catch (cloudErr) {
        console.warn("Could not sync to Supabase Storage:", cloudErr.message);
      }
    }

    return res.json({
      success: true,
      message: "Application submitted successfully.",
      reference: ref,
      application: insertRes.rows[0],
    });
  } catch (err) {
    console.error("Application submit error:", err);
    return res.status(500).json({ success: false, message: "Failed to submit application.", error: err.message });
  }
};

// Accept submissions on both POST /api/careers and POST /api/careers/applications/submit
router.post("/", uploadApplicantCV, handleApplicationSubmit);
router.post("/applications/submit", uploadApplicantCV, handleApplicationSubmit);

/* ========================================================
   ADMIN RECRUITMENT & CAREERS ENDPOINTS
   ======================================================== */

// GET Stats
router.get(["/stats", "/admin/stats"], requireAdmin, async (req, res) => {
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

// POST Jobs
router.post(["/jobs", "/admin/jobs"], requireAdmin, async (req, res) => {
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

// PUT Jobs/:id
router.put(["/jobs/:id", "/admin/jobs/:id"], requireAdmin, async (req, res) => {
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

// DELETE Jobs/:id
router.delete(["/jobs/:id", "/admin/jobs/:id"], requireAdmin, async (req, res) => {
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

// GET /api/admin/careers/applications/export (Excel / CSV & Printable PDF Report)
router.get(["/applications/export", "/admin/applications/export"], requireAdmin, async (req, res) => {
  try {
    const format = req.query.format || "excel";
    const search = req.query.search?.trim() || "";
    const status = req.query.status?.trim() || "";
    const role = req.query.role?.trim() || "";

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

    const dataRes = await query(
      `SELECT a.*, j.title as linked_job_title
       ${baseSql}
       ORDER BY a.submitted_at DESC;`,
      params
    );

    const rows = dataRes.rows;

    // 1. Excel / CSV Export
    if (format === "excel" || format === "csv") {
      const headers = [
        "Application Reference",
        "Candidate Name",
        "Email Address",
        "Phone Number",
        "Role of Interest",
        "Experience Level",
        "Hiring Status",
        "Resume File Name",
        "Resume Size",
        "Cover Note",
        "LinkedIn URL",
        "Submitted Date",
      ];

      const escapeCsv = (val) => {
        if (val === null || val === undefined) return '""';
        const s = String(val).replace(/"/g, '""').replace(/\r?\n/g, " ");
        return `"${s}"`;
      };

      const csvRows = [headers.join(",")];
      for (const r of rows) {
        csvRows.push(
          [
            escapeCsv(r.application_reference),
            escapeCsv(r.full_name),
            escapeCsv(r.email),
            escapeCsv(r.phone),
            escapeCsv(r.role_of_interest || r.job_title),
            escapeCsv(r.experience),
            escapeCsv(r.status),
            escapeCsv(r.resume_original_name || "N/A"),
            escapeCsv(r.resume_file_size ? `${(r.resume_file_size / 1024).toFixed(1)} KB` : "N/A"),
            escapeCsv(r.cover_note),
            escapeCsv(r.linkedin_url || ""),
            escapeCsv(r.submitted_at ? new Date(r.submitted_at).toLocaleString("en-IN") : ""),
          ].join(",")
        );
      }

      const csvContent = "\uFEFF" + csvRows.join("\r\n"); // UTF-8 BOM for Microsoft Excel
      const dateStr = new Date().toISOString().slice(0, 10);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="Petronex_Candidates_Export_${dateStr}.csv"`);
      return res.send(Buffer.from(csvContent, "utf8"));
    }

    // 2. Printable PDF Summary Report
    const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const statusCounts = rows.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Petronex - Candidate Applications Report (${dateStr})</title>
  <style>
    @page { size: A4 landscape; margin: 10mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #17191C; margin: 0; padding: 20px; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #C80808; padding-bottom: 12px; margin-bottom: 16px; }
    .brand h1 { margin: 0; font-size: 22px; font-weight: 900; color: #C80808; text-transform: uppercase; letter-spacing: 0.5px; }
    .brand p { margin: 2px 0 0; font-size: 11px; color: #5F6871; font-weight: 600; }
    .meta { text-align: right; font-size: 11px; color: #5F6871; }
    .meta strong { color: #17191C; }
    .kpi-row { display: flex; gap: 10px; margin-bottom: 16px; }
    .kpi-card { flex: 1; border: 1px solid #E7E9EE; border-radius: 8px; padding: 8px 12px; background: #FAFAFB; }
    .kpi-num { font-size: 18px; font-weight: 900; color: #17191C; }
    .kpi-label { font-size: 10px; color: #5F6871; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; }
    th { background: #17191C; color: #fff; text-align: left; padding: 7px 9px; font-weight: 800; text-transform: uppercase; font-size: 9.5px; letter-spacing: 0.5px; }
    td { padding: 7px 9px; border-bottom: 1px solid #E7E9EE; }
    tr:nth-child(even) { background: #FAFAFB; }
    .badge { display: inline-block; padding: 2px 7px; border-radius: 10px; font-weight: 700; font-size: 9.5px; }
    .badge-New { background: #EFF6FF; color: #1D4ED8; }
    .badge-Under-Review { background: #FEF3C7; color: #B45309; }
    .badge-Shortlisted { background: #EEF2FF; color: #4338CA; }
    .badge-Selected { background: #ECFDF5; color: #047857; }
    .badge-Rejected { background: #FEE2E2; color: #B91C1C; }
    .print-bar { position: fixed; bottom: 16px; right: 16px; background: #17191C; color: #fff; padding: 10px 18px; border-radius: 10px; box-shadow: 0 8px 20px rgba(0,0,0,0.25); display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 700; }
    .print-btn { background: #C80808; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; font-weight: 800; cursor: pointer; }
    @media print {
      body { padding: 0; }
      .print-bar { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <h1>PETRONEX ENGINEERING</h1>
      <p>Industrial Piping, Valves & Chemical Engineering • Candidate Recruitment Records</p>
    </div>
    <div class="meta">
      <p>Report Date: <strong>${dateStr}</strong></p>
      <p>Total Candidates: <strong>${rows.length}</strong></p>
    </div>
  </div>

  <div class="kpi-row">
    <div class="kpi-card"><div class="kpi-num">${rows.length}</div><div class="kpi-label">Total Candidates</div></div>
    <div class="kpi-card"><div class="kpi-num" style="color:#1D4ED8;">${statusCounts["New"] || 0}</div><div class="kpi-label">New Submissions</div></div>
    <div class="kpi-card"><div class="kpi-num" style="color:#B45309;">${statusCounts["Under Review"] || 0}</div><div class="kpi-label">Under Review</div></div>
    <div class="kpi-card"><div class="kpi-num" style="color:#4338CA;">${statusCounts["Shortlisted"] || 0}</div><div class="kpi-label">Shortlisted</div></div>
    <div class="kpi-card"><div class="kpi-num" style="color:#047857;">${statusCounts["Selected"] || 0}</div><div class="kpi-label">Selected</div></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Reference</th>
        <th>Candidate Name</th>
        <th>Role Applied</th>
        <th>Experience</th>
        <th>Contact Email</th>
        <th>Phone</th>
        <th>Resume File</th>
        <th>Status</th>
        <th>Submitted Date</th>
      </tr>
    </thead>
    <tbody>
      ${rows.map((r) => `
        <tr>
          <td><strong style="font-family: monospace; color:#C80808;">${r.application_reference}</strong></td>
          <td><strong>${r.full_name}</strong></td>
          <td>${r.role_of_interest || r.job_title || "General"}</td>
          <td>${r.experience}</td>
          <td>${r.email}</td>
          <td>${r.phone}</td>
          <td>${r.resume_original_name || "N/A"}</td>
          <td><span class="badge badge-${(r.status || "New").replace(/\s+/g, "-")}">${r.status}</span></td>
          <td>${r.submitted_at ? new Date(r.submitted_at).toLocaleDateString("en-IN") : "-"}</td>
        </tr>
      `).join("")}
      ${rows.length === 0 ? '<tr><td colspan="9" style="text-align:center; padding: 20px; color:#5F6871;">No candidate applications found matching the selected criteria.</td></tr>' : ""}
    </tbody>
  </table>

  <div class="print-bar">
    <span>Ready to save or print this report</span>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  ${req.query.auto === "true" ? "<script>window.addEventListener('DOMContentLoaded', () => { setTimeout(() => window.print(), 350); });</script>" : ""}
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(html);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET Applications List
router.get(["/applications", "/admin/applications"], requireAdmin, async (req, res) => {
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

// GET Application Detail by ID
router.get(["/applications/:id", "/admin/applications/:id"], requireAdmin, async (req, res) => {
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

// PUT Application Status
router.put(["/applications/:id/status", "/admin/applications/:id/status"], requireAdmin, async (req, res) => {
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

// POST Application Note
router.post(["/applications/:id/notes", "/admin/applications/:id/notes"], requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body || {};

    if (!note || !note.trim()) {
      return res.status(400).json({ success: false, message: "Note text is required" });
    }

    const r = await query(
      `INSERT INTO application_notes (application_id, admin_email, admin_name, note, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *;`,
      [id, req.admin.email, req.admin.name || req.admin.email, note.trim()]
    );

    return res.json({ success: true, note: r.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET Application CV Download & In-browser Preview
router.get(["/applications/:id/cv", "/admin/applications/:id/cv"], requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const r = await query(
      "SELECT application_reference, resume_storage_path, resume_original_name FROM applications WHERE id = $1;",
      [id]
    );
    if (r.rows.length === 0 || !r.rows[0].resume_storage_path) {
      return res.status(404).json({ success: false, message: "CV file not found" });
    }

    const row = r.rows[0];
    const isPreview = req.query.preview === "true" || req.query.inline === "true";
    const filename = row.resume_original_name || path.basename(row.resume_storage_path) || "resume.pdf";

    // If stored as full Supabase Storage URL
    if (row.resume_storage_path.startsWith("http://") || row.resume_storage_path.startsWith("https://")) {
      return res.redirect(
        isPreview ? row.resume_storage_path : `${row.resume_storage_path}?download=${encodeURIComponent(filename)}`
      );
    }

    const absPath = path.resolve(process.cwd(), row.resume_storage_path);
    if (!fs.existsSync(absPath)) {
      // Serverless/Vercel fallback: check Supabase Storage bucket 'resumes'
      const candidateKey = `${row.application_reference}-${filename}`;
      const { data: pub } = supabase.storage.from("resumes").getPublicUrl(candidateKey);
      if (pub?.publicUrl) {
        return res.redirect(
          isPreview ? pub.publicUrl : `${pub.publicUrl}?download=${encodeURIComponent(filename)}`
        );
      }
      return res.status(404).json({ success: false, message: "File does not exist on disk or storage" });
    }

    const ext = path.extname(filename).toLowerCase();

    if (isPreview) {
      if (ext === ".pdf") {
        res.setHeader("Content-Type", "application/pdf");
      } else if (ext === ".png") {
        res.setHeader("Content-Type", "image/png");
      } else if (ext === ".jpg" || ext === ".jpeg") {
        res.setHeader("Content-Type", "image/jpeg");
      } else {
        res.setHeader("Content-Type", "application/octet-stream");
      }
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
      return res.sendFile(absPath);
    }

    return res.download(absPath, filename);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Categories Endpoints
router.get(["/categories", "/admin/categories"], async (req, res) => {
  try {
    const r = await query("SELECT * FROM job_categories ORDER BY display_order ASC, name ASC;");
    return res.json({ success: true, categories: r.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post(["/categories", "/admin/categories"], requireAdmin, async (req, res) => {
  try {
    const { name, slug, description, displayOrder, isActive } = req.body || {};
    if (!name) return res.status(400).json({ success: false, message: "Category name is required" });
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const r = await query(
      `INSERT INTO job_categories (name, slug, description, display_order, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *;`,
      [name, finalSlug, description || null, Number(displayOrder) || 0, isActive !== false]
    );
    return res.json({ success: true, category: r.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.put(["/categories/:id", "/admin/categories/:id"], requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, displayOrder, isActive } = req.body || {};
    const r = await query(
      `UPDATE job_categories SET
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        description = COALESCE($3, description),
        display_order = COALESCE($4, display_order),
        is_active = COALESCE($5, is_active),
        updated_at = NOW()
       WHERE id = $6
       RETURNING *;`,
      [name, slug, description, displayOrder, isActive, id]
    );
    if (r.rows.length === 0) return res.status(404).json({ success: false, message: "Category not found" });
    return res.json({ success: true, category: r.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.delete(["/categories/:id", "/admin/categories/:id"], requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const r = await query("DELETE FROM job_categories WHERE id = $1 RETURNING id, name;", [id]);
    if (r.rows.length === 0) return res.status(404).json({ success: false, message: "Category not found" });
    return res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Settings Endpoints
router.get(["/settings", "/admin/settings"], async (req, res) => {
  try {
    const r = await query("SELECT value FROM recruitment_settings WHERE key = 'general' LIMIT 1;");
    const settings = r.rows[0]?.value || {
      notification_email: "hr@petroeng.in, sales@petroeng.in",
      auto_acknowledge: true,
      acknowledgement_subject: "Thank you for applying to Petro Engineering",
      cv_max_size_mb: 5,
      allowed_extensions: [".pdf", ".doc", ".docx"],
      allow_general_applications: true,
      retention_period_months: 24,
      recruitment_contact_phone: "+91 96521 11021",
      recruitment_contact_email: "careers@petroeng.in",
    };
    return res.json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post(["/settings", "/admin/settings"], requireAdmin, async (req, res) => {
  try {
    const settings = req.body || {};
    await query(
      `INSERT INTO recruitment_settings (key, value, updated_at)
       VALUES ('general', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET
         value = EXCLUDED.value,
         updated_at = NOW();`,
      [JSON.stringify(settings)]
    );
    return res.json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
