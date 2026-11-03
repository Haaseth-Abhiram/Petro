import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      id: "oil-gas-sourcing",
      num: "01",
      title: "Oil & Gas Equipment Sourcing",
      desc: "Specialized procurement of severe service valves, high-pressure fittings, and process instrumentation conforming to API, NACE MR0175, and ASME standards.",
      img: "/assets/img/tube-fittings.jpg",
      reverse: false,
      activities: [
        "Vetting of API/ASME compliant global manufacturers",
        "Technical bid tabulations (TBE) matching tender datasheets",
        "Expediting fabrication milestones and factory hold points",
        "Consolidated material package deliveries for offshore/onshore projects",
      ],
      benefits: [
        "Eliminates single-source vulnerability through qualified OEM networks",
        "Guarantees compliance with sour service NACE MR0175 / ISO 15156 metallurgy",
        "Reduces lead times through strategic regional stocking hubs",
      ],
    },
    {
      id: "project-procurement",
      num: "02",
      title: "Project Procurement Support",
      desc: "Supporting EPC project teams from front-end engineering design (FEED) through commissioning — consolidating material take-offs (MTO) and resolving technical queries (TQ).",
      img: "/assets/img/ball-valves.jpg",
      reverse: true,
      activities: [
        "MTO consolidation and spare parts optimization (SPIR)",
        "Technical compliance verification prior to PO issuance",
        "Master schedule expediting with regular milestone reports",
        "Handling warranty claims, surplus management, and preservation",
      ],
      benefits: [
        "Minimizes purchase order administrative overhead for EPC contractors",
        "Eliminates on-site mismatch delays through pre-shipment cross-checks",
        "Access to volume pricing across multiple project disciplines",
      ],
    },
    {
      id: "inspection-qa",
      num: "03",
      title: "Inspection & Quality Assurance",
      desc: "Third-party inspection coordination, material test reports (EN 10204 3.1/3.2), positive material identification (PMI), and pressure test surveillance.",
      img: "/assets/img/service-inspection-qa.jpg",
      reverse: false,
      activities: [
        "Coordination of third-party agencies (TUV, DNV, Bureau Veritas, Lloyd's)",
        "EN 10204 Type 3.1 and 3.2 Material Test Certificate (MTC) verification",
        "Non-Destructive Testing (PMI, Ultrasonic, Radiography, Dye Penetrant) witness",
        "Hydrostatic and pneumatic pressure test surveillance per API 598",
      ],
      benefits: [
        "Full traceability back to master heat melts and chemical heats",
        "Complete documentation dossiers compiled ready for client handover",
        "Eliminates costly site rejections and warranty disputes",
      ],
    },
    {
      id: "vendor-rep",
      num: "04",
      title: "Vendor & Manufacturer Representation",
      desc: "Acting as the dedicated technical sales channel for world-class manufacturers of specialty water treatment chemicals, analyzer shelters, and precision valves.",
      img: "/assets/img/analyser-systems.jpg",
      reverse: true,
      activities: [
        "Direct technical liaison between OEM engineering and end-user teams",
        "Product presentation, pilot trials, and proof-of-concept testing",
        "Registration and pre-qualification with state utilities and oil majors",
        "Warranty handling, spare parts warehousing, and local customer service",
      ],
      benefits: [
        "End-users receive authentic, warranted equipment with direct factory support",
        "Manufacturers gain immediate market penetration and qualified customer access",
        "Local application support and rapid on-site troubleshooting",
      ],
    },
    {
      id: "logistics-export",
      num: "05",
      title: "Logistics & Export Handling",
      desc: "Comprehensive supply chain execution managing ocean freight, air express, dangerous goods chemical transport (IMDG/IATA), and export documentation.",
      img: "/assets/img/chem-07-commercial-chemicals.jpg",
      reverse: false,
      activities: [
        "Sea-worthy timber crating treated to ISPM-15 standards",
        "Dangerous Goods (DG) packing and certification for chemical cargos",
        "Certificate of Origin, Legalization, and consular documentation processing",
        "Incoterms coordination: Ex-Works, FOB, CIF, CFR, and DDP consignments",
      ],
      benefits: [
        "Damage-free arrival assured through moisture-barrier wrapping and desiccants",
        "Smooth customs clearance preventing demurrage and port holding penalties",
        "Real-time shipment milestone tracking from factory bay to site gate",
      ],
    },
    {
      id: "technical-consulting",
      num: "06",
      title: "Technical Consultation & Engineering Support",
      desc: "Experienced engineering consultation to assist procurement and operations managers in selecting optimal alloy metallurgy, valve sizing (Cv), and water chemical dosage projections.",
      img: "/assets/img/service-technical-consultation.jpg",
      reverse: true,
      activities: [
        "Reverse Osmosis chemical dosage projections via computer simulations",
        "Valve sizing, cavitation analysis, and differential pressure drop modeling",
        "Metallurgical selection for corrosive media (Sour Gas, Sea Water, Acids)",
        "Sampling system lag-time and conditioning calculation audits",
      ],
      benefits: [
        "Prevents premature equipment failure caused by improper material selection",
        "Optimizes chemical consumption rates, reducing recurring operating expenditure",
        "Aligns process requirements with international industry standards",
      ],
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Enquiry & review",
      desc: "We review datasheets, MTO line items, pressure ratings and client approved vendor lists (AVL) before drafting proposals.",
    },
    {
      num: "02",
      title: "Sourcing & proposal",
      desc: "Direct coordination with audited manufacturing plants to establish factory delivery windows and competitive pricing.",
    },
    {
      num: "03",
      title: "Inspection & documentation",
      desc: "Hydrostatic test witness, PMI audits, and verification of EN 10204 Type 3.1 & 3.2 mill certificates.",
    },
    {
      num: "04",
      title: "Packing & delivery",
      desc: "ISPM-15 timber crating, moisture preservation, consular documentation, and export logistics to your site gate.",
    },
  ];

  return (
    <div className="w-full">
      {/* 1. HERO */}
      <section className="relative bg-[#17191C] text-white py-20 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 z-0"
          style={{ backgroundImage: "url('/assets/img/service-inspection-qa.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/95 via-[#17191C]/90 to-[#17191C]/75 z-0" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="max-w-[820px]">
            <span className="eyebrow eyebrow-gold">ENGINEERING &amp; PROCUREMENT</span>
            <h1 className="text-white text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-tight leading-[1.15] mb-4">
              End-to-end support, from enquiry through to site delivery
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-[660px]">
              Six dedicated services for engineering contractors, plant operators and procurement heads — backed by material traceability, factory expediting and technical review.
            </p>
          </div>
        </div>
      </section>

      {/* 2. SERVICES LIST */}
      <section className="py-12 bg-white border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          {services.map((s) => (
            <article
              key={s.id}
              id={s.id}
              className={`prod ${s.reverse ? "prod-reverse" : ""} scroll-mt-28 relative`}
            >
              {/* Secondary anchor for long-slug matching */}
              <span id={
                s.id === "oil-gas-sourcing" ? "oil-and-gas-equipment-sourcing" :
                s.id === "project-procurement" ? "project-procurement-support" :
                s.id === "inspection-qa" ? "inspection-and-quality-assurance" :
                s.id === "vendor-rep" ? "vendor-and-manufacturer-representation" :
                s.id === "logistics-export" ? "logistics-and-export-handling" :
                "technical-consultation-and-engineering-support"
              } className="absolute -top-28" />
              <div className="prod-media">
                <Image
                  src={s.img}
                  alt={s.title}
                  width={1024}
                  height={582}
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="prod-copy">
                <span className="font-['Plus_Jakarta_Sans'] text-xs font-extrabold uppercase tracking-widest text-[#FF4B32] mb-1 block">
                  SERVICE {s.num}
                </span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#17191C] mb-3">
                  {s.title}
                </h2>
                <p className="text-[#5F6871] text-base leading-relaxed mb-6">
                  {s.desc}
                </p>

                <div className="mb-6">
                  <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#17191C] mb-3">
                    Key Activities:
                  </h4>
                  <ul className="space-y-1.5 text-sm text-[#5F6871]">
                    {s.activities.map((act, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-4 h-4 text-[#FF4B32] mr-2 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="btn-group mt-6">
                  <Link
                    href={`/request-a-quote?service=${encodeURIComponent(s.title)}`}
                    className="btn btn-primary"
                  >
                    Enquire about {s.title.toLowerCase()}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. FOUR STEPS */}
      <section className="py-20 lg:py-24 bg-[#F5F6F7] border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-[760px] mx-auto text-center mb-14">
            <span className="eyebrow">OUR PROCESS</span>
            <h2 className="text-[#17191C] text-2xl sm:text-4xl font-extrabold tracking-tight">
              Four steps from enquiry to delivery
            </h2>
            <p className="text-[#5F6871] text-base sm:text-lg mt-3">
              Transparent milestone expediting and zero-compromise documentation control.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st) => (
              <div key={st.num} className="step-card">
                <div className="step-num">{st.num}</div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#17191C] mb-2.5">
                  {st.title}
                </h3>
                <p className="text-[#5F6871] text-sm leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA BAND */}
      <section className="relative bg-[#17191C] overflow-hidden py-20 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/assets/img/service-technical-consultation.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/95 to-[#17191C]/80" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-[620px]">
              <span className="eyebrow eyebrow-gold">PROCUREMENT SUPPORT</span>
              <h2 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-3">
                Let's talk about your project
              </h2>
              <p className="text-white/75 text-base sm:text-lg leading-relaxed">
                Contact our sourcing engineers for MTO evaluations, vendor alignments, or technical queries.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <Link href="/request-a-quote" className="btn btn-primary">
                Submit Project RFQ
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Speak with Technical Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
