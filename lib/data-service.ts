import { query } from "./db";
import { PRODUCTS, ProductItem } from "@/data/products";
import {
  CHEMICAL_CATEGORIES,
  INSTRUMENTATION_CATEGORIES,
  CategoryItem,
} from "@/data/categories";

export async function getPublishedProducts(division?: "chemicals" | "instrumentation"): Promise<ProductItem[]> {
  try {
    let sql = "SELECT * FROM products WHERE is_published = true";
    const params: any[] = [];
    if (division) {
      params.push(division);
      sql += " AND division = $1";
    }
    sql += " ORDER BY created_at DESC;";

    const res = await query(sql, params);
    if (res.rows && res.rows.length > 0) {
      return res.rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        categorySlug: row.category_slug,
        division: row.division,
        name: row.name,
        shortDescription: row.short_description || "",
        overview: row.overview || "",
        image: row.image || "",
        featured: row.featured,
        material: row.material,
        size: row.size,
        pressureRating: row.pressure_rating,
        connectionType: row.connection_type,
        temperatureRange: row.temperature_range,
        standards: row.standards || [],
        specifications: row.specifications || {},
        keyFeatures: row.key_features || [],
        applications: row.applications || [],
        packageOptions: row.package_options || [],
      }));
    }
  } catch (err) {
    console.warn("Falling back to static products:", err);
  }

  // Graceful fallback
  if (division) {
    return PRODUCTS.filter((p) => p.division === division);
  }
  return PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  try {
    const res = await query(
      "SELECT * FROM products WHERE slug = $1 AND is_published = true LIMIT 1;",
      [slug]
    );
    if (res.rows && res.rows.length > 0) {
      const row = res.rows[0];
      return {
        id: row.id,
        slug: row.slug,
        categorySlug: row.category_slug,
        division: row.division,
        name: row.name,
        shortDescription: row.short_description || "",
        overview: row.overview || "",
        image: row.image || "",
        featured: row.featured,
        material: row.material,
        size: row.size,
        pressureRating: row.pressure_rating,
        connectionType: row.connection_type,
        temperatureRange: row.temperature_range,
        standards: row.standards || [],
        specifications: row.specifications || {},
        keyFeatures: row.key_features || [],
        applications: row.applications || [],
        packageOptions: row.package_options || [],
      };
    }
  } catch (err) {
    console.warn("Falling back to static product by slug:", err);
  }

  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export async function getPublishedCategories(division?: "chemicals" | "instrumentation"): Promise<CategoryItem[]> {
  try {
    let sql = "SELECT * FROM product_categories WHERE is_published = true";
    const params: any[] = [];
    if (division) {
      params.push(division);
      sql += " AND division = $1";
    }
    sql += " ORDER BY display_order ASC, name ASC;";

    const res = await query(sql, params);
    if (res.rows && res.rows.length > 0) {
      return res.rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        division: row.division,
        name: row.name,
        shortDescription: row.short_description || "",
        detailedDescription: row.detailed_description || "",
        image: row.image || "",
        keyProducts: row.key_products || [],
        applications: row.applications || [],
        standards: row.standards || [],
      }));
    }
  } catch (err) {
    console.warn("Falling back to static categories:", err);
  }

  if (division === "chemicals") return CHEMICAL_CATEGORIES;
  if (division === "instrumentation") return INSTRUMENTATION_CATEGORIES;
  return [...CHEMICAL_CATEGORIES, ...INSTRUMENTATION_CATEGORIES];
}

export async function getCategoryBySlug(slug: string): Promise<CategoryItem | null> {
  try {
    const res = await query(
      "SELECT * FROM product_categories WHERE slug = $1 AND is_published = true LIMIT 1;",
      [slug]
    );
    if (res.rows && res.rows.length > 0) {
      const row = res.rows[0];
      return {
        id: row.id,
        slug: row.slug,
        division: row.division,
        name: row.name,
        shortDescription: row.short_description || "",
        detailedDescription: row.detailed_description || "",
        image: row.image || "",
        keyProducts: row.key_products || [],
        applications: row.applications || [],
        standards: row.standards || [],
      };
    }
  } catch (err) {
    console.warn("Falling back to static category by slug:", err);
  }

  return (
    [...CHEMICAL_CATEGORIES, ...INSTRUMENTATION_CATEGORIES].find(
      (c) => c.slug === slug
    ) || null
  );
}
