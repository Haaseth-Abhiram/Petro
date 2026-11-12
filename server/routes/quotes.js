const express = require("express");
const path = require("path");
const fs = require("fs");
const { query } = require("../db");
const { requireAdmin, logAdminAction } = require("../auth");
const { sendRfqStatusUpdateEmail } = require("../email");

const router = express.Router();

// GET /api/admin/quote-requests
router.get("/quote-requests", requireAdmin, async (req, res) => {
  try {
    const search = req.query.search || "";
    const status = req.query.status || "";

    let sql = `SELECT * FROM rfq_submissions WHERE 1=1`;
    const params = [];

    if (search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(full_name) LIKE $${params.length} OR LOWER(company_name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR LOWER(product_name) LIKE $${params.length} OR LOWER(product_category) LIKE $${params.length})`;
    }

    if (status.trim() && status !== "all") {
      params.push(status.trim());
      sql += ` AND status = $${params.length}`;
    }

    sql += ` ORDER BY created_at DESC;`;

    const [result, countsRes] = await Promise.all([
      query(sql, params),
      query(`
        SELECT status, COUNT(*)::int AS count
        FROM rfq_submissions
        GROUP BY status;
      `),
    ]);

    const statusCounts = {};
    let totalAll = 0;
    (countsRes.rows || []).forEach((r) => {
      const s = r.status || "new";
      statusCounts[s] = r.count;
      totalAll += r.count;
    });

    return res.json({
      success: true,
      quoteRequests: result.rows,
      counts: statusCounts,
      totalAll,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/quote-requests
router.patch("/quote-requests", requireAdmin, async (req, res) => {
  try {
    const { id, status, internal_notes, quote_amount } = req.body || {};

    if (!id) {
      return res.status(400).json({ success: false, message: "Quote Request ID is required" });
    }

    const updateRes = await query(
      `UPDATE rfq_submissions SET
        status = COALESCE($1, status),
        internal_notes = COALESCE($2, internal_notes),
        quote_amount = COALESCE($3, quote_amount)
      WHERE id = $4
      RETURNING *;`,
      [status, internal_notes, quote_amount, id]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Quote request not found" });
    }

    const updated = updateRes.rows[0];
    await logAdminAction(req.admin.email, "UPDATE_RFQ_STATUS", "quote_requests", updated.id, {
      status: updated.status,
      company: updated.company_name,
      product: updated.product_name,
    });

    if (updated.email) {
      try {
        await sendRfqStatusUpdateEmail({
          id: updated.id,
          fullName: updated.full_name,
          email: updated.email,
          companyName: updated.company_name,
          productName: updated.product_name,
          quantity: updated.quantity,
          status: updated.status,
          quoteAmount: updated.quote_amount,
          internalNotes: updated.internal_notes,
          isNew: false,
        });
      } catch (emailErr) {
        console.warn("RFQ status email notification failed:", emailErr.message);
      }
    }

    return res.json({ success: true, quoteRequest: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});

// DELETE /api/admin/quote-requests
router.delete("/quote-requests", requireAdmin, async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ success: false, message: "Quote Request ID is required" });
    }

    const delRes = await query("DELETE FROM rfq_submissions WHERE id = $1 RETURNING id, company_name, product_name;", [id]);
    if (delRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Quote request not found" });
    }

    await logAdminAction(req.admin.email, "DELETE_RFQ", "quote_requests", id, {
      company: delRes.rows[0].company_name,
      product: delRes.rows[0].product_name,
    });

    return res.json({ success: true, message: "Quote request deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/quote-requests/:id/attachment (Preview or Download attached RFQ file)
router.get("/quote-requests/:id/attachment", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const r = await query("SELECT attachment_name, attachment_path FROM rfq_submissions WHERE id = $1;", [id]);
    if (r.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Quote request not found" });
    }

    const row = r.rows[0];
    if (!row.attachment_path) {
      return res.status(404).json({ success: false, message: "No physical attachment stored for this RFQ." });
    }

    const isPreview = req.query.preview === "true" || req.query.inline === "true";

    // If stored in Supabase Cloud Storage URL
    if (row.attachment_path.startsWith("http://") || row.attachment_path.startsWith("https://")) {
      if (isPreview) {
        return res.redirect(row.attachment_path);
      }
      return res.redirect(`${row.attachment_path}?download=${encodeURIComponent(row.attachment_name || "attachment")}`);
    }

    // Local disk file
    const absPath = path.resolve(process.cwd(), row.attachment_path);
    if (!fs.existsSync(absPath)) {
      return res.status(404).json({ success: false, message: "Attachment file not found on disk." });
    }

    const filename = row.attachment_name || path.basename(absPath) || "attachment.pdf";
    const ext = path.extname(filename).toLowerCase();

    if (isPreview) {
      if (ext === ".pdf") res.setHeader("Content-Type", "application/pdf");
      else if (ext === ".png") res.setHeader("Content-Type", "image/png");
      else if (ext === ".jpg" || ext === ".jpeg") res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
      return res.sendFile(absPath);
    }

    return res.download(absPath, filename);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
