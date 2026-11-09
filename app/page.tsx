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
    { img: "/assets/img/reverse-osmosis.jpg", label: "Chemical & water treatment", line1: "Treatment chemicals and", line2: "water plants.", text: "RO, cooling, boiler and ETP chemistry, complete treatment and sewage plants, filtration media, and the laboratory instruments to verify performance.", primary: { href: "/chemicals", label: "Explore Chemicals" }, secondary: { href: "/request-a-quote", label: "Request a Quote" }, points: ["8 chemical groups", "63 line items", "Specified to your water analysis"] },
    { img: "/assets/img/tube-fittings.jpg", label: "Instrumentation & valves", line1: "Precision fittings, valves and", line2: "tubing.", text: "Instrumentation-grade components in SS316, carbon steel, brass and specialist alloys — sized 1/8\" to 1\" and rated to 10,000 psi.", primary: { href: "/instrumentation", label: "View Instrumentation" }, secondary: { href: "/request-a-quote", label: "Request a Quote" }, points: ["EN 10204 3.1 traceability", "NACE MR0175 compliant", "Up to 10,000 PSI"] },
    { img: "/assets/img/analyser-systems.jpg", label: "Analyser & sampling systems", line1: "Complete analyser and", line2: "sampling packages.", text: "Sample conditioning systems, heated probes, shelters and continuous gas analysers for process monitoring and environmental compliance.", primary: { href: "/instrumentation#analyser-systems", label: "Analyser Systems" }, secondary: { href: "/contact", label: "Talk to Engineers" }, points: ["Sample conditioning", "CEMS & GC", "Calibration support"] },
    { img: "/assets/img/hero-visual.png", label: "Procurement & sourcing", line1: "One accountable partner for", line2: "complete supply.", text: "From single-item replacement orders to full tender-package consolidation — we manage compliance, expediting and third-party inspection.", primary: { href: "/services", label: "Our Services" }, secondary: { href: "/request-a-quote", label: "Request a Quote" }, points: ["Single point of contact", "Documentation control", "Export-grade delivery"] },
  ];
  const engage = [
    { t: "Single items", d: "Replacement and one-off orders supplied against your specification, with certification and documentation.", pts: ["Chemicals, fittings, valves, tubing", "Specification reviewed before quote", "Material test certificates on request"], icon: Boxes },
    { t: "Complete packages", d: "Chemistry with the dosing pumps, plants and instruments that go with it — supplied as one package.", pts: ["Dosing chemistry plus accessories", "Plants, vessels and filtration media", "Test kits to verify performance"], icon: Layers },
    { t: "Project procurement", d: "End-to-end procurement support for EPC and turnkey projects across multiple vendors.", pts: ["RFQ and vendor evaluation", "Technical & commercial alignment", "Expediting and consolidated shipments"], icon: ClipboardList },
  ];

  const Head = ({ eyebrow, title, text, link }: { eyebrow: string; title: string; text?: string; link?: { href: string; label: string } }) => (
    <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 sm:mb-14">
      <div className="max-w-[740px]">
        <span className="inline-flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#C80808] mb-3"><span className="h-[3px] w-9 bg-[#C80808] rounded" />{eyebrow}</span>
        <h2 className="text-[1.7rem] sm:text-4xl lg:text-[2.8rem] font-black tracking-tight leading-[1.1] text-[#17191C]">{title}</h2>
        {text && <p className="mt-4 text-[15px] sm:text-lg leading-relaxed text-[#566472]">{text}</p>}
      </div>
      {link && <Link href={link.href} className="group inline-flex items-center gap-2 text-sm font-extrabold text-[#C80808] hover:text-[#C80808] shrink-0 transition-colors">{link.label} <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" /></Link>}
    </Reveal>
  );

  return (
    <div className="w-full bg-white overflow-x-clip text-[#566472]">
      <SectionDots items={[{ id: "top", label: "Home" }, { id: "about", label: "About" }, { id: "what-we-do", label: "What we do" }, { id: "chemicals", label: "Chemicals" }, { id: "instrumentation", label: "Instrumentation" }, { id: "why", label: "Why Petro" }, { id: "process", label: "Process" }, { id: "engage", label: "How we supply" }, { id: "services", label: "Services" }, { id: "contact", label: "Contact" }]} />

      {/* ===== HERO SLIDER ===== */}
      <HeroSlider slides={slides} />

      {/* ===== STATS (floating) ===== */}
      <div className="relative z-30 -mt-10 sm:-mt-12 px-5 sm:px-8">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { n: stats[0].n, l: "Chemical groups", icon: Layers, c: "bg-[#C80808]" },
            { n: stats[1].n, l: "Line items", icon: Boxes, c: "bg-[#17191C]" },
            { n: stats[2].n, l: "Standards", icon: ShieldCheck, c: "bg-[#C80808]" },
            { n: stats[3].n, l: "Point of contact", icon: Users, c: "bg-[#17191C]" },
          ].map((s, k) => (
            <Reveal key={s.l} delay={k * 80} variant="zoom">
              <div className="group flex items-center gap-3 sm:gap-4 rounded-2xl bg-white border border-[#E7E9EE] shadow-[0_14px_34px_rgba(23,58,82,0.14)] px-4 sm:px-5 py-3.5 sm:py-4 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-500">
                <span className={`w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl text-white flex items-center justify-center group-hover:rotate-6 group-hover:scale-110 transition-transform ${s.c}`}><s.icon className="w-5 h-5 sm:w-6 sm:h-6" /></span>
                <div className="min-w-0">
                  <div className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-black leading-none text-[#17191C]"><CountUp end={s.n} /></div>
                  <div className="mt-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#566472] leading-tight">{s.l}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ===== ABOUT ===== */}
      <section id="about" className="grid lg:grid-cols-2 bg-[#FFF8F0]">
        <Reveal variant="left" className="p-8 sm:p-10 lg:py-14 lg:pr-14 lg:pl-[max(3.5rem,calc((100vw/var(--z)-1240px)/2+2rem))] flex flex-col justify-center">
          <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C80808] mb-2"><span className="h-[3px] w-9 bg-[#C80808] rounded" />About Petro Engineering</span>
          <h2 className="text-[1.5rem] sm:text-3xl font-black tracking-tight text-[#17191C] leading-[1.15] mb-3">A specialised sourcing and supply partner for critical industrial systems</h2>
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#566472] mb-4">We bridge global manufacturer specifications with strict end-user compliance across refineries, petrochemical complexes, thermal power stations and EPC infrastructure.</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {["Mission-led", "Compliant", "Single point of contact"].map((x) => (<span key={x} className="rounded-full bg-white border border-[#E7E9EE] px-3 py-1 text-[12px] font-bold text-[#17191C]">{x}</span>))}
          </div>
          <div><Link href="/about" className="inline-flex items-center gap-2 rounded-lg bg-[#C80808] hover:bg-[#A81010] text-white text-sm font-bold px-5 py-2.5 transition-colors">Learn More <ArrowRight className="w-4 h-4" /></Link></div>
        </Reveal>
        <Reveal variant="right" className="relative min-h-[300px] lg:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)] overflow-hidden group">
          <Image src="/assets/img/service-technical-consultation.jpg" alt="Engineers providing technical consultation on equipment selection" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-[1400ms]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#C80808]/35 to-transparent" />
        </Reveal>
      </section>

      {/* ===== WHAT WE DO ===== */}
      <section id="what-we-do" className="py-9 sm:py-11 bg-gradient-to-br from-[#17191C]/90 via-[#2a0c0c]/90 to-[#17191C]/90">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[560px] mx-auto mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B] mb-2"><span className="h-[3px] w-9 bg-[#F2B93B] rounded" />What we do</span>
            <h2 className="text-[1.2rem] sm:text-[1.6rem] font-black tracking-tight leading-[1.15] text-white">Two divisions, one point of contact</h2>
            <p className="mt-1.5 text-[13px] sm:text-[14px] leading-relaxed text-white/70">Water chemistry and the plants that run it, alongside the instrumentation that measures and controls it.</p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 max-w-[820px] mx-auto">
            {[
              { icon: FlaskConical, t: "Chemical & Water Treatment", d: "RO, cooling, boiler and ETP chemistry, complete treatment and sewage plants, filtration media, and the laboratory instruments to verify performance.", pills: ["Chemicals", "Treatment plants", "Filtration", "Lab instruments"], href: "/chemicals", cta: "View all chemicals", ic: "bg-[#C80808]", btn: "bg-[#C80808] hover:bg-[#A81010]" },
              { icon: Cog, t: "Instrumentation & Valves", d: "Precision tube and pipe fittings, needle, ball, manifold and check valves, seamless tubing and analyser systems in SS316 and specialist alloys.", pills: ["Fittings", "Valves", "Tubing", "Analyser systems"], href: "/instrumentation", cta: "View instrumentation", ic: "bg-[#17191C]", btn: "bg-[#D4950F] hover:bg-[#A81010]" },
            ].map((c, k) => (
              <Reveal key={c.t} delay={k * 120} variant={k ? "right" : "left"}>
                <article className="group h-full rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur p-4 sm:p-5 hover:bg-white/[0.12] hover:-translate-y-1.5 transition-all duration-500 flex flex-col">
                  <span className={`w-9 h-9 rounded-lg text-white flex items-center justify-center mb-2.5 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500 ${c.ic}`}><c.icon className="w-4 h-4" /></span>
                  <h3 className="text-base sm:text-lg font-black text-white mb-1.5">{c.t}</h3>
                  <p className="text-[12.5px] sm:text-[13px] leading-relaxed text-white/70 mb-3">{c.d}</p>
                  <ul className="flex flex-wrap gap-1.5 mb-3.5">
                    {c.pills.map((x) => (<li key={x} className="rounded-full px-2.5 py-0.5 text-[10.5px] font-bold border bg-white/10 border-white/25 text-white">{x}</li>))}
                  </ul>
                  <Link href={c.href} className={`mt-auto self-start inline-flex items-center gap-2 rounded-lg text-white text-[13px] font-bold px-4 py-2 transition-colors ${c.btn}`}>{c.cta} <ArrowRight className="w-4 h-4" /></Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CHEMICALS (photo bands) ===== */}
      <section id="chemicals" className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[660px] mx-auto mb-8">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C80808] mb-2"><span className="h-[3px] w-9 bg-[#C80808] rounded" />Chemical &amp; water treatment</span>
            <h2 className="text-[1.4rem] sm:text-[1.9rem] font-black tracking-tight leading-[1.15] text-[#17191C] mb-2">Eight solution groups, sixty-three line items</h2>
            <p className="text-[14px] text-[#566472]">Dosing chemistry, plant and vessel manufacturing, filtration media and testing instruments — supplied as single items or as a complete package.</p>
          </Reveal>

          {/* desktop: bands that open on hover */}
          <div className="hidden md:block space-y-2">
            {chemicalGroups.map((g, k) => (
              <Reveal key={g.num} delay={(k % 4) * 60}>
                <SolutionLink title={g.title} items={g.items} img={g.img} className="w-full text-left group relative block h-[84px] hover:h-[210px] focus-visible:h-[210px] transition-[height] duration-700 ease-out rounded-2xl overflow-hidden">
                  <Image src={g.img} alt={g.title} fill sizes="1200px" className="object-cover object-center" />
                  <div className={`absolute inset-0 bg-gradient-to-r ${k % 2 ? "from-[#5a3a00]/95 via-[#17191C]/80" : "from-[#5a0606]/95 via-[#17191C]/80"} to-[#17191C]/30`} />
                  <div className="absolute inset-0 px-7 flex items-center gap-6 text-white">
                    <span className="font-black text-4xl text-transparent [-webkit-text-stroke:1.5px_#E0A21A] w-16">{g.num}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-white">{g.title}</h3>
                      <p className="text-[13px] text-white/80 max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 group-focus-visible:max-h-24 group-focus-visible:opacity-100 group-hover:mt-2 overflow-hidden transition-all duration-500">{g.items.join(" · ")}</p>
                    </div>
                    <span className="text-sm font-bold text-white/90 hidden lg:block">{chemCounts[k]} items</span>
                    <span className="w-10 h-10 rounded-full bg-white/15 border border-white/30 flex items-center justify-center group-hover:bg-[#C80808] group-hover:border-[#C80808] transition-colors"><ArrowRight className="w-5 h-5" /></span>
                  </div>
                </SolutionLink>
              </Reveal>
            ))}
          </div>

          {/* phones / tablets: compact bands with the products visible */}
          <div className="md:hidden space-y-2.5">
            {chemicalGroups.map((g, k) => (
              <SolutionLink key={g.num} title={g.title} items={g.items} img={g.img} className="w-full text-left relative block rounded-xl overflow-hidden min-h-[96px]">
                <Image src={g.img} alt={g.title} fill sizes="600px" className="object-cover" />
                <span className={`absolute inset-0 bg-gradient-to-r ${k % 2 ? "from-[#5a3a00]/95" : "from-[#5a0606]/95"} via-[#17191C]/85 to-[#17191C]/60`} />
                <span className="relative block p-3.5 text-white"><span className="text-[11px] font-black text-[#F2B93B]">{g.num} · {chemCounts[k]} items</span><span className="block text-[15px] font-extrabold text-white leading-tight">{g.title}</span><span className="block text-[11.5px] text-white/80 mt-1 line-clamp-2">{g.items.join(" · ")}</span></span>
              </SolutionLink>
            ))}
          </div>

          <div className="text-center mt-7"><Link href="/chemicals" className="inline-flex items-center gap-2 rounded-lg bg-[#C80808] hover:bg-[#A81010] text-white text-sm font-bold px-5 py-2.5 transition-colors">View the full chemical portfolio <ArrowRight className="w-4 h-4" /></Link></div>
        </div>
      </section>

      {/* ===== DELIVERY ===== */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal variant="left" className="lg:col-span-6">
            <span className="inline-flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#C80808] mb-3"><span className="h-[3px] w-9 bg-[#C80808] rounded" />Supply across India &amp; export</span>
            <h2 className="text-[1.7rem] sm:text-4xl font-black tracking-tight leading-[1.1] text-[#17191C] mb-5">Based in Mumbai, delivering to plants worldwide</h2>
            <p className="text-[15px] sm:text-lg leading-relaxed mb-5">Petro Engineering supplies water treatment chemistry and process instrumentation from a base in Mumbai — to plants across India, and on export. Two divisions, one accountable point of contact.</p>
            <p className="text-[15px] leading-relaxed mb-7">We support refineries, petrochemical plants, EPC contractors and system integrators with certified equipment, dosing chemistry, treatment plants and precision fittings from manufacturers we have already qualified.</p>
            <Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-lg bg-[#C80808] hover:bg-[#A81010] text-white font-bold px-7 py-4 transition-colors">Start your enquiry <ArrowRight className="w-4 h-4" /></Link>
          </Reveal>
          <Reveal variant="right" className="lg:col-span-6">
            <div className="grid gap-4">
              {[
                { t: "Global supplier network", d: "Direct access to approved manufacturers and OEMs across Europe, North America, Japan and Asia-Pacific.", icon: Globe },
                { t: "Documented, export-grade delivery", d: "Sea-worthy ISPM-15 export packing and comprehensive dossiers ready for client handover.", icon: Truck },
                { t: "Compliance you can trace", d: "EN 10204 3.1 / 3.2 certification, NACE MR0175, ASME, ASTM and API standards.", icon: ShieldCheck },
              ].map((f, k) => (
                <div key={f.t} className="group flex gap-4 rounded-2xl border border-[#E7E9EE] bg-white p-5 shadow-sm hover:shadow-xl hover:border-[#D4950F] hover:translate-x-2 transition-all duration-500">
                  <span className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-white ${["bg-[#C80808]", "bg-[#D4950F]", "bg-[#C80808]"][k]}`}><f.icon className="w-6 h-6" /></span>
                  <div><h3 className="text-base font-extrabold text-[#17191C] mb-1">{f.t}</h3><p className="text-[14px] leading-relaxed">{f.d}</p></div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== INSTRUMENTATION ===== */}
      <section id="instrumentation" className="py-16 sm:py-24 bg-[#FFF8F0]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <Head eyebrow="Instrumentation & valves" title="Precision fittings, valves and analytical systems" text='Instrumentation-grade components in SS316, carbon steel, brass and specialist alloys — sized 1/8" to 1" and rated to 10,000 psi.' link={{ href: "/instrumentation", label: "View full range" }} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {instrumentationProducts.map((p, k) => (
              <Reveal key={p.slug} delay={(k % 3) * 90}>
                <Link href={`/instrumentation#${p.slug}`} className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-[#E7E9EE] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#EBECEE]">
                    <Image src={p.img} alt={p.title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-[1100ms]" />
                    <span className="absolute top-4 right-4 rounded-full bg-[#17191C] text-white px-3.5 py-1 text-xs font-extrabold">{p.tag}</span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-extrabold text-[#17191C] mb-2">{p.title}</h3>
                    <p className="text-[14px] leading-relaxed mb-5 flex-1">{p.desc}</p>
                    <span className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#C80808] group-hover:text-[#C80808] transition-colors">Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY (numbered) ===== */}
      <section id="why" className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <Head eyebrow="Why choose Petro Engineering" title="Why leading industrial companies partner with us" text="We eliminate single-source vulnerability, reduce commercial overhead, and maintain zero-defect documentation dossiers." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyPartner.map((w, k) => (
              <Reveal key={w.title} delay={(k % 3) * 90}>
                <div className="group relative h-full rounded-2xl border border-[#E7E9EE] bg-white p-7 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <span className="absolute -top-2 right-4 font-['Plus_Jakarta_Sans'] text-7xl font-black text-[#C80808]/[0.07] group-hover:text-[#E0A21A]/25 transition-colors">0{k + 1}</span>
                  <div className="relative w-14 h-14 rounded-2xl bg-[#FDECEC] text-[#C80808] group-hover:bg-[#C80808] group-hover:text-white flex items-center justify-center mb-5 transition-colors"><w.icon className="w-7 h-7" /></div>
                  <h3 className="relative text-lg font-extrabold text-[#17191C] mb-2">{w.title}</h3>
                  <p className="relative text-[14px] leading-relaxed">{w.desc}</p>
                  <span className="absolute left-0 bottom-0 h-1 w-0 bg-[#C80808] group-hover:w-full transition-all duration-500" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== IMAGE BANNER ===== */}
      <section className="relative h-[300px] sm:h-[380px] overflow-hidden bg-[#17191C]/90">
        <Image src="/assets/img/cta-source.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/95 via-[#17191C]/70 to-[#C80808]/50" />
        <div className="relative h-full max-w-[1320px] mx-auto px-5 sm:px-8 flex items-center">
          <Reveal className="max-w-[700px]">
            <h2 className="text-white text-[1.6rem] sm:text-4xl font-black tracking-tight leading-[1.15] mb-4">Right equipment. Fully compliant. <span className="text-[#E0A21A]">Delivered on time.</span></h2>
            <Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-lg bg-[#C80808] hover:bg-[#A81010] text-white font-bold px-7 py-3.5 transition-colors">Request a Quotation <ArrowRight className="w-4 h-4" /></Link>
          </Reveal>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section id="process" className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <Head eyebrow="How we work" title="Four steps from enquiry to delivery" text="A predictable process, so you always know where your order stands." />
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <span aria-hidden="true" className="hidden lg:block absolute top-[34px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#C80808] via-[#D4950F] to-[#C80808] opacity-50" />
            {[
              { t: "Enquiry & review", d: "You send the line list, datasheet or RFQ. We review the specification and flag anything that needs clarifying before we quote.", icon: Search },
              { t: "Sourcing & proposal", d: "We approach approved manufacturers, compare technically and commercially, and return a costed proposal with lead times.", icon: FileCheck },
              { t: "Inspection & documentation", d: "Orders are expedited, inspected where required, and MTCs and test certificates are verified before release.", icon: ShieldCheck },
              { t: "Packing & delivery", d: "Goods are export-packed, documented and shipped, with tracking and delivery confirmation through to site.", icon: Truck },
            ].map((st, k) => (
              <Reveal key={st.t} delay={k * 110}>
                <div className="group relative text-center sm:text-left h-full">
                  <span className="relative z-10 mx-auto sm:mx-0 mb-5 w-[68px] h-[68px] rounded-full bg-white border-[3px] border-[#C80808] text-[#C80808] group-hover:bg-[#C80808] group-hover:text-white flex items-center justify-center shadow-lg transition-colors"><st.icon className="w-7 h-7" /></span>
                  <span className="text-xs font-extrabold tracking-[0.2em] text-[#C80808]">STEP 0{k + 1}</span>
                  <h3 className="text-lg font-extrabold text-[#17191C] mt-1 mb-2">{st.t}</h3>
                  <p className="text-[14px] leading-relaxed">{st.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW WE SUPPLY ===== */}
      <section id="engage" className="py-12 sm:py-14 bg-[#17191C]/90 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-[#D4950F]/25 blur-[110px]" />
        <div className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full bg-[#C80808]/20 blur-[110px]" />
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="max-w-[640px] mx-auto text-center mb-8">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B] mb-2"><span className="h-[3px] w-9 bg-[#F2B93B] rounded" />How we supply</span>
            <h2 className="text-[1.4rem] sm:text-[1.9rem] font-black leading-[1.15] text-white mb-1.5">Order the way that suits your project</h2>
            <p className="text-white/70 text-[14px]">From a single item to a multi-vendor package — one accountable contact throughout.</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {engage.map((e, k) => (
              <Reveal key={e.t} delay={k * 100}>
                <div tabIndex={0} className="group h-[290px] [perspective:1000px] outline-none">
                  <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus:[transform:rotateY(180deg)]">
                    <div className="absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden]">
                      <Image src={["/assets/img/pipe-fittings.jpg","/assets/img/chem-05-water-treatment-plants.jpg","/assets/img/service-inspection-qa.jpg"][k]} alt="" fill sizes="450px" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#17191C]/95 via-[#17191C]/55 to-[#17191C]/20" />
                      <span className="absolute top-4 right-4 font-black text-3xl text-transparent [-webkit-text-stroke:1.5px_#F2B93B]">0{k + 1}</span>
                      <div className="absolute bottom-0 p-5 text-white">
                        <e.icon className="w-7 h-7 text-[#F2B93B] mb-2" />
                        <h3 className="text-xl font-black text-white">{e.t}</h3>
                        <span className="text-[11px] font-bold tracking-widest text-[#F2B93B]">HOVER / TAP FOR DETAILS</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C80808] to-[#E0241A] text-white p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-center">
                      <h3 className="text-lg font-black text-white mb-1">{e.t}</h3>
                      <p className="text-[13px] text-white/85 mb-3">{e.d}</p>
                      <ul className="space-y-1.5 text-[13px] text-white">
                        {e.pts.map((pt) => (<li key={pt} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#F2B93B]" />{pt}</li>))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="relative py-10 sm:py-12 bg-gradient-to-b from-white via-[#FFF8F0] to-white overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#C80808]/[0.07] blur-[90px]" />
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#E0A21A]/[0.14] blur-[90px]" />
        <div className="absolute inset-0 [background-image:radial-gradient(rgba(23,25,28,.09)_1.2px,transparent_1.2px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
        <div className="relative max-w-[1320px] mx-auto px-5 sm:px-8">
          <div className="text-center max-w-[680px] mx-auto mb-6">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C80808] mb-2"><span className="h-[3px] w-9 rounded bg-[#C80808]" />Procurement &amp; sourcing services</span>
            <h2 className="text-[1.35rem] sm:text-[1.75rem] font-black leading-[1.15] text-[#17191C] mb-2">End-to-end support, from enquiry to site delivery</h2>
            <p className="text-[14px]">From single-item replacement orders to complete tender package consolidation — we manage compliance, expediting and third-party inspection.</p>
          </div>
          <ServiceRoute services={services.map((s, k) => ({ ...s, img: ["/assets/img/pipe-fittings.jpg","/assets/img/gas-analytics.jpg","/assets/img/service-inspection-qa.jpg","/assets/img/tube-fittings.jpg","/assets/img/tubing-coils.jpg","/assets/img/service-technical-consultation.jpg"][k] }))} />
          <div className="text-center mt-5"><Link href="/services" className="inline-flex items-center gap-2 rounded-lg bg-[#C80808] hover:bg-[#A81010] text-white text-sm font-bold px-5 py-2.5 transition-colors">View all services <ArrowRight className="w-4 h-4" /></Link></div>
        </div>
      </section>

      {/* ===== GET IN TOUCH ===== */}
      <section id="contact" className="py-9 bg-gradient-to-r from-[#17191C]/90 via-[#2a0c0c]/90 to-[#17191C]/90">
        <Reveal className="max-w-[1240px] mx-auto px-5 sm:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-[560px]">
            <h2 className="text-white text-[1.4rem] sm:text-3xl font-black leading-[1.15] mb-1">We're here to source. Call us today.</h2>
            <p className="text-white/70 text-[13.5px]">Speak directly with our technical sales desk for quotation assistance, material test reports, or dosage projections.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Phone, t: "Call", v: COMPANY_INFO.contact.phone, href: `tel:${COMPANY_INFO.contact.phoneRaw}`, c: "bg-[#C80808] hover:bg-[#A80808]" },
              { icon: Mail, t: "Email", v: COMPANY_INFO.contact.email, href: `mailto:${COMPANY_INFO.contact.email}`, c: "bg-[#D4950F] hover:bg-[#B07A0A]" },
              { icon: FileCheck, t: "RFQ", v: "Request a quote", href: "/request-a-quote", c: "bg-white/15 border border-white/30 hover:bg-white/25" },
            ].map((c) => (
              <a key={c.t} href={c.href} className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-white hover:-translate-y-1 hover:shadow-xl transition-all ${c.c}`}>
                <c.icon className="w-5 h-5" />
                <span><span className="block text-[10px] font-bold uppercase opacity-80">{c.t}</span><span className="block text-[13px] font-extrabold">{c.v}</span></span>
              </a>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
