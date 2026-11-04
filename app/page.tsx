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
  FlaskConical,
  Cog,
  Mail,
  Target,
  Eye,
  Droplets,
  Boxes,
  ClipboardList,
} from "lucide-react";
import { COMPANY_INFO } from "@/data/company";
import SolutionLink from "@/components/common/SolutionLink";
import Reveal from "@/components/common/Reveal";
import CountUp from "@/components/common/CountUp";
import HeroSlider from "@/components/common/HeroSlider";
import SectionDots from "@/components/common/SectionDots";
import ServiceRoute from "@/components/common/ServiceRoute";

export default function HomePage() {
  const chemCounts = [10, 7, 5, 10, 8, 6, 11, 6]; // line items per group on petroeng.in
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
      img: "/assets/img/chem-08-laboratory-equipment.jpg",
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

  const stats = [
    { n: 8, l: "Chemical groups" },
    { n: 63, l: "Chemical line items" },
    { n: 5, l: "Compliance standards" },
    { n: 1, l: "Point of contact" },
  ];
  const slides = [
    {
      img: "/assets/img/reverse-osmosis.jpg",
      label: "Chemical & water treatment",
      line1: "Treatment chemicals and",
      line2: "water plants.",
      text: "RO, cooling, boiler and ETP chemistry, complete treatment and sewage plants, filtration media, and the laboratory instruments to verify performance.",
      primary: { href: "/chemicals", label: "Explore Chemicals" },
      secondary: { href: "/request-a-quote", label: "Request a Quote" },
      points: ["8 chemical groups", "63 line items", "Specified to your water analysis"],
    },
    {
      img: "/assets/img/tube-fittings.jpg",
      label: "Instrumentation & valves",
      line1: "Precision fittings, valves and",
      line2: "tubing.",
      text: 'Instrumentation-grade components in SS316, carbon steel, brass and specialist alloys — sized 1/8" to 1" and rated to 10,000 psi.',
      primary: { href: "/instrumentation", label: "View Instrumentation" },
      secondary: { href: "/request-a-quote", label: "Request a Quote" },
      points: ["EN 10204 3.1 traceability", "NACE MR0175 compliant", "Up to 10,000 PSI"],
    },
    {
      img: "/assets/img/analyser-systems.jpg",
      label: "Analyser & sampling systems",
      line1: "Complete analyser and",
      line2: "sampling packages.",
      text: "Sample conditioning systems, heated probes, shelters and continuous gas analysers for process monitoring and environmental compliance.",
      primary: { href: "/instrumentation#analyser-systems", label: "Analyser Systems" },
      secondary: { href: "/contact", label: "Talk to Engineers" },
      points: ["Sample conditioning", "CEMS & GC", "Calibration support"],
    },
    {
      img: "/assets/img/hero-visual.png",
      label: "Procurement & sourcing",
      line1: "One accountable partner for",
      line2: "complete supply.",
      text: "From single-item replacement orders to full tender-package consolidation — we manage compliance, expediting and third-party inspection.",
      primary: { href: "/services", label: "Our Services" },
      secondary: { href: "/request-a-quote", label: "Request a Quote" },
      points: ["Single point of contact", "Documentation control", "Export-grade delivery"],
    },
  ];

  const engage = [
    {
      t: "Single items",
      d: "Replacement and one-off orders supplied against your specification, with certification and documentation.",
      pts: ["Chemicals, fittings, valves, tubing", "Specification reviewed before quote", "Material test certificates on request"],
      icon: Boxes,
    },
    {
      t: "Complete packages",
      d: "Chemistry with the dosing pumps, plants and instruments that go with it — supplied as one package.",
      pts: ["Dosing chemistry plus accessories", "Plants, vessels and filtration media", "Test kits to verify performance"],
      icon: Layers,
    },
    {
      t: "Project procurement",
      d: "End-to-end procurement support for EPC and turnkey projects across multiple vendors.",
      pts: ["RFQ and vendor evaluation", "Technical & commercial alignment", "Expediting and consolidated shipments"],
      icon: ClipboardList,
    },
  ];

  const Head = ({
    eyebrow,
    title,
    text,
    link,
  }: {
    eyebrow: string;
    title: string;
    text?: string;
    link?: { href: string; label: string };
  }) => (
    <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 sm:mb-14">
      <div className="max-w-[740px]">
        <span className="inline-flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#FF4B32] mb-3">
          <span className="h-[3px] w-9 bg-[#FF4B32] rounded" />
          {eyebrow}
        </span>
        <h2 className="text-[1.7rem] sm:text-4xl lg:text-[2.8rem] font-black tracking-tight leading-[1.1] text-[#17191C]">
          {title}
        </h2>
        {text && <p className="mt-4 text-[15px] sm:text-lg leading-relaxed text-[#929DA7]">{text}</p>}
      </div>
      {link && (
        <Link
          href={link.href}
          className="group inline-flex items-center gap-2 text-sm font-extrabold text-[#FF4B32] hover:text-[#FFA028] shrink-0 transition-colors"
        >
          {link.label}{" "}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
        </Link>
      )}
    </Reveal>
  );

  return (
    <div className="w-full bg-white overflow-x-clip text-[#17191C]">
      <SectionDots
        items={[
          { id: "top", label: "Home" },
          { id: "about", label: "About" },
          { id: "what-we-do", label: "What we do" },
          { id: "chemicals", label: "Chemicals" },
          { id: "instrumentation", label: "Instrumentation" },
          { id: "why", label: "Why Petro" },
          { id: "process", label: "Process" },
          { id: "engage", label: "How we supply" },
          { id: "services", label: "Services" },
          { id: "contact", label: "Contact" },
        ]}
      />

      {/* ===== HERO SLIDER ===== */}
      <HeroSlider slides={slides} />

      {/* ===== STATS (floating) ===== */}
      <div className="relative z-30 -mt-10 sm:-mt-12 px-5 sm:px-8">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { n: stats[0].n, l: "Chemical groups", icon: Layers, c: "bg-[#FF4B32]" },
            { n: stats[1].n, l: "Line items", icon: Boxes, c: "bg-[#17191C]" },
            { n: stats[2].n, l: "Standards", icon: ShieldCheck, c: "bg-[#FF4B32]" },
            { n: stats[3].n, l: "Point of contact", icon: Users, c: "bg-[#17191C]" },
          ].map((s, k) => (
            <Reveal key={s.l} delay={k * 80} variant="zoom">
              <div className="group flex items-center gap-3 sm:gap-4 rounded-2xl bg-white border border-[#929DA7]/20 shadow-[0_14px_34px_rgba(23,25,28,0.08)] px-4 sm:px-5 py-3.5 sm:py-4 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-500">
                <span
                  className={`w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl text-white flex items-center justify-center group-hover:rotate-6 group-hover:scale-110 transition-transform ${s.c}`}
                >
                  <s.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
                <div className="min-w-0">
                  <div className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-black leading-none text-[#17191C]">
                    <CountUp end={s.n} />
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#929DA7] leading-tight">
                    {s.l}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ===== ABOUT ===== */}
      <section id="about" className="grid lg:grid-cols-2 bg-[#F5F6F7] mt-8">
        <Reveal
          variant="left"
          className="p-8 sm:p-10 lg:py-14 lg:pr-14 lg:pl-[max(3.5rem,calc((100vw/var(--z)-1240px)/2+2rem))] flex flex-col justify-center"
        >
          <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF4B32] mb-2">
            <span className="h-[3px] w-9 bg-[#FF4B32] rounded" />
            About Petro Engineering
          </span>
          <h2 className="text-[1.5rem] sm:text-3xl font-black tracking-tight text-[#17191C] leading-[1.15] mb-3">
            A specialised sourcing and supply partner for critical industrial systems
          </h2>
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#17191C]/80 mb-4">
            We bridge global manufacturer specifications with strict end-user compliance across refineries, petrochemical complexes, thermal power stations and EPC infrastructure.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {["Mission-led", "Compliant", "Single point of contact"].map((x) => (
              <span
                key={x}
                className="rounded-full bg-white border border-[#929DA7]/20 px-3 py-1 text-[12px] font-bold text-[#17191C]"
              >
                {x}
              </span>
            ))}
          </div>
          <div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg bg-[#FF4B32] hover:bg-[#17191C] text-white text-sm font-bold px-5 py-2.5 transition-colors"
            >
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
        <Reveal
          variant="right"
          className="relative min-h-[300px] lg:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)] overflow-hidden group"
        >
          <Image
            src="/assets/img/service-technical-consultation.jpg"
            alt="Engineers providing technical consultation on equipment selection"
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-[1400ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B32]/25 to-transparent" />
        </Reveal>
      </section>

      {/* ===== WHAT WE DO ===== */}
      <section
        id="what-we-do"
        className="py-9 sm:py-11 bg-gradient-to-br from-[#17191C] via-[#23272B] to-[#17191C]"
      >
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[560px] mx-auto mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FFA028] mb-2">
              <span className="h-[3px] w-9 bg-[#FFA028] rounded" />
              What we do
            </span>
            <h2 className="text-[1.2rem] sm:text-[1.6rem] font-black tracking-tight leading-[1.15] text-white">
              Two divisions, one point of contact
            </h2>
            <p className="mt-1.5 text-[13px] sm:text-[14px] leading-relaxed text-white/70">
              Water chemistry and the plants that run it, alongside the instrumentation that measures and controls it.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 max-w-[820px] mx-auto">
            {[
              {
                icon: FlaskConical,
                t: "Chemical & Water Treatment",
                d: "RO, cooling, boiler and ETP chemistry, complete treatment and sewage plants, filtration media, and the laboratory instruments to verify performance.",
                pills: ["Chemicals", "Treatment plants", "Filtration", "Lab instruments"],
                href: "/chemicals",
                cta: "View all chemicals",
                ic: "bg-[#FF4B32]",
                btn: "bg-[#FF4B32] hover:bg-[#FFA028]",
              },
              {
                icon: Cog,
                t: "Instrumentation & Valves",
                d: "Precision tube and pipe fittings, needle, ball, manifold and check valves, seamless tubing and analyser systems in SS316 and specialist alloys.",
                pills: ["Fittings", "Valves", "Tubing", "Analyser systems"],
                href: "/instrumentation",
                cta: "View instrumentation",
                ic: "bg-[#17191C]",
                btn: "bg-[#FFA028] hover:bg-[#FF4B32]",
              },
            ].map((c, k) => (
              <Reveal key={c.t} delay={k * 120} variant={k ? "right" : "left"}>
                <article className="group h-full rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur p-4 sm:p-5 hover:bg-white/[0.12] hover:-translate-y-1.5 transition-all duration-500 flex flex-col">
                  <span
                    className={`w-9 h-9 rounded-lg text-white flex items-center justify-center mb-2.5 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500 ${c.ic}`}
                  >
                    <c.icon className="w-4 h-4" />
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white mb-1.5">{c.t}</h3>
                  <p className="text-[12.5px] sm:text-[13px] leading-relaxed text-white/70 mb-3">{c.d}</p>
                  <ul className="flex flex-wrap gap-1.5 mb-3.5">
                    {c.pills.map((x) => (
                      <li
                        key={x}
                        className="rounded-full px-2.5 py-0.5 text-[10.5px] font-bold border bg-white/10 border-white/25 text-white"
                      >
                        {x}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-2 border-t border-white/10">
                    <Link
                      href={c.href}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold text-white px-3.5 py-1.5 rounded-md transition-colors ${c.btn}`}
                    >
                      {c.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CHEMICALS ===== */}
      <section id="chemicals" className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <Head
            eyebrow="Water & Process Chemistry"
            title="Comprehensive chemical treatment and water plant solutions"
            text="Specialised water treatment formulations, process chemicals, complete plants, and laboratory equipment for industrial applications."
            link={{ href: "/chemicals", label: "View all 8 chemical groups" }}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {chemicalGroups.map((group, k) => (
              <Reveal key={group.slug} delay={(k % 4) * 80}>
                <div className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-[#929DA7]/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#F5F6F7]">
                    <Image
                      src={group.img}
                      alt={group.title}
                      fill
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-[1100ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#17191C]/80 via-transparent to-transparent" />
                    <span className="absolute top-3.5 left-3.5 rounded-md bg-[#FF4B32] text-white px-2.5 py-1 text-xs font-extrabold tracking-wider">
                      {group.num}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-extrabold text-[#17191C] mb-3 line-clamp-1">
                      {group.title}
                    </h3>
                    <ul className="space-y-1.5 text-[13px] text-[#17191C]/80 mb-4 flex-1">
                      {group.items.slice(0, 4).map((it) => (
                        <li key={it} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#FF4B32]" />
                          <span className="line-clamp-1">{it}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-3 border-t border-[#929DA7]/15 flex items-center justify-between">
                      <Link
                        href={`/chemicals/${group.slug}`}
                        className="text-xs font-extrabold text-[#FF4B32] hover:text-[#FFA028] transition-colors"
                      >
                        {group.more}
                      </Link>
                      <SolutionLink
                        item={group.title}
                        category="Chemicals"
                        className="text-xs font-bold text-[#929DA7] hover:text-[#17191C]"
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INDIA & EXPORT SUPPLY ===== */}
      <section className="py-14 sm:py-20 bg-[#F5F6F7] border-y border-[#929DA7]/20">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-8 items-center">
          <Reveal variant="left" className="lg:col-span-6">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF4B32] mb-3">
              <span className="h-[3px] w-9 bg-[#FF4B32] rounded" />
              Supply across India &amp; export
            </span>
            <h2 className="text-[1.7rem] sm:text-4xl font-black tracking-tight leading-[1.1] text-[#17191C] mb-5">
              Based in Mumbai, delivering to plants worldwide
            </h2>
            <p className="text-[15px] sm:text-lg leading-relaxed text-[#17191C]/80 mb-5">
              Petro Engineering supplies water treatment chemistry and process instrumentation from a base in Mumbai — to plants across India, and on export. Two divisions, one accountable point of contact.
            </p>
            <p className="text-[15px] leading-relaxed text-[#929DA7] mb-7">
              We support refineries, petrochemical plants, EPC contractors and system integrators with certified equipment, dosing chemistry, treatment plants and precision fittings from manufacturers we have already qualified.
            </p>
            <Link
              href="/request-a-quote"
              className="inline-flex items-center gap-2 rounded-lg bg-[#FF4B32] hover:bg-[#17191C] text-white font-bold px-7 py-4 transition-colors"
            >
              Start your enquiry <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
          <Reveal variant="right" className="lg:col-span-6">
            <div className="grid gap-4">
              {[
                {
                  t: "Global supplier network",
                  d: "Direct access to approved manufacturers and OEMs across Europe, North America, Japan and Asia-Pacific.",
                  icon: Globe,
                },
                {
                  t: "Documented, export-grade delivery",
                  d: "Sea-worthy ISPM-15 export packing and comprehensive dossiers ready for client handover.",
                  icon: Truck,
                },
                {
                  t: "Compliance you can trace",
                  d: "EN 10204 3.1 / 3.2 certification, NACE MR0175, ASME, ASTM and API standards.",
                  icon: ShieldCheck,
                },
              ].map((f, k) => (
                <div
                  key={f.t}
                  className="group flex gap-4 rounded-2xl border border-[#929DA7]/20 bg-white p-5 shadow-sm hover:shadow-xl hover:border-[#FFA028] hover:translate-x-2 transition-all duration-500"
                >
                  <span
                    className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-white ${
                      ["bg-[#FF4B32]", "bg-[#FFA028]", "bg-[#17191C]"][k]
                    }`}
                  >
                    <f.icon className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-[#17191C] mb-1">{f.t}</h3>
                    <p className="text-[14px] text-[#929DA7] leading-relaxed">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== INSTRUMENTATION ===== */}
      <section id="instrumentation" className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <Head
            eyebrow="Instrumentation & valves"
            title="Precision fittings, valves and analytical systems"
            text='Instrumentation-grade components in SS316, carbon steel, brass and specialist alloys — sized 1/8" to 1" and rated to 10,000 psi.'
            link={{ href: "/instrumentation", label: "View full range" }}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {instrumentationProducts.map((p, k) => (
              <Reveal key={p.slug} delay={(k % 3) * 90}>
                <Link
                  href={`/instrumentation#${p.slug}`}
                  className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-[#929DA7]/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F6F7]">
                    <Image
                      src={p.img}
                      alt={p.title}
                      fill
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-[1100ms]"
                    />
                    <span className="absolute top-4 right-4 rounded-full bg-[#17191C] text-white px-3.5 py-1 text-xs font-extrabold">
                      {p.tag}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-extrabold text-[#17191C] mb-2">{p.title}</h3>
                    <p className="text-[14px] text-[#929DA7] leading-relaxed mb-5 flex-1">{p.desc}</p>
                    <span className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#FF4B32] group-hover:text-[#FFA028] transition-colors">
                      Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY (numbered) ===== */}
      <section id="why" className="py-16 sm:py-24 bg-[#F5F6F7]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <Head
            eyebrow="Why choose Petro Engineering"
            title="Why leading industrial companies partner with us"
            text="We eliminate single-source vulnerability, reduce commercial overhead, and maintain zero-defect documentation dossiers."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyPartner.map((w, k) => (
              <Reveal key={w.title} delay={(k % 3) * 90}>
                <div className="group h-full rounded-2xl bg-white border border-[#929DA7]/20 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-12 h-12 rounded-xl bg-[#17191C] text-white flex items-center justify-center group-hover:bg-[#FF4B32] group-hover:rotate-6 transition-all duration-300">
                      <w.icon className="w-6 h-6" />
                    </span>
                    <span className="text-2xl font-black text-[#929DA7]/40">0{k + 1}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#17191C] mb-2">{w.title}</h3>
                  <p className="text-[14px] text-[#929DA7] leading-relaxed flex-1">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW WE SUPPLY ===== */}
      <section id="engage" className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <Head
            eyebrow="How we supply"
            title="Flexible engagement models tailored to your operations"
            text="Whether you need urgent replacement items, a package consolidation, or full procurement support, we structure our supply to match your workflow."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {engage.map((e, k) => (
              <Reveal key={e.t} delay={k * 100}>
                <div className="group h-full rounded-2xl border border-[#929DA7]/20 p-6 sm:p-7 hover:border-[#FF4B32] hover:shadow-xl transition-all duration-500 flex flex-col bg-white">
                  <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF4B32] to-[#FFA028] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <e.icon className="w-6 h-6" />
                  </span>
                  <h3 className="text-xl font-black text-[#17191C] mb-2">{e.t}</h3>
                  <p className="text-[14px] text-[#929DA7] leading-relaxed mb-5">{e.d}</p>
                  <ul className="space-y-2 mt-auto pt-4 border-t border-[#929DA7]/15 text-[13px] text-[#17191C]">
                    {e.pts.map((pt) => (
                      <li key={pt} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#FF4B32]" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section
        id="services"
        className="relative py-10 sm:py-12 bg-gradient-to-b from-white via-[#F5F6F7] to-white overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#FF4B32]/[0.05] blur-[90px]" />
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#FFA028]/[0.1] blur-[90px]" />
        <div className="relative max-w-[1320px] mx-auto px-5 sm:px-8">
          <div className="text-center max-w-[680px] mx-auto mb-6">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF4B32] mb-2">
              <span className="h-[3px] w-9 rounded bg-[#FF4B32]" />
              Procurement &amp; sourcing services
            </span>
            <h2 className="text-[1.35rem] sm:text-[1.75rem] font-black leading-[1.15] text-[#17191C] mb-2">
              End-to-end support, from enquiry to site delivery
            </h2>
            <p className="text-[14px] text-[#929DA7]">
              From single-item replacement orders to complete tender package consolidation — we manage compliance, expediting and third-party inspection.
            </p>
          </div>
          <ServiceRoute
            services={services.map((s, k) => ({
              ...s,
              img: [
                "/assets/img/pipe-fittings.jpg",
                "/assets/img/gas-analytics.jpg",
                "/assets/img/service-inspection-qa.jpg",
                "/assets/img/tube-fittings.jpg",
                "/assets/img/tubing-coils.jpg",
                "/assets/img/service-technical-consultation.jpg",
              ][k],
            }))}
          />
          <div className="text-center mt-5">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg bg-[#FF4B32] hover:bg-[#17191C] text-white text-sm font-bold px-5 py-2.5 transition-colors"
            >
              View all services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== GET IN TOUCH ===== */}
      <section
        id="contact"
        className="py-9 bg-gradient-to-r from-[#17191C] via-[#23272B] to-[#17191C]"
      >
        <Reveal className="max-w-[1240px] mx-auto px-5 sm:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-[560px]">
            <h2 className="text-white text-[1.4rem] sm:text-3xl font-black leading-[1.15] mb-1">
              We're here to source. Call us today.
            </h2>
            <p className="text-white/70 text-[13.5px]">
              Speak directly with our technical sales desk for quotation assistance, material test reports, or dosage projections.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              {
                icon: Phone,
                t: "Call",
                v: COMPANY_INFO.contact.phone,
                href: `tel:${COMPANY_INFO.contact.phoneRaw}`,
                c: "bg-[#FF4B32] hover:bg-[#FFA028]",
              },
              {
                icon: Mail,
                t: "Email",
                v: COMPANY_INFO.contact.email,
                href: `mailto:${COMPANY_INFO.contact.email}`,
                c: "bg-[#FFA028] hover:bg-[#FF4B32]",
              },
              {
                icon: FileCheck,
                t: "RFQ",
                v: "Request a quote",
                href: "/request-a-quote",
                c: "bg-white/15 border border-white/30 hover:bg-white/25",
              },
            ].map((c) => (
              <a
                key={c.t}
                href={c.href}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-white hover:-translate-y-1 hover:shadow-xl transition-all ${c.c}`}
              >
                <c.icon className="w-5 h-5" />
                <span>
                  <span className="block text-[10px] font-bold uppercase opacity-80">{c.t}</span>
                  <span className="block text-[13px] font-extrabold">{c.v}</span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
