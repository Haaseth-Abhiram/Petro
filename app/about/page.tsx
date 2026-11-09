import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Globe,
  Clock,
  Target,
  Eye,
  ArrowRight,
  Phone,
  Handshake,
  Lightbulb,
  Headphones,
  FlaskConical,
  Cog,
  Home as HomeIcon,
  ChevronRight,
} from "lucide-react";
import Reveal from "@/components/common/Reveal";
import PageHero from "@/components/common/PageHero";
import { COMPANY_INFO } from "@/data/company";

export default function AboutPage() {
  const principles = [
    { title: "Integrity", desc: "Never compromise on pressure boundary ratings, material wall thickness, or alloy chemistry." },
    { title: "Quality", desc: "Every consignment backed by authentic EN 10204 Type 3.1 or 3.2 Material Test Reports." },
    { title: "Expertise", desc: "Technical review of tender datasheets, NACE MR0175 compliance, and chemical dosage projections." },
    { title: "Reliability", desc: "Committed delivery milestones with proactive expediting and transparent shipment tracking." },
    { title: "Partnership", desc: "Direct OEM supply alliances with ISO and ASME certified manufacturers worldwide." },
    { title: "Innovation", desc: "Specialty high-recovery reverse osmosis chemistry and advanced process analyzer systems." },
    { title: "Customer focus", desc: "Fast turnaround for technical bid tabulations (TBE) and technical queries (TQs)." },
    { title: "Accountability", desc: "Single-point commercial and technical responsibility from purchase order to site gate." },
  ];

  const pIcons = [ShieldCheck, Award, Target, Clock, Handshake, Lightbulb, Headphones, Eye];

  return (
    <div className="w-full">
      <PageHero
        crumb="About"
        eyebrow="About Petro Engineering"
        title="An industrial engineering company"
        accent="delivering reliable solutions"
        text={`${COMPANY_INFO.legalName} is a specialized sourcing and supply partner catering to oil & gas, petrochemical, process utilities, and industrial water treatment.`}
        bg="/assets/img/chem-05-water-treatment-plants.jpg"
        layout="centered"
        strip={
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-[900px] mx-auto">
            {[{ v: "100%", l: "Traceability & MTRs" }, { v: "< 24h", l: "Technical response" }, { v: "2", l: "Divisions, one contact" }, { v: "8", l: "Guiding principles" }].map((x) => (
              <div key={x.l} className="rounded-2xl bg-white/10 backdrop-blur border border-white/25 px-4 py-3 text-center">
                <div className="text-2xl sm:text-3xl font-black text-[#F2B93B] leading-none">{x.v}</div>
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-white/80 mt-1.5">{x.l}</div>
              </div>
            ))}
          </div>
        }
        marquee={["Integrity", "Quality", "Expertise", "Reliability", "Partnership", "Innovation", "Customer focus", "Accountability"]}
        actions={
          <>
            <Link href="/request-a-quote" className="btn btn-primary">Request a Quotation <ArrowRight className="w-4 h-4 ml-2" /></Link>
            <Link href="/contact" className="btn btn-outline">Contact us</Link>
          </>
        }
      />

      {/* MANDATE + STATS */}
      <section className="py-10 sm:py-12 bg-white overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 grid lg:grid-cols-[1.1fr_1fr] gap-8 items-center">
          <Reveal variant="left">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C80808] mb-2"><span className="h-[3px] w-9 rounded bg-[#C80808]" />Our mandate</span>
            <h2 className="text-[1.4rem] sm:text-[1.8rem] font-black leading-[1.15] text-[#17191C] mb-3">A specialised sourcing and supply partner</h2>
            <div className="space-y-2.5 text-[14px] leading-relaxed">
              <p>Industrial facilities cannot afford unscheduled shutdowns caused by leaking tube fittings, mismatched alloy metallurgy, or fouled reverse osmosis membranes. Our team operates at the nexus of technical understanding and international supply networks.</p>
              <p>Whether supplying severe service 6,000 PSI manifold valves for an offshore production skid or formulating targeted anti-scalants for an effluent recycling plant running at 85% recovery, our mandate is unwavering: deliver precisely what the specification demands.</p>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {["ISO 9001:2015 compliant", "EN 10204 3.1 / 3.2", "NACE MR0175", "API / ASME"].map((x) => (<li key={x} className="rounded-full bg-[#FFF8F0] border border-[#F0E3D2] px-3 py-1 text-[12px] font-bold text-[#17191C]">{x}</li>))}
            </ul>
          </Reveal>
          <Reveal variant="right" className="grid grid-cols-2 gap-3">
            {[{ v: "100%", l: "Traceability & MTRs", c: "from-[#C80808] to-[#E0241A]" }, { v: "< 24h", l: "Technical response", c: "from-[#D4950F] to-[#B07A0A]" }, { v: "2", l: "Divisions, one contact", c: "from-[#D4950F] to-[#B07A0A]" }, { v: "8", l: "Guiding principles", c: "from-[#C80808] to-[#E0241A]" }].map((s, k) => (
              <div key={s.l} className={`rounded-2xl bg-gradient-to-br ${s.c} text-white p-5 shadow-xl hover:-translate-y-1.5 transition-transform duration-300 ${k % 2 ? "sm:translate-y-4" : ""}`}>
                <div className="text-4xl font-black leading-none">{s.v}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/85 mt-2">{s.l}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* DIVISIONS */}
      <section className="py-10 bg-[#FFF8F0] border-y border-[#F0E3D2]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[600px] mx-auto mb-6">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C80808] mb-2"><span className="h-[3px] w-9 rounded bg-[#C80808]" />What we do</span>
            <h2 className="text-[1.3rem] sm:text-[1.7rem] font-black leading-[1.15] text-[#17191C]">Two divisions, one point of contact</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { img: "/assets/img/chem-05-water-treatment-plants.jpg", icon: FlaskConical, t: "Chemical & Water Treatment", d: "RO, cooling, boiler and ETP chemistry, complete treatment and sewage plants, filtration media, and laboratory instruments.", href: "/chemicals" },
              { img: "/assets/img/tube-fittings.jpg", icon: Cog, t: "Instrumentation & Valves", d: "Precision tube and pipe fittings, needle, ball, manifold and check valves, seamless tubing and analyser systems.", href: "/instrumentation" },
            ].map((c, k) => (
              <Reveal key={c.t} delay={k * 120}>
                <Link href={c.href} className="group relative block h-[190px] rounded-2xl overflow-hidden text-white shadow-lg">
                  <Image src={c.img} alt={c.t} fill sizes="600px" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17191C]/95 via-[#17191C]/55 to-[#17191C]/10" />
                  <div className="absolute bottom-0 p-5"><span className="w-9 h-9 rounded-lg bg-[#C80808] flex items-center justify-center mb-2"><c.icon className="w-4 h-4" /></span><h3 className="text-[17px] font-black text-white">{c.t}</h3><p className="text-[12.5px] text-white/80 max-w-[460px] mb-1.5">{c.d}</p><span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[#F2B93B] group-hover:gap-3 transition-all">Explore <ArrowRight className="w-4 h-4" /></span></div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[640px] mx-auto mb-7">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C80808] mb-2"><span className="h-[3px] w-9 rounded bg-[#C80808]" />Our values</span>
            <h2 className="text-[1.4rem] sm:text-[1.8rem] font-black leading-[1.15] text-[#17191C] mb-1.5">Eight principles behind every order</h2>
            <p className="text-[13.5px]">The operating standards that guide our vendor audits, technical evaluations, and delivery commitments.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {principles.map((pr, idx) => {
              const Icon = pIcons[idx];
              return (
                <Reveal key={pr.title} delay={(idx % 4) * 70}>
                  <div className="group relative h-full rounded-2xl bg-white border border-[#E7E9EE] shadow-md p-4 hover:shadow-2xl hover:border-[#C80808] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                    <span className="absolute -right-1 -top-3 font-black text-6xl text-[#FBE9EC] select-none">0{idx + 1}</span>
                    <span className="relative w-10 h-10 rounded-xl bg-[#FBE9EC] text-[#C80808] group-hover:bg-[#C80808] group-hover:text-white flex items-center justify-center mb-3 transition-colors"><Icon className="w-5 h-5" /></span>
                    <h3 className="relative text-[15px] font-extrabold text-[#17191C] mb-1">{pr.title}</h3>
                    <p className="relative text-[12.5px] leading-relaxed">{pr.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* BANNER */}
      <section className="relative py-10 bg-gradient-to-r from-[#A81010] via-[#C80808] to-[#A81010] text-white overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-25" />
        <Reveal className="relative max-w-[1240px] mx-auto px-5 sm:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <h2 className="text-white text-[1.45rem] sm:text-[2rem] font-black leading-[1.15] mb-1">Right equipment. Fully compliant. <span className="text-[#F2B93B]">Delivered on time.</span></h2>
            <p className="text-white/85 text-[13.5px] max-w-[620px]">Experience reliable procurement coordination for high-pressure instrumentation and specialty process chemistry.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-xl bg-white text-[#C80808] font-extrabold text-[13px] px-5 py-3 hover:-translate-y-1 hover:shadow-xl transition-all">Request a Quotation <ArrowRight className="w-4 h-4" /></Link>
            <a href={`tel:${COMPANY_INFO.contact.phoneRaw}`} className="inline-flex items-center gap-2 rounded-xl bg-[#17191C] text-white font-extrabold text-[13px] px-5 py-3 hover:-translate-y-1 hover:shadow-xl transition-all"><Phone className="w-4 h-4 text-[#F2B93B]" />{COMPANY_INFO.contact.phone}</a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
