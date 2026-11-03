import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Layers,
  ChevronRight,
  HelpCircle,
  Phone,
  Wrench,
  Download,
} from "lucide-react";
import { PRODUCTS, ProductItem } from "@/data/products";
import { INSTRUMENTATION_CATEGORIES, CategoryItem } from "@/data/categories";

interface PageProps {
  params: {
    product: string;
  };
}

// Generate static params for ALL categories AND individual products
export function generateStaticParams() {
  const categorySlugs = INSTRUMENTATION_CATEGORIES.map((c) => ({
    product: c.slug,
  }));
  const productSlugs = PRODUCTS.filter((p) => p.division === "instrumentation").map((p) => ({
    product: p.slug,
  }));

  const uniqueSlugs = Array.from(
    new Set([...categorySlugs.map((s) => s.product), ...productSlugs.map((s) => s.product)])
  );

  return uniqueSlugs.map((slug) => ({
    product: slug,
  }));
}

export const dynamicParams = true;

// Helper to resolve an authentic local image for each category
function getCategoryImage(slug: string, fallbackImage: string): string {
  const imageMap: Record<string, string> = {
    "tube-fittings": "/assets/img/tube-fittings.jpg",
    "pipe-fittings": "/assets/img/pipe-fittings.jpg",
    "needle-valves": "/assets/img/needle-valves.jpg",
    "ball-valves": "/assets/img/ball-valves.jpg",
    "manifold-valves": "/assets/img/manifold-valves.jpg",
    "check-valves": "/assets/img/check-valves-alt.jpg",
    "tubing-coils": "/assets/img/tubing-coils.jpg",
    "analyser-systems": "/assets/img/analyser-systems.jpg",
    "pressure-instruments": "/assets/img/gas-analytics.jpg",
    "flow-instruments": "/assets/img/gas-analytics.jpg",
  };

  return imageMap[slug] || fallbackImage;
}

export default function ProductOrCategoryPage({ params }: PageProps) {
  const slug = params.product.toLowerCase();

  // 1. Check if the parameter matches a Category (e.g. tube-fittings, ball-valves, needle-valves...)
  const category = INSTRUMENTATION_CATEGORIES.find((c) => c.slug.toLowerCase() === slug);

  // 2. Check if the parameter matches an individual Product (e.g. double-ferrule-male-connector-ss316...)
  const product = PRODUCTS.find(
    (p) => p.slug.toLowerCase() === slug && p.division === "instrumentation"
  );

  // Related products under the same category if category was matched
  const relatedProducts = category
    ? PRODUCTS.filter((p) => p.categorySlug.toLowerCase() === category.slug.toLowerCase())
    : [];

  // ==========================================
  // CASE A: CATEGORY MATCHED (e.g. /instrumentation/tube-fittings)
  // ==========================================
  if (category) {
    const heroImage = getCategoryImage(category.slug, category.image);

    return (
      <div className="w-full bg-[#FFFFFF]">
        {/* 1. HERO & BREADCRUMBS */}
        <section className="relative bg-[#17191C] text-white py-16 lg:py-20 overflow-hidden border-b border-[#2A2E34]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 z-0"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/95 via-[#17191C]/90 to-[#17191C]/75 z-0" />

          <div className="relative z-10 max-w-[1400px] mx-auto px-6">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-xs font-semibold text-white/60 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#929DA7]" />
              <Link href="/instrumentation" className="hover:text-white transition-colors">
                Instrumentation
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#FF4B32]" />
              <span className="text-[#FF4B32]">{category.name}</span>
            </div>

            <div className="max-w-[840px]">
              <span className="eyebrow">HIGH PRESSURE FLUID CONTROL</span>
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] mb-4">
                {category.name}
              </h1>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-[680px]">
                {category.detailedDescription || category.shortDescription}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link
                  href={`/request-a-quote?category=${encodeURIComponent(category.name)}`}
                  className="btn btn-primary"
                >
                  <span>Request Technical Quote</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link href="/instrumentation" className="btn btn-outline">
                  <span>View All Categories</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SPECIFICATION OVERVIEW & KEY MODELS */}
        <section className="py-16 lg:py-20 bg-[#FFFFFF] border-b border-[#D8DDE2]">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Visual & Key Product Models */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#D8DDE2] shadow-sm mb-6 bg-[#EBECEE]">
                  <Image
                    src={heroImage}
                    alt={category.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-3.5 left-3.5 bg-[#17191C]/90 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded">
                    EN 10204 3.1 Traceability
                  </div>
                </div>

                {/* Key Product Variants Card */}
                <div className="p-6 bg-[#F5F6F7] border border-[#D8DDE2] rounded-xl">
                  <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#17191C] mb-3 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#FF4B32]" />
                    <span>Key Product Configurations:</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-[#5F6871]">
                    {category.keyProducts?.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-4 h-4 text-[#FF4B32] mr-2 shrink-0 mt-0.5" />
                        <span className="font-medium text-[#17191C]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Technical Specification & Compliance */}
              <div className="lg:col-span-7">
                <span className="eyebrow">ENGINEERING SPECIFICATION</span>
                <h2 className="text-[#17191C] text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
                  Technical Specifications &amp; Design Criteria
                </h2>
                <p className="text-[#5F6871] text-base leading-relaxed mb-6">
                  Manufactured from precision bar-stock and forged materials with strict tolerance adherence, suited for critical process piping, analytical sampling skids, and severe high-pressure service.
                </p>

                {/* Specs Table */}
                <div className="table-scroll mb-8">
                  <table className="spec-table">
                    <caption>{category.name} Standard Engineering Limits</caption>
                    <thead>
                      <tr>
                        <th scope="col">Parameter</th>
                        <th scope="col">Specification / Standard</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">Material Options</th>
                        <td>SS316 / SS316L (UNS S31600), Monel 400, Hastelloy C-276, Inconel 625, Brass</td>
                      </tr>
                      <tr>
                        <th scope="row">Working Pressure</th>
                        <td>Vacuum up to 6,000 PSI / 10,000 PSI @ ambient temperature (Safety Factor 4:1)</td>
                      </tr>
                      <tr>
                        <th scope="row">Temperature Limits</th>
                        <td>-196°C to +426°C (-320°F to +800°F) depending on packing &amp; seal selection</td>
                      </tr>
                      <tr>
                        <th scope="row">Connection Sizes</th>
                        <td>1/8" to 1" O.D. (3mm to 25mm metric) tube ends; 1/8" to 1" NPT / BSP male/female</td>
                      </tr>
                      <tr>
                        <th scope="row">Quality Certification</th>
                        <td>EN 10204 Type 3.1 MTR with full melt heat traceability; Helium leak tested</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Standards & Applications Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#D8DDE2]">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#17191C] mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#FF4B32]" />
                      <span>Applicable Standards:</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-[#5F6871]">
                      {category.standards && category.standards.length > 0 ? (
                        category.standards.map((std, i) => <li key={i}>• {std}</li>)
                      ) : (
                        <>
                          <li>• ASTM A276 / A479 (SS316 bar-stock)</li>
                          <li>• ASME B31.3 Process Piping</li>
                          <li>• NACE MR0175 / ISO 15156 Sour Service</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#17191C] mb-2 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-[#FF4B32]" />
                      <span>Target Applications:</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-[#5F6871]">
                      {category.applications?.map((app, i) => (
                        <li key={i}>• {app}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. INDIVIDUAL PRODUCTS IN THIS LINE (IF ANY) */}
        {relatedProducts.length > 0 && (
          <section className="py-16 bg-[#F5F6F7] border-b border-[#D8DDE2]">
            <div className="max-w-[1400px] mx-auto px-6">
              <div className="max-w-[760px] mb-10">
                <span className="eyebrow">FEATURED PRODUCTS</span>
                <h3 className="text-[#17191C] text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Specific {category.name} Models
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((p) => (
                  <div
                    key={p.slug}
                    className="p-6 bg-white border border-[#D8DDE2] rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-[#FF4B32] uppercase tracking-wider block mb-1">
                        {p.pressureRating || "High Pressure Rated"}
                      </span>
                      <h4 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#17191C] mb-2">
                        {p.name}
                      </h4>
                      <p className="text-xs text-[#5F6871] leading-relaxed mb-4 line-clamp-2">
                        {p.shortDescription}
                      </p>
                    </div>

                    <Link
                      href={`/request-a-quote?product=${encodeURIComponent(p.name)}`}
                      className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#FF4B32] hover:underline flex items-center gap-1 mt-2"
                    >
                      <span>Request Quote on Model</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. FAST QUOTE CTA */}
        <section className="py-16 bg-[#17191C] text-white">
          <div className="max-w-[1400px] mx-auto px-6 text-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Need custom sizing, materials, or fast delivery for {category.name}?
            </h3>
            <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto mb-6">
              Our engineering sales team provides verified technical quotes, material test certificates (MTC), and dimensional drawings.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/request-a-quote?product=${encodeURIComponent(category.name)}`}
                className="btn btn-primary"
              >
                Submit Line List / RFQ
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Contact Technical Sales
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ==========================================
  // CASE B: SPECIFIC PRODUCT MATCHED (e.g. /instrumentation/double-ferrule-male-connector-ss316)
  // ==========================================
  if (product) {
    const specEntries = Object.entries(product.specifications || {});

    return (
      <div className="w-full bg-[#FFFFFF]">
        {/* 1. HERO */}
        <section className="relative bg-[#17191C] text-white py-16 lg:py-20 overflow-hidden border-b border-[#2A2E34]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 z-0"
            style={{ backgroundImage: `url('/assets/img/tube-fittings.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/95 via-[#17191C]/90 to-[#17191C]/75 z-0" />

          <div className="relative z-10 max-w-[1400px] mx-auto px-6">
            <div className="flex items-center space-x-2 text-xs font-semibold text-white/60 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#929DA7]" />
              <Link href="/instrumentation" className="hover:text-white transition-colors">
                Instrumentation
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#FF4B32]" />
              <span className="text-[#FF4B32]">{product.name}</span>
            </div>

            <div className="max-w-[820px]">
              <span className="eyebrow">FLUID CONTROL HARDWARE</span>
              <h1 className="text-white text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight leading-[1.15] mb-4">
                {product.name}
              </h1>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-[660px]">
                {product.overview || product.shortDescription}
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link
                  href={`/request-a-quote?product=${encodeURIComponent(product.name)}`}
                  className="btn btn-primary"
                >
                  Request Technical Quote
                </Link>
                <Link href="/instrumentation" className="btn btn-outline">
                  Back to Catalogue
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SPECIFICATION TABLE & DETAILS */}
        <section className="py-16 lg:py-20 bg-white border-b border-[#D8DDE2]">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7">
                <span className="eyebrow">ENGINEERING DATA</span>
                <h2 className="text-[#17191C] text-2xl sm:text-3xl font-extrabold tracking-tight mb-6">
                  Technical Specifications
                </h2>

                <div className="table-scroll">
                  <table className="spec-table">
                    <caption>{product.name} Mechanical &amp; Material Limits</caption>
                    <thead>
                      <tr>
                        <th scope="col">Parameter</th>
                        <th scope="col">Specification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {specEntries.map(([k, v], idx) => (
                        <tr key={idx}>
                          <th scope="row">{k}</th>
                          <td>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 p-6 bg-[#F5F6F7] border border-[#D8DDE2] rounded-[8px]">
                  <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#17191C] mb-3">
                    Design Features &amp; Quality Approvals:
                  </h4>
                  <ul className="space-y-2 text-sm text-[#5F6871]">
                    {product.keyFeatures?.map((feat, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-4 h-4 text-[#FF4B32] mr-2 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-5">
                <div className="p-7 bg-[#F5F6F7] border border-[#D8DDE2] rounded-xl mb-6">
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#17191C] mb-4">
                    Quick Specification Summary
                  </h3>
                  <div className="space-y-3 text-xs sm:text-sm">
                    {product.material && (
                      <div className="flex justify-between pb-2 border-b border-[#D8DDE2]">
                        <span className="text-[#5F6871]">Material</span>
                        <span className="font-semibold text-[#17191C] text-right">{product.material}</span>
                      </div>
                    )}
                    {product.pressureRating && (
                      <div className="flex justify-between pb-2 border-b border-[#D8DDE2]">
                        <span className="text-[#5F6871]">Pressure Rating</span>
                        <span className="font-semibold text-[#17191C]">{product.pressureRating}</span>
                      </div>
                    )}
                    {product.size && (
                      <div className="flex justify-between pb-2 border-b border-[#D8DDE2]">
                        <span className="text-[#5F6871]">Sizes</span>
                        <span className="font-semibold text-[#17191C]">{product.size}</span>
                      </div>
                    )}
                    {product.connectionType && (
                      <div className="flex justify-between pb-2 border-b border-[#D8DDE2]">
                        <span className="text-[#5F6871]">Connection</span>
                        <span className="font-semibold text-[#17191C]">{product.connectionType}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#D8DDE2]">
                    <Link
                      href={`/request-a-quote?product=${encodeURIComponent(product.name)}`}
                      className="w-full btn btn-primary text-center justify-center"
                    >
                      Request Quote on This Product
                    </Link>
                  </div>
                </div>

                <div className="p-6 bg-white border border-[#D8DDE2] rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#17191C] mb-3">
                    Need Technical Assistance?
                  </h4>
                  <p className="text-xs text-[#5F6871] mb-4">
                    Our sales engineers verify flow coefficients (Cv), metallurgy compatibility, and pressure drop specs.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center text-xs font-bold text-[#FF4B32] hover:underline"
                  >
                    <span>Contact Engineering Desk</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ==========================================
  // CASE C: UNKNOWN SLUG FALLBACK (Branded, No Unstyled 404!)
  // ==========================================
  return (
    <div className="w-full bg-[#FFFFFF] py-16 lg:py-24">
      <div className="max-w-[1000px] mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-[#FF4B32]/10 border border-[#FF4B32]/20">
          <HelpCircle className="w-3.5 h-3.5 text-[#FF4B32]" />
          <span className="font-['Plus_Jakarta_Sans'] text-xs font-extrabold uppercase tracking-widest text-[#FF4B32]">
            Catalogue Item Reference: {params.product}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#17191C] tracking-tight mb-4">
          Instrumentation Item Not Found
        </h1>

        {/* Description */}
        <p className="text-[#5F6871] text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
          The requested specification or model <code className="text-[#17191C] bg-[#F5F6F7] px-2 py-0.5 rounded font-mono text-sm">{params.product}</code> is not listed in our standard catalogue or has been superseded.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link href="/instrumentation" className="btn btn-primary">
            <span>Back to Instrumentation Catalogue</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <Link
            href={`/request-a-quote?custom=${encodeURIComponent(params.product)}`}
            className="btn btn-secondary"
          >
            <span>Request Custom Sourcing</span>
          </Link>
          <Link href="/chemicals" className="btn btn-outline-dark">
            <span>View Chemical Solutions</span>
          </Link>
        </div>

        {/* Direct Links to All Available Instrumentation Lines */}
        <div className="p-8 bg-[#F5F6F7] border border-[#D8DDE2] rounded-2xl text-left">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#17191C] mb-4">
            Available Instrumentation Product Lines:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {INSTRUMENTATION_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/instrumentation/${cat.slug}`}
                className="p-3 bg-white rounded-lg border border-[#D8DDE2] hover:border-[#FF4B32] hover:shadow-sm transition-all group"
              >
                <div className="text-xs font-bold text-[#17191C] group-hover:text-[#FF4B32] transition-colors flex items-center justify-between">
                  <span>{cat.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#929DA7] group-hover:text-[#FF4B32] transition-colors" />
                </div>
                <p className="text-[11px] text-[#5F6871] line-clamp-1 mt-1">
                  {cat.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
