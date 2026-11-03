# Petronex Engineering — Industrial B2B Frontend

A professional, modern, responsive industrial B2B website built with Next.js (App Router), TypeScript, and Tailwind CSS. Inspired by the brand identity, industrial colour palette, navigation, and technical presentation of [petroeng.in](https://petroeng.in/).

---

## 1. Project Overview

The website represents a specialized sourcing and engineering partner supplying:
- **Chemicals & Water Treatment Solutions:** RO antiscalants, cooling water inhibitors, boiler water oxygen scavengers, wastewater/ETP coagulants, turnkey water treatment plants, and laboratory equipment.
- **Industrial Instrumentation & Valves:** SS316 double ferrule tube fittings, high-pressure forged pipe fittings, needle valves, 3-piece ball valves, 5-way differential pressure manifolds, seamless tubing coils, solid-front safety pattern gauges, and online gas analyzer packages.
- **Engineering & Procurement Services:** Oil & gas equipment sourcing, project procurement support, third-party inspection (TPI) & quality assurance (EN 10204 Type 3.1/3.2), vendor representation, export logistics, and technical consulting.

> **Note on Phase 1 Implementation:**  
> This phase implements the complete frontend user experience only. It includes full client-side validation (React Hook Form + Zod), interactive filtering, search, and responsive layouts. No backend APIs, database connections, authentication, or admin panels are implemented in this phase.

---

## 2. Technology Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript 5.7+
- **Styling:** Tailwind CSS 3.4+ with custom industrial navy and slate palette
- **Icons:** Lucide React
- **Animations:** Motion / Framer Motion
- **Forms & Validation:** React Hook Form + Zod
- **Data Architecture:** Fully typed structured TypeScript models (`data/*.ts`)
- **Testing:** Custom Node.js validation test runner (`npm test`)

---

## 3. Route Structure & Pages

```text
app/
├── layout.tsx                              # Global layout with sticky header and comprehensive footer
├── page.tsx                                # Home Page (Hero, Divisions, Capabilities, Products, Services, Why Us)
├── about/
│   └── page.tsx                            # About Us Page (Company Profile, Mission, Vision, QA Methodology)
├── chemicals/
│   ├── page.tsx                            # Chemicals Catalogue (Search & 8-category filter)
│   └── [category]/
│       └── page.tsx                        # Dynamic Chemical Category Detail View
├── instrumentation/
│   ├── page.tsx                            # Instrumentation Catalogue (10 categories, search & filter)
│   └── [product]/
│       └── page.tsx                        # Product Detail View (Technical Spec Tables, Standards, RFQ)
├── services/
│   └── page.tsx                            # Services Page (6 Engineering & Sourcing disciplines)
├── industries/
│   └── page.tsx                            # Industries Page (Oil & Gas, Petrochemical, Water, EPC, Manufacturing)
├── resources/
│   └── page.tsx                            # Resources Desk (Brochures, Catalogues, Whitepapers, FAQs, Articles)
├── contact/
│   └── page.tsx                            # Contact Page (Office info, map preview, validated contact form)
└── request-a-quote/
    └── page.tsx                            # Dedicated Industrial RFQ Page (Multi-section form, file attachment)
```

---

## 4. Key Design & Engineering Features

1. **Industrial Brand Identity & Color Palette:**
   - Deep Industrial Navy (`#050b16`, `#081324`, `#0f1f38`)
   - High-contrast crisp neutral canvas (`#ffffff`, `#f8fafc`, `#f1f5f9`)
   - Safety/Engineering Accent Blues & Ambers (`#0b82eb`, `#d97706`)
2. **Sticky Navigation with Dropdowns & Mobile Drawer:**
   - Top utility bar with corporate phone, email, business hours, and ISO 9001 compliance badge.
   - Dynamic hover dropdowns for Chemicals, Instrumentation, and Services.
   - Mobile navigation drawer with nested category links.
3. **Structured Technical Data:**
   - All 8 Chemical categories and 10 Instrumentation categories are defined in typed data files (`data/categories.ts`, `data/products.ts`).
   - Clean technical specification tables (`SpecTable.tsx`) displaying pressure boundaries, sizes, metallurgy, and standards.
4. **Interactive Catalogue Filtering:**
   - Real-time client-side search across categories, materials, and product names.
   - Category filtering with active pill indicators and instant clearance.
5. **Client-Side Form Validation (Zod + React Hook Form):**
   - **Contact Form:** Validates full name, company, business email, phone, subject, and message.
   - **RFQ Form:** 3-section structured enquiry capturing contact details, technical scope, delivery timelines, quantity/units, and file attachment preview.
   - Clear confirmation displays informing users that submissions are validated in frontend demo mode.

---

## 5. Getting Started & Installation

### Prerequisites
- Node.js (v18.17.0 or newer recommended, v20+ / v24+ supported)
- npm or pnpm

### Installation
```bash
# Clone or navigate to the project directory
cd d:\Petronex

# Install project dependencies
npm install
```

### Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running the Test Suite
```bash
npm test
```

### Building for Production
```bash
npm run build
npm run start
```

---

## 6. Real Company Assets & Information Required for Future Phases

When transitioning from this frontend phase to production deployment:

1. **Company Branding:**
   - Official high-resolution SVG or vector logo file.
   - Favicon and app icon assets.
2. **Official Contact & Legal Details:**
   - Permanent corporate office address and warehouse coordinates.
   - Corporate Identification Number (CIN) and GSTIN registration numbers.
   - Dedicated direct phone lines and domain-verified email addresses.
3. **OEM Datasheets & PDFs:**
   - Physical PDF product brochures and master engineering catalogues for the `/resources` download library.
   - Official material test report templates and third-party accreditation certificates.
4. **Backend & Form Endpoints (Phase 2):**
   - API endpoints or cloud functions (e.g., Next.js Route Handlers, Resend/SendGrid, Supabase/PostgreSQL) to store RFQ submissions and trigger email alerts to the sales team.
