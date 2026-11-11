const express = require("express");
const { query } = require("../db");
const { requireAdmin, logAdminAction } = require("../auth");

const router = express.Router();

// GET /api/admin/categories
router.get("/categories", requireAdmin, async (req, res) => {
  try {
    const division = req.query.division;

    let sql = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM product_categories c
      LEFT JOIN products p ON c.slug = p.category_slug
    `;
    const params = [];

    if (division && division !== "all") {
      params.push(division);
      sql += ` WHERE c.division = $1`;
    }

    sql += ` GROUP BY c.id ORDER BY c.division, c.display_order ASC, c.name ASC;`;

    const result = await query(sql, params);
    return res.json({ success: true, categories: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/categories
router.post("/categories", requireAdmin, async (req, res) => {
  try {
    const {
      slug,
      division,
      name,
      short_description,
      detailed_description,
      image,
      key_products,
      applications,
      standards,
      display_order,
      is_published,
    } = req.body || {};

    if (!name || !division) {
      return res.status(400).json({ success: false, message: "Category name and division are required." });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const insertRes = await query(
      `INSERT INTO product_categories (
        slug, division, name, short_description, detailed_description,
        image, key_products, applications, standards, display_order, is_published
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;`,
      [
        cleanSlug,
        division,
        name,
        short_description || "",
        detailed_description || "",
        image || "",
        JSON.stringify(key_products || []),
        JSON.stringify(applications || []),
        JSON.stringify(standards || []),
        display_order || 0,
        is_published ?? true,
      ]
    );

    const newCat = insertRes.rows[0];
    await logAdminAction(req.admin.email, "CREATE_CATEGORY", "categories", newCat.id, {
      name: newCat.name,
      slug: newCat.slug,
    });

    return res.json({ success: true, category: newCat });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/categories
router.put("/categories", requireAdmin, async (req, res) => {
  try {
    const { id, ...fields } = req.body || {};

    if (!id) {
      return res.status(400).json({ success: false, message: "Category ID is required" });
    }

    const updateRes = await query(
      `UPDATE product_categories SET
        name = COALESCE($1, name),
        division = COALESCE($2, division),
        short_description = COALESCE($3, short_description),
        detailed_description = COALESCE($4, detailed_description),
        image = COALESCE($5, image),
        key_products = COALESCE($6, key_products),
        applications = COALESCE($7, applications),
        standards = COALESCE($8, standards),
        display_order = COALESCE($9, display_order),
        is_published = COALESCE($10, is_published)
      WHERE id = $11
      RETURNING *;`,
      [
        fields.name,
        fields.division,
        fields.short_description,
        fields.detailed_description,
        fields.image,
        fields.key_products ? JSON.stringify(fields.key_products) : null,
        fields.applications ? JSON.stringify(fields.applications) : null,
        fields.standards ? JSON.stringify(fields.standards) : null,
        fields.display_order,
        fields.is_published,
        id,
      ]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const updated = updateRes.rows[0];
    await logAdminAction(req.admin.email, "UPDATE_CATEGORY", "categories", updated.id, {
      name: updated.name,
      is_published: updated.is_published,
    });

    return res.json({ success: true, category: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/categories
router.delete("/categories", requireAdmin, async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ success: false, message: "Category ID is required" });
    }

    const catCheck = await query("SELECT slug, name FROM product_categories WHERE id = $1;", [id]);
    if (catCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const cat = catCheck.rows[0];

    const countCheck = await query("SELECT COUNT(*) as count FROM products WHERE category_slug = $1;", [cat.slug]);
    const pCount = parseInt(countCheck.rows[0]?.count || "0", 10);
    if (pCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category because it contains ${pCount} active products. Reassign or delete those products first.`,
      });
    }

    await query("DELETE FROM product_categories WHERE id = $1;", [id]);
    await logAdminAction(req.admin.email, "DELETE_CATEGORY", "categories", id, { name: cat.name });

    return res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
