import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Search,
  Truck,
  Layers,
  Wrench,
  Flame,
  Globe,
  Award,
  Clock,
  DollarSign,
  Users,
  Play,
} from "lucide-react";
import { COMPANY_INFO } from "@/data/company";

export default function HomePage() {
  const chemicalGroups = [
    {
      num: "01",
      title: "RO Chemicals & Components",
      img: "/assets/img/chem-01-ro-chemicals.jpg",
      slug: "ro-chemicals-and-components",
      items: [
        "RO antiscalant chemicals",
        "RO membrane cleaning chemicals",
        "SMBS chemicals",
        "RO dosing pumps",
        "RO membranes",
      ],
      more: "+5 more →",
    },
    {
      num: "02",
      title: "Cooling Water Chemicals",
      img: "/assets/img/chem-02-cooling-water.jpg",
      slug: "cooling-water-chemicals",
      items: [
        "Cooling water descaling chemicals",
        "Scale inhibitors",
        "Corrosion inhibitors",
        "Microbiocides",
        "Biodispersants",
      ],
      more: "+2 more →",
    },
    {
      num: "03",
      title: "Boiler Water Chemicals",
      img: "/assets/img/chem-03-boiler-water.jpg",
      slug: "boiler-water-chemicals",
      items: [
        "Oxygen scavengers",
        "pH boosters",
        "Boiler descaling chemicals",
        "Sludge conditioners",
        "Scale and corrosion inhibitors",
      ],
      more: "Full details →",
    },
    {
      num: "04",
      title: "Wastewater / ETP Chemicals",
      img: "/assets/img/chem-04-etp-chemicals.jpg",
      slug: "wastewater-etp-chemicals",
      items: [
        "Colour removal chemicals",
        "Polyelectrolytes",
        "Ferric chloride",
        "Ferric sulphate",
        "PAC (Poly Aluminium Chloride)",
      ],
      more: "+5 more →",
    },
    {
      num: "05",
      title: "Water Treatment Plants",
      img: "/assets/img/chem-05-water-treatment-plants.jpg",
      slug: "water-treatment-plants",
      items: [
        "RO plants (brackish & seawater)",
        "Demineralisation (DM) plants",
        "Water softeners",
        "Pressure sand & carbon filters",
        "Ultrafiltration (UF) systems",
      ],
      more: "+6 more →",
    },
    {
      num: "06",
      title: "Wastewater Treatment",
      img: "/assets/img/chem-06-wastewater-treatment.jpg",
      slug: "wastewater-treatment",
      items: [
        "Sewage treatment plants (STP)",
        "Effluent treatment plants (ETP)",
        "Zero liquid discharge (ZLD) systems",
        "Clarifiers & flocculators",
        "Sludge dewatering & filter press",
      ],
      more: "+4 more →",
    },
    {
      num: "07",
      title: "Commercial Chemicals",
      img: "/assets/img/chem-07-commercial-chemicals.jpg",
      slug: "commercial-chemicals",
      items: [
        "Industrial acids (HCl, H2SO4)",
        "Alkalis & caustic soda (lye/flakes)",
        "Disinfectants & sodium hypochlorite",
        "Solvents & organic intermediates",
        "Neutralisation reagents",
      ],
      more: "+8 more →",
    },
    {
      num: "08",
      title: "Laboratory Equipment",
      img: "/assets/img/chem-08-lab-equipment.jpg",
      slug: "laboratory-equipment",
      items: [
        "Spectrophotometers & colorimeters",
        "pH & conductivity meters",
        "Turbidity & DO meters",
        "Laboratory glassware & reagents",
        "Water testing field kits",
      ],
      more: "Full details →",
    },
  ];

  const instrumentationProducts = [
    {
      title: "Tube Fittings",
      tag: '1/8"–1"',
      img: "/assets/img/tube-fittings.jpg",
      slug: "tube-fittings",
      desc: "Unions, elbows, tees and adapters in SS316, carbon steel, brass and alloy — rated up to 6000 psi.",
    },
    {
      title: "Ball Valves",
      tag: "2-way & 3-way",
      img: "/assets/img/ball-valves.jpg",
      slug: "ball-valves",
      desc: "2-way and 3-way instrumentation ball valves in SS316 and carbon steel, rated up to 6000 psi.",
    },
    {
      title: "Needle Valves",
      tag: "10,000 psi",
      img: "/assets/img/needle-valves.jpg",
      slug: "needle-valves",
      desc: "Straight and angle pattern needle valves in SS316 and alloy for precise high-pressure flow control.",
    },
    {
      title: "Manifold Valves",
      tag: "2, 3 & 5 valve",
      img: "/assets/img/manifold-valves.jpg",
      slug: "manifold-valves",
      desc: '2-valve, 3-valve and 5-valve manifolds in SS316 with 1/2" NPT connections for instrumentation service.',
    },
    {
      title: "Tubing Coils",
      tag: "ASTM A269",
      img: "/assets/img/tubing-coils.jpg",
      slug: "tubing-coils",
      desc: "Seamless stainless steel instrument tubing coils in SS316L and duplex, bright annealed in continuous lengths up to 1000m.",
    },
    {
      title: "Analyser Systems",
      tag: "CEMS & GC",
      img: "/assets/img/analyser-systems.jpg",
      slug: "analyser-systems",
      desc: "Complete sample conditioning systems, heated sample probes, shelters and continuous gas analysers for process monitoring.",
    },
  ];

  const whyPartner = [
    {
      title: "Global supplier network",
      desc: "Direct access to approved manufacturers and OEMs across Europe, North America, Japan and Asia-Pacific.",
      icon: Globe,
    },
    {
      title: "Technical & commercial expertise",
      desc: "Our engineers evaluate datasheets, process limits and metallurgy before submitting compliant technical bids.",
      icon: Award,
    },
    {
      title: "Compliance with international standards",
      desc: "Full traceability with EN 10204 3.1 / 3.2 certification, NACE MR0175, ASME, ASTM and API standards.",
      icon: ShieldCheck,
    },
    {
      title: "Competitive & transparent pricing",
      desc: "Factory-direct sourcing and package consolidation minimize procurement markups and overhead.",
      icon: DollarSign,
    },
    {
      title: "Reliable delivery & documentation control",
      desc: "Strict expediting, sea-worthy ISPM-15 export packing, and comprehensive dossiers ready for client handover.",
      icon: Clock,
    },
    {
      title: "Single point of contact",
      desc: "Consolidate chemicals and mechanical instrumentation packages under one commercial contract.",
      icon: Users,
    },
  ];

  const services = [
    {
      title: "Oil & Gas Equipment Sourcing",
      desc: "Sourcing certified valves, tubing, fittings and analytical packages for upstream, midstream and refining operations.",
      slug: "oil-and-gas-equipment-sourcing",
    },
    {
      title: "Project Procurement Support",
      desc: "Handling material take-offs (MTO), technical queries, vendor tabulations and bulk purchasing for EPC contracts.",
      slug: "project-procurement-support",
    },
    {
      title: "Inspection & Quality Assurance",
      desc: "Third-party inspection (TPI), witnessed pressure tests, material verification (PMI) and EN 10204 3.1 / 3.2 certs.",
      slug: "inspection-and-quality-assurance",
    },
    {
      title: "Vendor & Manufacturer Representation",
      desc: "Authorized technical sales and application representation for international process equipment OEMs.",
      slug: "vendor-and-manufacturer-representation",
    },
    {
      title: "Logistics & Export Handling",
      desc: "Sea-worthy crating, dangerous goods documentation (IMDG/IATA), customs clearance and door-to-site freight.",
      slug: "logistics-and-export-handling",
    },
    {
      title: "Technical Consultation & Engineering Support",
      desc: "Chemical dosage projections, valve sizing (Cv), alloy selection and sampling lag-time design reviews.",
      slug: "technical-consultation-and-engineering-support",
    },
  ];

  return (
    <div className="w-full bg-[#FFFFFF]">
      {/* 1. HERO SECTION (Recreated to match Screenshot 2) */}
      <section className="relative hero-target-bg overflow-hidden pt-12 sm:pt-16 lg:pt-20 pb-16 lg:pb-24 border-b border-[#D8DDE2]">
        {/* Coral Orange Ambient Glow at Bottom */}
        <div className="hero-coral-glow" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content Column (approx 48%) */}
            <div className="lg:col-span-6 xl:col-span-5 max-w-[580px]">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#FF4B32]" />
                <span className="font-['Plus_Jakarta_Sans'] text-xs sm:text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#17191C]/80">
                  Precision Engineering &amp; Chemical Solutions
                </span>
              </div>

              {/* Headline matching screenshot 2 typography */}
              <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-black text-[#17191C] leading-[1.04] tracking-tight mb-6">
                Precision in Every <br />
                <span className="text-[#FF4B32]">Industrial Solution.</span>
              </h1>

              {/* Description */}
              <p className="text-[#5F6871] text-base sm:text-lg leading-[1.65] mb-8 max-w-[500px]">
                High-integrity fluid control instrumentation, reverse osmosis treatment chemistry, and turnkey process systems for global oil, gas, energy and industrial projects.
              </p>

              {/* CTA Action Buttons matching screenshot 2 */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  href="/chemicals"
                  className="btn-pill-dark group"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/request-a-quote"
                  className="btn-pill-light group"
                >
                  <span className="w-6 h-6 rounded-full bg-[#17191C] text-white flex items-center justify-center mr-1">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span>Request a Quote</span>
                </Link>
              </div>

              {/* Trust & Spec Badges */}
              <div className="pt-6 border-t border-[#D8DDE2] flex flex-wrap items-center gap-x-8 gap-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FF4B32]" />
                  <span className="text-xs font-bold text-[#17191C] tracking-wide">
                    ISO 9001:2015 Certified
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#FF4B32]" />
                  <span className="text-xs font-bold text-[#17191C] tracking-wide">
                    EN 10204 3.1 Traceability
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#FF4B32]" />
                  <span className="text-xs font-bold text-[#17191C] tracking-wide">
                    NACE MR0175 Compliant
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Column (approx 52%) */}
            <div className="lg:col-span-6 xl:col-span-7 flex justify-center lg:justify-end relative">
              <div className="relative w-full max-w-[620px] aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-[0_24px_50px_rgba(23,25,28,0.18)] border border-[#D8DDE2]/80 bg-[#17191C]">
                <Image
                  src="/assets/img/hero-visual.png"
                  alt="Petro Engineering Precision Industrial Valve & Fluid Flow System"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-center transform hover:scale-102 transition-transform duration-700"
                />
                {/* Visual Glass Tag */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-[#17191C]/85 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-white z-10 shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#FF4B32] animate-pulse" />
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF4B32]">
                      Fluid Control &amp; Chemistry
                    </span>
                  </div>
                  <p className="text-xs text-white/80 font-medium leading-snug">
                    Rated up to 10,000 PSI with precision alloy metallurgy and certified chemical dosing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPLIANCE & STANDARDS STRIP */}
      <div className="bg-[#17191C] border-b border-[#2A2E34] py-5 text-center">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-wrap items-center justify-center gap-x-8 lg:gap-x-12 gap-y-2.5">
          <span className="font-['Plus_Jakarta_Sans'] text-xs font-extrabold uppercase tracking-widest text-[#929DA7]">
            Standards &amp; Compliance
          </span>
          {COMPANY_INFO.compliance.map((item, idx) => (
            <span
              key={idx}
              className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm font-bold tracking-wider text-white/90 hover:text-[#FF4B32] transition-colors"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 3. TWO CORE DIVISIONS */}
      <section className="py-20 lg:py-24 bg-[#F5F6F7] border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-[760px] mx-auto text-center mb-14">
            <span className="eyebrow">OUR CORE DIVISIONS</span>
            <h2 className="text-[#17191C] text-2xl sm:text-4xl font-extrabold tracking-tight">
              Two divisions, one point of contact
            </h2>
            <p className="text-[#5F6871] text-base sm:text-lg mt-3">
              A single sourcing partner for process chemicals and fluid control hardware — reducing vendor count, simplifying expediting and ensuring single-point accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Division 1 */}
            <article className="division-card">
              <div className="relative h-[280px] w-full bg-[#EBECEE]">
                <Image
                  src="/assets/img/chem-05-water-treatment-plants.jpg"
                  alt="Chemical & Water Treatment"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-between flex-1">
                <div>
                  <span className="eyebrow">DIVISION 01</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#17191C] mb-3">
                    Chemical &amp; Water Treatment
                  </h3>
                  <p className="text-[#5F6871] text-[15px] leading-relaxed mb-5">
                    From RO membrane preservation and cooling tower passivation to turnkey DM plants, effluent recycling and zero liquid discharge (ZLD) chemistry.
                  </p>
                  <ul className="space-y-2 mb-6 text-[14px] text-[#17191C]">
                    {[
                      "RO Antiscalants, Biocides & Cleaners",
                      "Cooling Water & Boiler Chemicals",
                      "Wastewater & ETP Coagulants (PAC)",
                      "Packaged Water Treatment Plants & Filtration",
                    ].map((it, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B32] mr-2.5 shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Link href="/chemicals" className="btn btn-primary">
                    Explore Chemicals
                  </Link>
                </div>
              </div>
            </article>

            {/* Division 2 */}
            <article className="division-card">
              <div className="relative h-[280px] w-full bg-[#EBECEE]">
                <Image
                  src="/assets/img/tube-fittings.jpg"
                  alt="Instrumentation & Valves"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-between flex-1">
                <div>
                  <span className="eyebrow">DIVISION 02</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#17191C] mb-3">
                    Instrumentation &amp; Valves
                  </h3>
                  <p className="text-[#5F6871] text-[15px] leading-relaxed mb-5">
                    High-integrity fluid control hardware in SS316, Monel, Inconel and Hastelloy — rated to 10,000 PSI with full EN 10204 Type 3.1 &amp; 3.2 traceability.
                  </p>
                  <ul className="space-y-2 mb-6 text-[14px] text-[#17191C]">
                    {[
                      "Twin-Ferrule Tube Fittings (1/8\"–1\")",
                      "Needle, Ball & Manifold Valves (Up to 10k PSI)",
                      "Continuous Seamless Tubing Coils (ASTM A269)",
                      "Process Analysers, CEMS & Sample Shelters",
                    ].map((it, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B32] mr-2.5 shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Link href="/instrumentation" className="btn btn-secondary">
                    Explore Instrumentation
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 4. EIGHT CHEMICAL GROUPS */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF] border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-[760px] mb-12">
            <span className="eyebrow">WATER &amp; PROCESS CHEMISTRY</span>
            <h2 className="text-[#17191C] text-2xl sm:text-4xl font-extrabold tracking-tight">
              Eight solution groups, sixty-three line items
            </h2>
            <p className="text-[#5F6871] text-base sm:text-lg mt-2">
              Dosing chemistry, plant and vessel manufacturing, filtration media and testing instruments — supplied as single items or as a complete package.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {chemicalGroups.map((group) => (
              <article key={group.num} className="chem-card">
                <div className="chem-media">
                  <Image
                    src={group.img}
                    alt={group.title}
                    width={292}
                    height={136}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="chem-body p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="chem-num">{group.num}</span>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#17191C] mt-1 mb-3 pb-3 border-b border-[#D8DDE2]">
                      {group.title}
                    </h3>
                    <ul className="space-y-1.5 text-[13px] text-[#5F6871]">
                      {group.items.map((it, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B32] mr-2 mt-1.5 shrink-0" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-2">
                    <Link
                      href={`/chemicals/${group.slug}`}
                      className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#FF4B32] hover:text-[#E03820]"
                    >
                      {group.more}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SOURCING PARTNER QUOTE BANNER */}
      <section className="py-20 bg-[#17191C] text-white text-center">
        <div className="max-w-[860px] mx-auto px-6">
          <span className="eyebrow">ENGINEERING INTEGRITY</span>
          <h2 className="text-white text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-5">
            A specialised sourcing and supply partner for critical industrial systems
          </h2>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-8">
            We bridge global manufacturer specifications with strict end-user compliance across refineries, petrochemical complexes, thermal power stations and EPC infrastructure.
          </p>
          <Link href="/request-a-quote" className="btn btn-primary">
            Request a Quotation
          </Link>
        </div>
      </section>

      {/* 6. INSTRUMENTATION PRODUCTS */}
      <section className="py-20 lg:py-24 bg-[#F5F6F7] border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-[760px] mb-12">
            <span className="eyebrow">FLUID CONTROL HARDWARE</span>
            <h2 className="text-[#17191C] text-2xl sm:text-4xl font-extrabold tracking-tight">
              Precision fittings, valves and analytical systems
            </h2>
            <p className="text-[#5F6871] text-base sm:text-lg mt-2">
              Instrumentation-grade components in SS316, carbon steel, brass and specialist alloys — sized 1/8" to 1" and rated to 10,000 psi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instrumentationProducts.map((p, idx) => (
              <article key={idx} className="petro-card">
                <div className="relative h-56 w-full bg-[#EBECEE] overflow-hidden">
                  <span className="absolute top-3.5 left-3.5 z-10 bg-[#17191C]/90 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px]">
                    {p.tag}
                  </span>
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#17191C] mb-2">
                      {p.title}
                    </h3>
                    <p className="text-[#5F6871] text-sm leading-relaxed mb-4">
                      {p.desc}
                    </p>
                  </div>
                  <div>
                    <Link
                      href={`/instrumentation/${p.slug}`}
                      className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#FF4B32] hover:text-[#E03820] inline-flex items-center"
                    >
                      <span>View specifications</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY PARTNER WITH PETRO ENGINEERING */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF] border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-[760px] mx-auto text-center mb-14">
            <span className="eyebrow">WHY PETRO ENGINEERING</span>
            <h2 className="text-[#17191C] text-2xl sm:text-4xl font-extrabold tracking-tight">
              Why leading industrial companies partner with Petro Engineering
            </h2>
            <p className="text-[#5F6871] text-base sm:text-lg mt-3">
              We eliminate single-source vulnerability, reduce commercial overhead, and maintain zero-defect documentation dossiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyPartner.map((w, idx) => {
              const IconComp = w.icon;
              return (
                <div
                  key={idx}
                  className="p-7 bg-[#F5F6F7] border border-[#D8DDE2] rounded-[8px] hover:border-[#929DA7] transition-all"
                >
                  <div className="w-12 h-12 rounded-[6px] bg-[#FF4B32]/10 text-[#FF4B32] flex items-center justify-center mb-5 font-bold">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#17191C] mb-2">
                    {w.title}
                  </h3>
                  <p className="text-[#5F6871] text-sm leading-relaxed">
                    {w.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. SERVICES OVERVIEW */}
      <section className="py-20 lg:py-24 bg-[#F5F6F7] border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-[760px] mb-12">
            <span className="eyebrow">PROCUREMENT &amp; SOURCING SERVICES</span>
            <h2 className="text-[#17191C] text-2xl sm:text-4xl font-extrabold tracking-tight">
              End-to-end support, from enquiry to site delivery
            </h2>
            <p className="text-[#5F6871] text-base sm:text-lg mt-2">
              From single-item replacement orders to complete tender package consolidation — we manage compliance, expediting and third-party inspection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] p-7 border border-[#D8DDE2] rounded-[8px] flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <span className="font-['Plus_Jakarta_Sans'] text-xs font-extrabold uppercase tracking-wider text-[#FF4B32] mb-2 block">
                    SERVICE 0{idx + 1}
                  </span>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#17191C] mb-2.5">
                    {s.title}
                  </h3>
                  <p className="text-[#5F6871] text-sm leading-relaxed mb-5">
                    {s.desc}
                  </p>
                </div>
                <div>
                  <Link
                    href={`/services#${s.slug}`}
                    className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#FF4B32] hover:text-[#E03820] inline-flex items-center"
                  >
                    <span>Full service scope</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA BAND */}
      <section className="relative bg-[#17191C] overflow-hidden py-20 lg:py-24 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/assets/img/chem-05-water-treatment-plants.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/95 to-[#17191C]/80" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-[620px]">
              <span className="eyebrow">GET IN TOUCH</span>
              <h2 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-3">
                We're here to source. Call us today.
              </h2>
              <p className="text-white/75 text-base sm:text-lg leading-relaxed">
                Speak directly with our technical sales desk for quotation assistance, material test reports, or dosage projections.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <a
                href={`tel:${COMPANY_INFO.contact.phoneRaw}`}
                className="btn btn-primary"
              >
                <Phone className="w-4 h-4 mr-1.5" />
                <span>{COMPANY_INFO.contact.phone}</span>
              </a>
              <Link
                href="/request-a-quote"
                className="btn btn-outline"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
