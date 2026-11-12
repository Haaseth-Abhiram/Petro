import pg from 'pg';

const { Client } = pg;

const uri = process.env.DATABASE_URL || process.env.DATABASE_URL;

async function setupCareersDatabase() {
  console.log("Connecting to PostgreSQL...");
  const client = new Client({
    connectionString: uri.split('?')[0],
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected successfully.");

    // 1. Job Categories Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        slug VARCHAR(150) UNIQUE NOT NULL,
        description TEXT,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ job_categories table verified.");

    // 2. Jobs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        role VARCHAR(150) NOT NULL,
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(200) UNIQUE NOT NULL,
        department VARCHAR(100) NOT NULL,
        category_id UUID REFERENCES job_categories(id) ON DELETE SET NULL,
        location VARCHAR(150) NOT NULL DEFAULT 'Mumbai, India',
        employment_type VARCHAR(50) NOT NULL DEFAULT 'Full-time',
        experience VARCHAR(100) NOT NULL DEFAULT '2+ years',
        short_description TEXT NOT NULL,
        description TEXT,
        responsibilities JSONB DEFAULT '[]'::jsonb,
        qualifications JSONB DEFAULT '[]'::jsonb,
        required_skills JSONB DEFAULT '[]'::jsonb,
        optional_skills JSONB DEFAULT '[]'::jsonb,
        image TEXT DEFAULT '/assets/img/tube-fittings.jpg',
        display_order INT DEFAULT 0,
        application_deadline TIMESTAMPTZ,
        status VARCHAR(30) DEFAULT 'published', -- 'published', 'draft', 'closed'
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        published_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ jobs table verified.");

    // 3. Applications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_reference VARCHAR(50) UNIQUE NOT NULL,
        job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
        job_title VARCHAR(200),
        full_name VARCHAR(150) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(150) NOT NULL,
        role_of_interest VARCHAR(150) NOT NULL,
        experience VARCHAR(100) NOT NULL,
        linkedin_url TEXT,
        resume_storage_path TEXT NOT NULL,
        resume_original_name TEXT,
        resume_file_size INT,
        cover_note TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'New', -- 'New', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'
        internal_notes TEXT,
        submitted_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ applications table verified.");

    // 4. Application Notes Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS application_notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        admin_email VARCHAR(150) NOT NULL,
        admin_name VARCHAR(150),
        note TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ application_notes table verified.");

    // 5. Application Status History Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS application_status_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        previous_status VARCHAR(50),
        new_status VARCHAR(50) NOT NULL,
        changed_by VARCHAR(150) NOT NULL,
        note TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ application_status_history table verified.");

    // 6. Recruitment Settings Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS recruitment_settings (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ recruitment_settings table verified.");

    // Seed Categories
    const categories = [
      { name: "Engineering & Technical", slug: "engineering-technical", description: "Mechanical, chemical, and instrumentation engineering roles", display_order: 1 },
      { name: "Procurement & Supply Chain", slug: "procurement-supply-chain", description: "Vendor sourcing, expediting and supply chain management", display_order: 2 },
      { name: "Quality Assurance & Inspection", slug: "quality-assurance", description: "Third-party inspection, documentation and MTR verification", display_order: 3 },
      { name: "Water & Process Chemistry", slug: "water-process-chemistry", description: "RO, cooling, boiler and wastewater chemical applications", display_order: 4 },
      { name: "Logistics & Operations", slug: "logistics-operations", description: "Export crating, dangerous goods and shipment management", display_order: 5 },
      { name: "General & Support", slug: "general-support", description: "Cross-functional, administrative and open talent pool", display_order: 6 },
    ];

    for (const cat of categories) {
      await client.query(`
        INSERT INTO job_categories (name, slug, description, display_order, is_active)
        VALUES ($1, $2, $3, $4, true)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          display_order = EXCLUDED.display_order;
      `, [cat.name, cat.slug, cat.description, cat.display_order]);
    }
    console.log("✓ Job categories seeded.");

    // Fetch category IDs
    const catRows = (await client.query(`SELECT id, slug FROM job_categories;`)).rows;
    const catMap = Object.fromEntries(catRows.map(r => [r.slug, r.id]));

    // Seed Initial Jobs from existing Careers page
    const initialJobs = [
      {
        role: "Sales Engineer",
        title: "Technical Sales & Sourcing Engineer",
        slug: "technical-sales-sourcing-engineer",
        department: "Sales & Sourcing",
        category_slug: "engineering-technical",
        location: "Mumbai, India",
        employment_type: "Full-time",
        experience: "2+ years",
        image: "/assets/img/tube-fittings.jpg",
        short_description: "Review enquiries and datasheets, source against specifications and prepare technical and commercial proposals.",
        description: "We are seeking a proactive Technical Sales & Sourcing Engineer to evaluate incoming client RFQs, analyze piping & instrumentation datasheets, source high-integrity valves and fittings from qualified global manufacturers, and prepare competitive, compliant technical bids.",
        responsibilities: [
          "Review RFQs, engineering datasheets, P&IDs and piping line lists",
          "Source from pre-approved global valve, fitting and instrumentation manufacturers",
          "Prepare technical bid evaluations (TBE) and commercial proposals",
          "Address technical queries (TQs) and coordinate with client procurement desks until order closure"
        ],
        qualifications: [
          "B.Tech / B.E. in Mechanical, Chemical or Instrumentation Engineering",
          "2+ years experience in technical sales or sourcing of process instrumentation or valves",
          "Familiarity with ASME, ASTM, API 6D and NACE MR0175 standards",
          "Excellent written and verbal communication skills"
        ],
        required_skills: ["Technical Datasheet Review", "Valve Sizing (Cv)", "Vendor Evaluation", "Commercial Negotiation"],
        optional_skills: ["ERP Systems", "Export Documentation", "Incoterms 2020"],
        display_order: 1,
        status: "published"
      },
      {
        role: "Procurement Coordinator",
        title: "Procurement & Expediting Coordinator",
        slug: "procurement-expediting-coordinator",
        department: "Procurement & Supply Chain",
        category_slug: "procurement-supply-chain",
        location: "Mumbai, India",
        employment_type: "Full-time",
        experience: "2+ years",
        image: "/assets/img/ball-valves.jpg",
        short_description: "Manage purchase orders, vendor follow-up, milestones and consolidated deliveries for project orders.",
        description: "Join our procurement team to coordinate manufacturing schedules, track factory expediting milestones, and assemble consolidated shipment dossiers for EPC and process plant projects.",
        responsibilities: [
          "Issue and track purchase orders with international and domestic OEMs",
          "Proactively expedite vendor manufacturing milestones and test schedules",
          "Coordinate consolidated multi-vendor shipments for containerized export",
          "Maintain accurate order tracking and expediting reports in the company CMS"
        ],
        qualifications: [
          "Degree or Diploma in Engineering, Logistics, or Supply Chain Management",
          "2+ years experience expediting fabricated mechanical equipment or piping",
          "Understanding of commercial purchase terms and payment milestones",
          "Strong organizational and problem-solving abilities"
        ],
        required_skills: ["Vendor Expediting", "Purchase Order Administration", "Logistics Coordination", "Milestone Tracking"],
        optional_skills: ["Freight Forwarding", "Letter of Credit (LC) Compliance"],
        display_order: 2,
        status: "published"
      },
      {
        role: "Quality Engineer",
        title: "Quality & Inspection Engineer",
        slug: "quality-inspection-engineer",
        department: "Quality Assurance",
        category_slug: "quality-assurance",
        location: "Mumbai, India",
        employment_type: "Full-time",
        experience: "3+ years",
        image: "/assets/img/service-inspection-qa.jpg",
        short_description: "Coordinate third-party inspection, verify MTCs and witness tests so documentation is ready for handover.",
        description: "Responsible for complete quality verification across all consigned equipment, witnessing pressure tests, reviewing chemical analysis reports, and assembling EN 10204 3.1 / 3.2 manufacturing databooks.",
        responsibilities: [
          "Coordinate with third-party inspection agencies (TUV, BV, DNV, Lloyds)",
          "Audit manufacturer test certificates (MTR/MTC) against EN 10204 3.1 & 3.2",
          "Witness Positive Material Identification (PMI), hydrostatic and pneumatic testing",
          "Compile comprehensive client databooks and handover documentation dossiers"
        ],
        qualifications: [
          "B.Tech / Diploma in Mechanical or Metallurgical Engineering",
          "3+ years experience in quality assurance / inspection for pressure-retaining components",
          "ASNT Level II certification in NDT (PT, MT, RT, UT) preferred",
          "Deep understanding of ASME Section VIII, Section IX and NACE TM0177 / TM0284"
        ],
        required_skills: ["EN 10204 3.1 Verification", "PMI Witnessing", "Hydrostatic Test Review", "ITP Preparation"],
        optional_skills: ["ASNT Level II", "Auditing Pre-qualification"],
        display_order: 3,
        status: "published"
      },
      {
        role: "Chemical Engineer",
        title: "Chemical Application Engineer",
        slug: "chemical-application-engineer",
        department: "Chemical & Water Treatment",
        category_slug: "water-process-chemistry",
        location: "Mumbai, India",
        employment_type: "Full-time",
        experience: "2+ years",
        image: "/assets/img/chem-01-ro-chemicals.jpg",
        short_description: "Recommend and support RO, cooling, boiler and ETP chemistry programmes against client water analysis.",
        description: "Evaluate raw water reports, calculate projection models for RO membrane recovery, formulate anti-scalants and biocides, and support industrial clients with on-site dosing optimisation.",
        responsibilities: [
          "Analyse comprehensive raw water lab reports (TDS, silica, hardness, conductivity, pH)",
          "Project exact chemical dosage, recovery rates and membrane cleaning schedules",
          "Support commissioning and technical monitoring of effluent and water treatment programs",
          "Advise on chemical injection points, pump stroke rates and dilution parameters"
        ],
        qualifications: [
          "B.Tech / B.E. in Chemical Engineering or M.Sc in Applied Chemistry",
          "2+ years experience in industrial water treatment, cooling towers, or RO plants",
          "Strong computer modeling and analytical chemistry skills",
          "Client-facing technical consultation capabilities"
        ],
        required_skills: ["Water Analysis Interpretation", "RO Dosage Modeling", "Antiscalant Formulation", "ETP Chemistry"],
        optional_skills: ["ZLD System Design", "Membrane Autopsy Evaluation"],
        display_order: 4,
        status: "published"
      },
      {
        role: "Logistics Executive",
        title: "Logistics & Export Executive",
        slug: "logistics-export-executive",
        department: "Logistics & Operations",
        category_slug: "logistics-operations",
        location: "Mumbai, India",
        employment_type: "Full-time",
        experience: "1+ years",
        image: "/assets/img/chem-07-commercial-chemicals.jpg",
        short_description: "Plan packing, dangerous goods documentation, customs clearance and door-to-site freight.",
        description: "Coordinate export packaging, manage hazardous goods documentation for specialty chemicals, and oversee customs clearance and shipping for both domestic and international projects.",
        responsibilities: [
          "Plan ISPM-15 certified seaworthy export packing and container stuffing",
          "Prepare IMDG / IATA Dangerous Goods (DG) documentation for chemical shipments",
          "Handle customs clearance, bill of lading (BL), certificates of origin (COO) and insurance",
          "Track shipments from factory floor through to port and site delivery"
        ],
        qualifications: [
          "Graduate in Commerce, Logistics or Supply Chain Management",
          "1+ years experience in freight forwarding, shipping, or industrial export logistics",
          "Knowledge of Incoterms 2020 and customs documentation procedures",
          "Strong attention to detail with shipping dossiers and packing lists"
        ],
        required_skills: ["Export Documentation", "Dangerous Goods (DG) Handling", "Customs Clearance", "Freight Booking"],
        optional_skills: ["IMDG Certification", "IATA Cargo Training"],
        display_order: 5,
        status: "published"
      }
    ];

    for (const j of initialJobs) {
      const catId = catMap[j.category_slug] || null;
      await client.query(`
        INSERT INTO jobs (
          role, title, slug, department, category_id, location,
          employment_type, experience, image, short_description,
          description, responsibilities, qualifications, required_skills,
          optional_skills, display_order, status, published_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())
        ON CONFLICT (slug) DO UPDATE SET
          role = EXCLUDED.role,
          title = EXCLUDED.title,
          department = EXCLUDED.department,
          category_id = EXCLUDED.category_id,
          location = EXCLUDED.location,
          employment_type = EXCLUDED.employment_type,
          experience = EXCLUDED.experience,
          image = EXCLUDED.image,
          short_description = EXCLUDED.short_description,
          description = EXCLUDED.description,
          responsibilities = EXCLUDED.responsibilities,
          qualifications = EXCLUDED.qualifications,
          required_skills = EXCLUDED.required_skills,
          optional_skills = EXCLUDED.optional_skills,
          display_order = EXCLUDED.display_order,
          status = EXCLUDED.status;
      `, [
        j.role, j.title, j.slug, j.department, catId, j.location,
        j.employment_type, j.experience, j.image, j.short_description,
        j.description, JSON.stringify(j.responsibilities), JSON.stringify(j.qualifications),
        JSON.stringify(j.required_skills), JSON.stringify(j.optional_skills),
        j.display_order, j.status
      ]);
    }
    console.log("✓ Initial jobs seeded.");

    // Seed default recruitment settings
    const defaultSettings = {
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

    await client.query(`
      INSERT INTO recruitment_settings (key, value, updated_at)
      VALUES ('general', $1, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
    `, [JSON.stringify(defaultSettings)]);
    console.log("✓ Recruitment settings seeded.");

    console.log("\nCAREERS MODULE DATABASE TABLES INITIALIZED SUCCESSFULLY!");
    await client.end();
  } catch (err) {
    console.error("Database migration error:", err);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
}

setupCareersDatabase();
