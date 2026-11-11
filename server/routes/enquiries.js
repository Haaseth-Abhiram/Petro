const express = require("express");
const { query } = require("../db");
const { requireAdmin, logAdminAction } = require("../auth");
const { sendEnquiryStatusUpdateEmail } = require("../email");

const router = express.Router();

// GET /api/admin/enquiries
router.get("/enquiries", requireAdmin, async (req, res) => {
  try {
    const search = req.query.search || "";
    const status = req.query.status || "";
    const type = req.query.type || "all";

    let sql = `SELECT * FROM contact_messages WHERE 1=1`;
    const params = [];

    if (search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(full_name) LIKE $${params.length} OR LOWER(company_name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR LOWER(subject) LIKE $${params.length} OR LOWER(message) LIKE $${params.length})`;
    }

    if (status.trim() && status !== "all") {
      params.push(status.trim());
      sql += ` AND status = $${params.length}`;
    }

    if (type === "suggestions") {
      sql += ` AND (LOWER(subject) LIKE '%suggestion%' OR LOWER(subject) LIKE '%feedback%' OR LOWER(message) LIKE '%suggestion%')`;
    } else if (type === "enquiries") {
      sql += ` AND NOT (LOWER(subject) LIKE '%suggestion%' OR LOWER(subject) LIKE '%feedback%')`;
    }

    sql += ` ORDER BY created_at DESC;`;

    const [result, countsRes] = await Promise.all([
      query(sql, params),
      query(`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE LOWER(subject) LIKE '%suggestion%' OR LOWER(subject) LIKE '%feedback%' OR LOWER(message) LIKE '%suggestion%') as suggestions_count,
          COUNT(*) FILTER (WHERE NOT (LOWER(subject) LIKE '%suggestion%' OR LOWER(subject) LIKE '%feedback%')) as enquiries_count,
          COUNT(*) FILTER (WHERE status = 'new') as status_new,
          COUNT(*) FILTER (WHERE status = 'in_progress') as status_in_progress,
          COUNT(*) FILTER (WHERE status = 'responded') as status_responded,
          COUNT(*) FILTER (WHERE status = 'closed') as status_closed
        FROM contact_messages;
      `),
    ]);

    const counts = countsRes.rows[0] || {};

    return res.json({
      success: true,
      enquiries: result.rows,
      counts: {
        total: parseInt(counts.total || "0", 10),
        suggestions: parseInt(counts.suggestions_count || "0", 10),
        enquiries: parseInt(counts.enquiries_count || "0", 10),
      },
      statusCounts: {
        new: parseInt(counts.status_new || "0", 10),
        in_progress: parseInt(counts.status_in_progress || "0", 10),
        responded: parseInt(counts.status_responded || "0", 10),
        closed: parseInt(counts.status_closed || "0", 10),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/enquiries
router.patch("/enquiries", requireAdmin, async (req, res) => {
  try {
    const { id, status, internal_notes } = req.body || {};

    if (!id) {
      return res.status(400).json({ success: false, message: "Enquiry ID is required" });
    }

    const updateRes = await query(
      `UPDATE contact_messages SET
        status = COALESCE($1, status),
        internal_notes = COALESCE($2, internal_notes)
      WHERE id = $3
      RETURNING *;`,
      [status, internal_notes, id]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    const updated = updateRes.rows[0];
    await logAdminAction(req.admin.email, "UPDATE_ENQUIRY_STATUS", "enquiries", updated.id, {
      status: updated.status,
      contact: updated.full_name,
    });

    if (updated.email) {
      try {
        await sendEnquiryStatusUpdateEmail({
          id: updated.id,
          fullName: updated.full_name,
          email: updated.email,
          companyName: updated.company_name,
          subject: updated.subject,
          status: updated.status,
          internalNotes: updated.internal_notes,
          isNew: false,
        });
      } catch (emailErr) {
        console.warn("Enquiry status email notification failed:", emailErr.message);
      }
    }

    return res.json({ success: true, enquiry: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});

// DELETE /api/admin/enquiries
router.delete("/enquiries", requireAdmin, async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ success: false, message: "Enquiry ID is required" });
    }

    const delRes = await query("DELETE FROM contact_messages WHERE id = $1 RETURNING id, full_name;", [id]);
    if (delRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    await logAdminAction(req.admin.email, "DELETE_ENQUIRY", "enquiries", id, {
      contact: delRes.rows[0].full_name,
    });

    return res.json({ success: true, message: "Enquiry deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
