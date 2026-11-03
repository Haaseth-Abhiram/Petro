import pg from 'pg';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { CHEMICAL_CATEGORIES, INSTRUMENTATION_CATEGORIES } = require('./temp-data/categories.js');
const { PRODUCTS } = require('./temp-data/products.js');
const { SERVICES } = require('./temp-data/services.js');
const { INDUSTRIES } = require('./temp-data/industries.js');
const { RESOURCES } = require('./temp-data/resources.js');

const { Client } = pg;
const uri = process.env.DATABASE_URL || "postgresql://postgres.gznvueeroscdfymfuyxf:XQ3FttXtDTdiL46M@aws-0-eu-north-1.pooler.supabase.com:6543/postgres";

async function seedCatalogue() {
  const client = new Client({
    connectionString: uri,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected to Supabase.");

    // 1. Seed Categories
    console.log("Seeding product categories...");
    const allCategories = [
      ...(CHEMICAL_CATEGORIES || []),
      ...(INSTRUMENTATION_CATEGORIES || [])
    ];

    let catOrder = 0;
    for (const cat of allCategories) {
      catOrder++;
      await client.query(`
        INSERT INTO product_categories (
          slug, division, name, short_description, detailed_description, image,
          key_products, applications, standards, display_order, is_published
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
        ON CONFLICT (slug) DO UPDATE SET
          division = EXCLUDED.division,
          name = EXCLUDED.name,
          short_description = EXCLUDED.short_description,
          detailed_description = EXCLUDED.detailed_description,
          image = EXCLUDED.image,
          key_products = EXCLUDED.key_products,
          applications = EXCLUDED.applications,
          standards = EXCLUDED.standards,
          display_order = EXCLUDED.display_order;
      `, [
        cat.slug,
        cat.division,
        cat.name,
        cat.shortDescription || '',
        cat.detailedDescription || '',
        cat.image || '',
        JSON.stringify(cat.keyProducts || []),
        JSON.stringify(cat.applications || []),
        JSON.stringify(cat.standards || []),
        catOrder
      ]);
    }
    console.log(`✓ Seeded ${allCategories.length} categories.`);

    // 2. Seed Products
    console.log("Seeding products...");
    for (const p of (PRODUCTS || [])) {
      await client.query(`
        INSERT INTO products (
          slug, category_slug, division, name, short_description, overview,
          image, featured, material, size, pressure_rating, connection_type,
          temperature_range, standards, specifications, key_features, applications,
          package_options, is_published
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, true)
        ON CONFLICT (slug) DO UPDATE SET
          category_slug = EXCLUDED.category_slug,
          division = EXCLUDED.division,
          name = EXCLUDED.name,
          short_description = EXCLUDED.short_description,
          overview = EXCLUDED.overview,
          image = EXCLUDED.image,
          featured = EXCLUDED.featured,
          material = EXCLUDED.material,
          size = EXCLUDED.size,
          pressure_rating = EXCLUDED.pressure_rating,
          connection_type = EXCLUDED.connection_type,
          temperature_range = EXCLUDED.temperature_range,
          standards = EXCLUDED.standards,
          specifications = EXCLUDED.specifications,
          key_features = EXCLUDED.key_features,
          applications = EXCLUDED.applications,
          package_options = EXCLUDED.package_options,
          updated_at = NOW();
      `, [
        p.slug,
        p.categorySlug,
        p.division,
        p.name,
        p.shortDescription || '',
        p.overview || '',
        p.image || '',
        !!p.featured,
        p.material || '',
        p.size || '',
        p.pressureRating || '',
        p.connectionType || '',
        p.temperatureRange || '',
        JSON.stringify(p.standards || []),
        JSON.stringify(p.specifications || {}),
        JSON.stringify(p.keyFeatures || []),
        JSON.stringify(p.applications || []),
        JSON.stringify(p.packageOptions || [])
      ]);
    }
    console.log(`✓ Seeded ${PRODUCTS.length} products.`);

    // 3. Seed Services
    console.log("Seeding services...");
    let servOrder = 0;
    for (const s of (SERVICES || [])) {
      servOrder++;
      await client.query(`
        INSERT INTO services (
          slug, title, short_desc, overview, icon_name, image,
          key_activities, benefits, related_products, related_industries,
          display_order, is_published
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          short_desc = EXCLUDED.short_desc,
          overview = EXCLUDED.overview,
          icon_name = EXCLUDED.icon_name,
          image = EXCLUDED.image,
          key_activities = EXCLUDED.key_activities,
          benefits = EXCLUDED.benefits,
          related_products = EXCLUDED.related_products,
          related_industries = EXCLUDED.related_industries,
          display_order = EXCLUDED.display_order;
      `, [
        s.slug,
        s.title,
        s.shortDescription || '',
        s.overview || '',
        s.iconName || 'Flame',
        s.image || '',
        JSON.stringify(s.keyActivities || []),
        JSON.stringify(s.benefits || []),
        JSON.stringify(s.relatedProducts || []),
        JSON.stringify(s.relatedIndustries || []),
        servOrder
      ]);
    }
    console.log(`✓ Seeded ${SERVICES.length} services.`);

    // 4. Seed Industries
    console.log("Seeding industries...");
    let indOrder = 0;
    for (const ind of (INDUSTRIES || [])) {
      indOrder++;
      await client.query(`
        INSERT INTO industries (
          slug, name, tagline, short_overview, detailed_overview, image,
          common_requirements, relevant_products, relevant_services,
          display_order, is_published
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          tagline = EXCLUDED.tagline,
          short_overview = EXCLUDED.short_overview,
          detailed_overview = EXCLUDED.detailed_overview,
          image = EXCLUDED.image,
          common_requirements = EXCLUDED.common_requirements,
          relevant_products = EXCLUDED.relevant_products,
          relevant_services = EXCLUDED.relevant_services,
          display_order = EXCLUDED.display_order;
      `, [
        ind.slug,
        ind.name,
        ind.tagline || '',
        ind.shortOverview || '',
        ind.detailedOverview || '',
        ind.image || '',
        JSON.stringify(ind.commonRequirements || []),
        JSON.stringify(ind.relevantProducts || []),
        JSON.stringify(ind.relevantServices || []),
        indOrder
      ]);
    }
    console.log(`✓ Seeded ${INDUSTRIES.length} industries.`);

    // 5. Seed Documents
    console.log("Seeding documents...");
    for (const r of (RESOURCES || [])) {
      await client.query(`
        INSERT INTO documents (
          title, category, type, description, file_url, file_size, is_published
        )
        VALUES ($1, $2, $3, $4, $5, $6, true);
      `, [
        r.title,
        r.category,
        r.type,
        r.description || '',
        r.downloadUrl || '/resources',
        r.fileSize || '2.4 MB'
      ]);
    }
    console.log(`✓ Seeded ${RESOURCES.length} documents.`);

    console.log("\nALL CATALOGUE DATA SEEDED TO SUPABASE SUCCESSFULLY!");
    await client.end();
  } catch (err) {
    console.error("Seeding error:", err);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
}

seedCatalogue();
