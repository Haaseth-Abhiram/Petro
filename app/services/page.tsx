import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  Search,
  ClipboardList,
  ShieldCheck,
  Users,
  Truck,
  Lightbulb,
  FileCheck,
  Phone,
  Star,
  Home as HomeIcon,
  ChevronRight,
} from "lucide-react";
import Reveal from "@/components/common/Reveal";
import PageHero from "@/components/common/PageHero";
import CountUp from "@/components/common/CountUp";

export default function ServicesPage() {
  const services = [
    {
      id: "oil-gas-sourcing",
      num: "01",
      title: "Oil & Gas Equipment Sourcing",
      img: "/assets/img/pipe-fittings.jpg",
      reverse: false,
      desc: "Direct-from-manufacturer sourcing for instrumentation, valves, fittings and line pipe for upstream, midstream and downstream oil and gas assets.",
      capabilities: [
        "API 6D ball valves and check valves in forged and cast steel",
        "SS316, Inconel and Monel instrumentation fittings up to 10,000 psi",
        "Complete MTO evaluation from P&IDs and piping line lists",
        "Sourcing from pre-approved vendor lists (AVL) of major operators",
      ],
      compliance: ["EN 10204 3.1 / 3.2", "NACE MR0175 / ISO 15156", "API 6D / API 598", "ASME B16.34"],
    },
    {
      id: "project-procurement",
      num: "02",
      title: "Project Procurement Support",
      img: "/assets/img/gas-analytics.jpg",
      reverse: true,
      desc: "Full procurement lifecycle support for EPC contractors and project developers — from enquiry stage through vendor evaluation, expediting and delivery.",
      capabilities: [
        "Bill of materials (BOM) consolidation across multiple manufacturers",
        "Commercial and technical bid tabulation (TBE/CBE)",
        "Single commercial point of contact for complex, multi-item packages",
        "Vendor pre-qualification and shop audits against project specifications",
      ],
      compliance: ["ISO 9001:2015", "Project-specific VDRLs", "Incoterms 2020", "Piping line classes"],
    },
    {
      id: "inspection-qa",
      num: "03",
      title: "Inspection & Quality Assurance",
      img: "/assets/img/service-inspection-qa.jpg",
      reverse: false,
      desc: "Third-party inspection coordination and quality management at every stage of manufacture to ensure compliance before equipment ships.",
      capabilities: [
        "Third-party inspection agency coordination (TUV, BV, DNV, Lloyds)",
        "Material test report (MTR) verification and heat-number cross-referencing",
        "Positive Material Identification (PMI) and hydrostatic pressure test witnessing",
        "Inspection and Test Plan (ITP) formulation and sign-off",
      ],
      compliance: ["EN 10204 Type 3.1 / 3.2", "ASME Section IX (welding)", "ASNT Level II / III NDT", "NACE TM0177 / TM0284"],
    },
    {
      id: "vendor-rep",
      num: "04",
      title: "Vendor & Manufacturer Representation",
      img: "/assets/img/tube-fittings.jpg",
      reverse: true,
      desc: "Authorised sales representation and technical distributor support for international manufacturers seeking access to Indian and regional industrial markets.",
      capabilities: [
        "Technical product presentations to engineering heads and plant directors",
        "Vendor registration and AVL enlistment support with major operators and EPCs",
        "Pre-bid technical clarifications, tender documentation and spec review",
        "First-line commercial negotiation and contract administration",
      ],
      compliance: ["Operator AVL enlistment", "Commercial compliance", "Anti-bribery (FCPA / UKBA)", "Export control rules"],
    },
    {
      id: "logistics-export",
      num: "05",
      title: "Logistics & Export Handling",
      img: "/assets/img/tubing-coils.jpg",
      reverse: false,
      desc: "Comprehensive export packing, freight management, Dangerous Goods handling and customs compliance for global delivery.",
      capabilities: [
        "ISPM-15 certified seaworthy timber crating and vacuum preservation",
        "Air, sea (FCL/LCL) and multi-modal freight booking with real-time tracking",
        "Dangerous Goods (DG) documentation for chemical consignments (IMDG / IATA)",
        "Export documentation: COO, Certificate of Conformity, commercial invoices, packing lists",
      ],
      compliance: ["ISPM-15 export packing", "IMDG Code (sea DG)", "IATA DGR (air DG)", "Incoterms 2020 (FOB, CFR, CIF, DDP)"],
    },
    {
      id: "engineering-consultation",
      num: "06",
      title: "Technical Consultation & Engineering Support",
      img: "/assets/img/service-technical-consultation.jpg",
      reverse: true,
      desc: "Application engineering support for valve sizing, metallurgy selection, chemical dosage calculations and sampling system design.",
      capabilities: [
        "Control and shutoff valve sizing (Cv calculations, cavitation checks)",
        "Metallurgy and trim selection for sour service, seawater and corrosive media",
        "Water treatment chemical dosage modeling and RO recovery projections",
        "Sample conditioning system lag-time and pressure-drop calculations",
      ],
      compliance: ["ISA 75.01 valve sizing", "NACE MR0175 metallurgy", "ASTM standards", "ASME Section VIII Div 1"],
    },
  ];

  const steps = [
    { num: "01", title: "Enquiry review", desc: "We review your datasheets, P&IDs, line lists and AVL constraints." },
    { num: "02", title: "Technical proposal", desc: "Commercial and technical bid submitted with compliance matrices and datasheets." },
    { num: "03", title: "Production & QA", desc: "Order placement, expediting, witness testing and EN 10204 3.1 dossier prep." },
    { num: "04", title: "Export & delivery", desc: "ISPM-15 crating, dangerous-goods paperwork and door-to-site delivery." },
  ];

  const icons = [Search, ClipboardList, ShieldCheck, Users, Truck, Lightbulb];
  const stepIcons = [Search, FileCheck, ShieldCheck, Truck];

  return (
    <div className="w-full">
      <PageHero
        crumb="Services"
        eyebrow="Engineering & procurement"
        title="End-to-end support,"
        accent="from enquiry to site delivery"
        text="Six dedicated services for engineering contractors, plant operators and procurement heads — backed by material traceability, factory expediting and technical review."
        bg="/assets/img/service-inspection-qa.jpg"
        actions={
          <>
            <Link href="/request-a-quote" className="btn btn-primary">
              Submit Project RFQ <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Speak with Technical Team
            </Link>
          </>
        }
        marquee={[
          "Oil & Gas Sourcing",
          "Project Procurement",
          "Inspection & QA",
          "Vendor Representation",
          "Export Logistics",
          "Technical Consultation",
        ]}
        visual={
          <div className="hidden lg:grid grid-cols-3 gap-3">
            {services.map((s, k) => {
              const Icon = icons[k];
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="group rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-4 hover:bg-[#FF4B32] hover:border-[#FFA028] hover:-translate-y-1.5 transition-all duration-300"
                >
                  <span className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-[#FF4B32] text-white group-hover:bg-white group-hover:text-[#FF4B32] flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="font-black text-2xl text-transparent [-webkit-text-stroke:1px_#FFA028]">
                      {s.num}
                    </span>
                  </span>
                  <span className="block text-[12.5px] font-extrabold text-white leading-snug">
                    {s.title}
                  </span>
                </a>
              );
            })}
          </div>
        }
      />

      {/* JUMP NAV */}
      <nav
        className="sticky top-[68px] z-30 bg-white border-b border-[#929DA7]/20 shadow-sm overflow-x-auto"
        aria-label="Services list"
      >
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-2.5 flex items-center gap-2 whitespace-nowrap text-[12.5px] font-bold">
          {services.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full px-3 py-1 bg-[#F5F6F7] hover:bg-[#FF4B32] hover:text-white text-[#17191C] border border-[#929DA7]/20 transition-colors"
            >
              <span className="text-[#FF4B32] group-hover:text-white font-extrabold mr-1">0{i + 1}</span>
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      {/* SERVICES ARTICLES */}
      <section className="py-12 sm:py-16 bg-[#F5F6F7]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 space-y-8">
          {services.map((s, k) => (
            <article
              key={s.id}
              id={s.id}
              className={`scroll-mt-28 grid ${
                k % 2 ? "lg:grid-cols-[1.1fr_0.9fr]" : "lg:grid-cols-[0.9fr_1.1fr]"
              } rounded-3xl overflow-hidden bg-white border border-[#929DA7]/20 shadow-xl`}
            >
              <div
                className={`relative min-h-[260px] lg:min-h-[380px] overflow-hidden group ${
                  k % 2 ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={s.img}
                  alt={s.title}
                  fill
                  sizes="(min-width:1024px) 560px, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <span className="absolute left-4 bottom-3 font-black text-6xl sm:text-7xl leading-none text-transparent [-webkit-text-stroke:2px_#fff] drop-shadow-lg">
                  {s.num}
                </span>
                <span className="absolute left-4 top-4 rounded-full bg-[#FF4B32] text-white text-[11px] font-extrabold tracking-wider px-3 py-1 shadow-md">
                  SERVICE {s.num}
                </span>
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <h3 className="text-[1.4rem] sm:text-[1.7rem] font-black text-[#17191C] leading-tight mb-2">
                  {s.title}
                </h3>
                <p className="text-[14px] text-[#929DA7] leading-relaxed mb-4">{s.desc}</p>
                <div className="mb-4">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF4B32] mb-2">
                    Scope &amp; Capabilities
                  </h4>
                  <ul className="space-y-1.5 text-[13px] text-[#17191C]/85">
                    {s.capabilities.map((c) => (
                      <li key={c} className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-[#FFA028] shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 border-t border-[#929DA7]/15 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {s.compliance.map((cm) => (
                      <span
                        key={cm}
                        className="rounded-full bg-[#F5F6F7] border border-[#929DA7]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#17191C]"
                      >
                        {cm}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/request-a-quote?service=${encodeURIComponent(s.title)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4B32] hover:text-[#FFA028] transition-colors"
                  >
                    Enquire on this service <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* HOW WE WORK (4 STEPS) */}
      <section className="relative py-14 sm:py-16 bg-[#17191C] overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#FF4B32]/15 blur-[110px]" />
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#FFA028]/15 blur-[110px]" />
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[640px] mx-auto mb-10">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FFA028] mb-2">
              <span className="h-[3px] w-9 rounded bg-[#FFA028]" />
              How we work
            </span>
            <h2 className="text-[1.4rem] sm:text-[1.8rem] font-black leading-[1.15] text-white mb-1.5">
              Four steps from enquiry to delivery
            </h2>
            <p className="text-[14px] text-white/70">
              A predictable process, so you always know where your order stands.
            </p>
          </Reveal>
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-11">
            <span
              aria-hidden="true"
              className="hidden lg:block absolute top-0 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#FF4B32] via-[#FFA028] to-[#FF4B32] opacity-60"
            />
            {steps.map((st, k) => {
              const Icon = stepIcons[k];
              return (
                <Reveal key={st.num} delay={k * 110}>
                  <div className="group relative h-full rounded-2xl bg-white/[0.06] border border-white/10 hover:bg-white/10 hover:border-[#FFA028] p-5 pt-9 text-center transition-all duration-300">
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[62px] h-[62px] rounded-full bg-[#FF4B32] group-hover:bg-[#FFA028] text-white flex items-center justify-center ring-4 ring-[#17191C] shadow-xl transition-colors">
                      <Icon className="w-6 h-6" />
                    </span>
                    <span className="text-[11px] font-extrabold tracking-[0.2em] text-[#FFA028]">
                      STEP {st.num}
                    </span>
                    <h3 className="text-[15px] font-extrabold text-white mt-1 mb-1.5">{st.title}</h3>
                    <p className="text-[12.5px] leading-relaxed text-white/70">{st.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 bg-gradient-to-r from-[#17191C] via-[#23272B] to-[#17191C]">
        <Reveal className="max-w-[1240px] mx-auto px-5 sm:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-[620px]">
            <h2 className="text-white text-[1.35rem] sm:text-[1.8rem] font-black leading-[1.15] mb-1">
              Let&apos;s talk about your project
            </h2>
            <p className="text-white/85 text-[13.5px]">
              Contact our sourcing engineers for MTO evaluations, vendor alignments, or technical queries.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/request-a-quote"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF4B32] hover:bg-[#FFA028] text-white font-extrabold text-[13px] px-5 py-3 hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <FileCheck className="w-5 h-5" />
              Submit Project RFQ
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-[13px] px-5 py-3 hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <Phone className="w-5 h-5 text-[#FFA028]" />
              Speak with Technical Team
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
