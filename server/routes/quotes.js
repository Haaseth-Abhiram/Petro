const express = require("express");
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

module.exports = router;
