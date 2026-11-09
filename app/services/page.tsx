import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight, Search, ClipboardList, ShieldCheck, Users, Truck, Lightbulb, FileCheck, Phone, Star, Home as HomeIcon, ChevronRight } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import PageHero from "@/components/common/PageHero";
import CountUp from "@/components/common/CountUp";

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
        visual={
          <div className="hidden lg:grid grid-cols-3 gap-3">
            {services.map((s, k) => {
              const Icon = icons[k];
              return (
                <a key={s.id} href={`#${s.id}`} className="group rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-4 hover:bg-[#C80808] hover:border-[#E0A21A] hover:-translate-y-1.5 transition-all duration-300">
                  <span className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-[#C80808] text-white group-hover:bg-white group-hover:text-[#C80808] flex items-center justify-center transition-colors"><Icon className="w-5 h-5" /></span>
                    <span className="font-black text-2xl text-transparent [-webkit-text-stroke:1px_#F2B93B]">{s.num}</span>
                  </span>
                  <span className="block text-[12.5px] font-extrabold text-white leading-snug">{s.title}</span>
                </a>
              );
            })}
          </div>
        }
        marquee={services.map((s) => s.title)}
        actions={
          <>
            <Link href="/request-a-quote" className="btn btn-primary">Submit Project RFQ <ArrowRight className="w-4 h-4 ml-2" /></Link>
            <a href="#all-services" className="btn btn-outline">Explore the six services</a>
          </>
        }
      />

      {/* SERVICE CARDS */}
      <section id="all-services" className="relative py-10 sm:py-12 bg-gradient-to-b from-white via-[#FFF8F0] to-white scroll-mt-28 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[360px] h-[360px] rounded-full bg-[#C80808]/[0.06] blur-[90px]" />
        <div className="absolute -bottom-20 -right-20 w-[360px] h-[360px] rounded-full bg-[#E0A21A]/[0.14] blur-[90px]" />
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[640px] mx-auto mb-7">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C80808] mb-2"><span className="h-[3px] w-9 rounded bg-[#C80808]" />Our services</span>
            <h2 className="text-[1.4rem] sm:text-[1.8rem] font-black leading-[1.15] text-[#17191C]">Six ways we keep your project moving</h2>
          </Reveal>
          <div className="grid lg:grid-cols-2 gap-5">
            {services.map((s, k) => {
              const Icon = icons[k];
              return (
                <Reveal key={s.id} delay={(k % 2) * 100}>
                  <article id={s.id} className="group scroll-mt-28 h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-[#E7E9EE] shadow-lg hover:shadow-2xl hover:border-[#C80808] hover:-translate-y-1.5 transition-all duration-500">
                    <div className="relative h-[140px] overflow-hidden text-white">
                      <Image src={s.img} alt={s.title} fill sizes="(min-width:1024px) 600px, 100vw" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#17191C]/95 via-[#17191C]/70 to-transparent" />
                      <span className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-[#C80808] flex items-center justify-center shadow-lg"><Icon className="w-5 h-5" /></span>
                      <span className="absolute top-2 right-3 font-black text-4xl text-transparent [-webkit-text-stroke:1.5px_#F2B93B]">{s.num}</span>
                      <h3 className="absolute bottom-0 p-4 text-[16px] sm:text-[17px] font-black text-white leading-tight">{s.title}</h3>
                    </div>
                    <div className="flex flex-col flex-1 p-4">
                      <p className="text-[13px] leading-relaxed mb-3">{s.desc}</p>
                      <div className="grid sm:grid-cols-2 gap-3 flex-1">
                        <div className="rounded-xl bg-[#FFF8F0] border border-[#F0E3D2] p-3">
                          <h4 className="text-[10.5px] font-extrabold uppercase tracking-[0.15em] text-[#C80808] mb-1.5">What we do</h4>
                          <ul className="space-y-1.5 text-[12px] leading-snug text-[#17191C]">{s.activities.map((a) => (<li key={a} className="flex gap-1.5"><Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#C80808]" />{a}</li>))}</ul>
                        </div>
                        <div className="rounded-xl bg-white border border-[#F0E3D2] p-3">
                          <h4 className="text-[10.5px] font-extrabold uppercase tracking-[0.15em] text-[#B07A0A] mb-1.5">What you gain</h4>
                          <ul className="space-y-1.5 text-[12px] leading-snug text-[#17191C]">{s.benefits.map((b) => (<li key={b} className="flex gap-1.5"><Star className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#D4950F]" />{b}</li>))}</ul>
                        </div>
                      </div>
                      <Link href={`/request-a-quote?service=${encodeURIComponent(s.title)}`} className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-extrabold text-[#C80808] group-hover:gap-3 transition-all">Enquire about this service <ArrowRight className="w-4 h-4" /></Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="relative py-12 bg-[#17191C]/90 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#C80808]/25 blur-[110px]" />
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#E0A21A]/20 blur-[110px]" />
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[640px] mx-auto mb-10">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B] mb-2"><span className="h-[3px] w-9 rounded bg-[#F2B93B]" />How we work</span>
            <h2 className="text-[1.4rem] sm:text-[1.8rem] font-black leading-[1.15] text-white mb-1.5">Four steps from enquiry to delivery</h2>
            <p className="text-[14px] text-white/70">A predictable process, so you always know where your order stands.</p>
          </Reveal>
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-11">
            <span aria-hidden="true" className="hidden lg:block absolute top-0 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#C80808] opacity-70" />
            {steps.map((st, k) => {
              const Icon = stepIcons[k];
              return (
                <Reveal key={st.num} delay={k * 110}>
                  <div className="group relative h-full rounded-2xl bg-white/[0.06] border border-white/10 hover:bg-white/10 hover:border-[#E0A21A] p-5 pt-9 text-center transition-all duration-300">
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[62px] h-[62px] rounded-full bg-[#C80808] group-hover:bg-[#E0A21A] text-white flex items-center justify-center ring-4 ring-[#17191C] shadow-xl transition-colors"><Icon className="w-6 h-6" /></span>
                    <span className="text-[11px] font-extrabold tracking-[0.2em] text-[#F2B93B]">STEP {st.num}</span>
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
      <section className="py-8 bg-gradient-to-r from-[#A81010]/70 via-[#C80808]/70 to-[#A81010]/70">
        <Reveal className="max-w-[1240px] mx-auto px-5 sm:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-[620px]">
            <h2 className="text-white text-[1.35rem] sm:text-[1.8rem] font-black leading-[1.15] mb-1">Let&apos;s talk about your project</h2>
            <p className="text-white/85 text-[13.5px]">Contact our sourcing engineers for MTO evaluations, vendor alignments, or technical queries.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-xl bg-white text-[#C80808] font-extrabold text-[13px] px-5 py-3 hover:-translate-y-1 hover:shadow-xl transition-all"><FileCheck className="w-5 h-5" />Submit Project RFQ</Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-[#17191C] text-white font-extrabold text-[13px] px-5 py-3 hover:-translate-y-1 hover:shadow-xl transition-all"><Phone className="w-5 h-5 text-[#F2B93B]" />Speak with Technical Team</Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
