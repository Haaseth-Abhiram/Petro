const express = require("express");
const { query } = require("../db");
const { requireAdmin, logAdminAction } = require("../auth");

const router = express.Router();

// GET /api/admin/products
router.get("/products", requireAdmin, async (req, res) => {
  try {
    const search = req.query.search || "";
    const division = req.query.division || "";
    const categorySlug = req.query.category || "";

    let sql = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN product_categories c ON p.category_slug = c.slug
      WHERE 1=1
    `;
    const params = [];

    if (search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(p.name) LIKE $${params.length} OR LOWER(p.slug) LIKE $${params.length} OR LOWER(p.short_description) LIKE $${params.length} OR LOWER(COALESCE(p.material, '')) LIKE $${params.length})`;
    }

    if (division.trim() && division !== "all") {
      params.push(division.trim());
      sql += ` AND p.division = $${params.length}`;
    }

    if (categorySlug.trim() && categorySlug !== "all") {
      params.push(categorySlug.trim());
      sql += ` AND p.category_slug = $${params.length}`;
    }

    sql += ` ORDER BY p.created_at DESC;`;

    const result = await query(sql, params);
    return res.json({ success: true, products: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/products
router.post("/products", requireAdmin, async (req, res) => {
  try {
    const {
      name,
      slug,
      category_slug,
      division,
      short_description,
      overview,
      image,
      featured,
      material,
      size,
      pressure_rating,
      connection_type,
      temperature_range,
      standards,
      specifications,
      key_features,
      applications,
      is_published,
    } = req.body || {};

    if (!name || !category_slug || !division) {
      return res.status(400).json({ success: false, message: "Product name, category, and division are required." });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const insertRes = await query(
      `INSERT INTO products (
        name, slug, category_slug, division, short_description, overview, image,
        featured, material, size, pressure_rating, connection_type, temperature_range,
        standards, specifications, key_features, applications, is_published, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW())
      RETURNING *;`,
      [
        name,
        cleanSlug,
        category_slug,
        division,
        short_description || "",
        overview || "",
        image || "",
        !!featured,
        material || "",
        size || "",
        pressure_rating || "",
        connection_type || "",
        temperature_range || "",
        JSON.stringify(standards || []),
        JSON.stringify(specifications || {}),
        JSON.stringify(key_features || []),
        JSON.stringify(applications || []),
        is_published ?? true,
      ]
    );

    const newProduct = insertRes.rows[0];
    await logAdminAction(req.admin.email, "CREATE_PRODUCT", "products", newProduct.id, {
      name: newProduct.name,
      slug: newProduct.slug,
    });

    return res.json({ success: true, product: newProduct });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/products
router.put("/products", requireAdmin, async (req, res) => {
  try {
    const { id, ...fields } = req.body || {};

    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const updateRes = await query(
      `UPDATE products SET
        name = COALESCE($1, name),
        category_slug = COALESCE($2, category_slug),
        division = COALESCE($3, division),
        short_description = COALESCE($4, short_description),
        overview = COALESCE($5, overview),
        image = COALESCE($6, image),
        featured = COALESCE($7, featured),
        material = COALESCE($8, material),
        size = COALESCE($9, size),
        pressure_rating = COALESCE($10, pressure_rating),
        connection_type = COALESCE($11, connection_type),
        temperature_range = COALESCE($12, temperature_range),
        standards = COALESCE($13, standards),
        specifications = COALESCE($14, specifications),
        key_features = COALESCE($15, key_features),
        applications = COALESCE($16, applications),
        is_published = COALESCE($17, is_published),
        updated_at = NOW()
      WHERE id = $18
      RETURNING *;`,
      [
        fields.name,
        fields.category_slug,
        fields.division,
        fields.short_description,
        fields.overview,
        fields.image,
        fields.featured,
        fields.material,
        fields.size,
        fields.pressure_rating,
        fields.connection_type,
        fields.temperature_range,
        fields.standards ? JSON.stringify(fields.standards) : null,
        fields.specifications ? JSON.stringify(fields.specifications) : null,
        fields.key_features ? JSON.stringify(fields.key_features) : null,
        fields.applications ? JSON.stringify(fields.applications) : null,
        fields.is_published,
        id,
      ]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const updated = updateRes.rows[0];
    await logAdminAction(req.admin.email, "UPDATE_PRODUCT", "products", updated.id, {
      name: updated.name,
      is_published: updated.is_published,
    });

    return res.json({ success: true, product: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/products
router.delete("/products", requireAdmin, async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const delRes = await query("DELETE FROM products WHERE id = $1 RETURNING id, name;", [id]);
    if (delRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await logAdminAction(req.admin.email, "DELETE_PRODUCT", "products", id, {
      name: delRes.rows[0].name,
    });

    return res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
