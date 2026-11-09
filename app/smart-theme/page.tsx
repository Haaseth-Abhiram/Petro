import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Check, ShieldCheck, Award, Globe, Clock, Users, DollarSign, Eye, Target, Search, ClipboardList, FileCheck, Truck,
  Lightbulb, FlaskConical, Cog, Droplets, Gauge, Phone, Sparkles, Boxes, Wrench, CheckCircle2,
} from "lucide-react";
import Reveal from "@/components/common/Reveal";
import CountUp from "@/components/common/CountUp";
import HeroSlider from "@/components/common/HeroSlider";
import { COMPANY_INFO } from "@/data/company";

export const metadata = {
  title: "Petro Engineering — Theme preview",
  robots: { index: false, follow: false },
};

const slides = [
  { img: "/assets/img/reverse-osmosis.jpg", label: "Chemical & water treatment", line1: "Treatment chemicals and", line2: "water plants.", text: "RO, cooling, boiler and ETP chemistry, complete treatment and sewage plants, filtration media, and the laboratory instruments to verify performance.", primary: { href: "/chemicals", label: "Explore Chemicals" }, secondary: { href: "/request-a-quote", label: "Request a Quote" }, points: ["8 chemical groups", "63 line items", "Specified to your water analysis"] },
  { img: "/assets/img/tube-fittings.jpg", label: "Instrumentation & valves", line1: "Precision fittings, valves and", line2: "tubing.", text: "Instrumentation-grade components in SS316, carbon steel, brass and specialist alloys — sized 1/8\" to 1\" and rated to 10,000 psi.", primary: { href: "/instrumentation", label: "View Instrumentation" }, secondary: { href: "/request-a-quote", label: "Request a Quote" }, points: ["EN 10204 3.1 traceability", "NACE MR0175 compliant", "Up to 10,000 PSI"] },
  { img: "/assets/img/analyser-systems.jpg", label: "Analyser & sampling systems", line1: "Complete analyser and", line2: "sampling packages.", text: "Sample conditioning systems, heated probes, shelters and continuous gas analysers for process monitoring and environmental compliance.", primary: { href: "/instrumentation#analyser-systems", label: "Analyser Systems" }, secondary: { href: "/contact", label: "Talk to Engineers" }, points: ["Sample conditioning", "CEMS & GC", "Calibration support"] },
  { img: "/assets/img/hero-visual.png", label: "Procurement & sourcing", line1: "One accountable partner for", line2: "complete supply.", text: "From single-item replacement orders to full tender-package consolidation — we manage compliance, expediting and third-party inspection.", primary: { href: "/services", label: "Our Services" }, secondary: { href: "/request-a-quote", label: "Request a Quote" }, points: ["Single point of contact", "Documentation control", "Export-grade delivery"] },
];

const trust = [
  { icon: ShieldCheck, l: "ISO 9001 Certified" },
  { icon: Award, l: "ASME / ASTM Standards" },
  { icon: FileCheck, l: "EN 10204 3.1 / 3.2" },
  { icon: Gauge, l: "API 607 / NACE MR0175" },
  { icon: Globe, l: "India & Export" },
];

const stats = [
  { n: 8, suffix: "", l: "Chemical groups", icon: Droplets },
  { n: 63, suffix: "+", l: "Chemical line items", icon: Boxes },
  { n: 8, suffix: "", l: "Instrumentation categories", icon: Cog },
  { n: 24, suffix: "h", l: "Technical response", icon: Clock },
];

const services = [
  { t: "Oil & Gas Equipment Sourcing", tag: "Right specification, first time", d: "Certified valves, tubing, fittings and analytical packages for upstream, midstream and refining operations.", img: "/assets/img/tube-fittings.jpg", icon: Wrench, href: "/services#oil-gas-sourcing" },
  { t: "Project Procurement Support", tag: "From MTO to delivery", d: "Material take-offs, technical queries, vendor tabulations and bulk purchasing for EPC contracts.", img: "/assets/img/ball-valves.jpg", icon: ClipboardList, href: "/services#project-procurement" },
  { t: "Inspection & Quality Assurance", tag: "Verified before it ships", d: "Third-party inspection, witnessed pressure tests, PMI and EN 10204 3.1 / 3.2 certification.", img: "/assets/img/service-inspection-qa.jpg", icon: ShieldCheck, href: "/services#inspection-qa" },
  { t: "Vendor & Manufacturer Representation", tag: "Direct from the source", d: "Authorized technical sales and application representation for international process-equipment OEMs.", img: "/assets/img/analyser-systems.jpg", icon: Users, href: "/services#vendor-rep" },
  { t: "Logistics & Export Handling", tag: "Door-to-site delivery", d: "Sea-worthy crating, dangerous goods documentation (IMDG/IATA), customs clearance and freight.", img: "/assets/img/chem-07-commercial-chemicals.jpg", icon: Truck, href: "/services#logistics-export" },
  { t: "Technical Consultation & Engineering Support", tag: "Engineering you can lean on", d: "Chemical dosage projections, valve sizing (Cv), alloy selection and sampling lag-time reviews.", img: "/assets/img/service-technical-consultation.jpg", icon: Lightbulb, href: "/services#technical-consulting" },
];

const why = [
  { t: "Global supplier network", d: "Direct access to approved manufacturers and OEMs across Europe, North America, Japan and Asia-Pacific.", icon: Globe },
  { t: "Technical & commercial expertise", d: "Our engineers evaluate datasheets, process limits and metallurgy before submitting compliant technical bids.", icon: Award },
  { t: "International standards", d: "Full traceability with EN 10204 3.1 / 3.2 certification, NACE MR0175, ASME, ASTM and API standards.", icon: ShieldCheck },
  { t: "Transparent pricing", d: "Factory-direct sourcing and package consolidation minimize procurement markups and overhead.", icon: DollarSign },
  { t: "Reliable delivery", d: "Strict expediting, ISPM-15 export packing and complete dossiers ready for client handover.", icon: Clock },
  { t: "Single point of contact", d: "Consolidate chemicals and instrumentation packages under one commercial contract.", icon: Users },
];

const steps = [
  { t: "Enquiry & review", d: "We review datasheets, MTO line items, pressure ratings and approved vendor lists.", icon: Search },
  { t: "Sourcing & proposal", d: "Direct coordination with audited plants for delivery windows and competitive pricing.", icon: ClipboardList },
  { t: "Inspection & documentation", d: "Test witness, PMI audits and verification of EN 10204 3.1 & 3.2 certificates.", icon: ShieldCheck },
  { t: "Packing & delivery", d: "Export crating, preservation, documentation and logistics to your site gate.", icon: Truck },
];

const portfolio = [
  { t: "RO Chemicals & Components", tags: ["Antiscalants", "Membranes", "Dosing pumps"], img: "/assets/img/chem-01-ro-chemicals.jpg", href: "/chemicals#ro-chemicals", cat: "Chemicals" },
  { t: "Cooling & Boiler Water", tags: ["Inhibitors", "Biocides", "Scavengers"], img: "/assets/img/chem-02-cooling-water.jpg", href: "/chemicals#cooling-water", cat: "Chemicals" },
  { t: "Water & Wastewater Plants", tags: ["DM / RO plants", "ETP", "Filtration"], img: "/assets/img/chem-05-water-treatment-plants.jpg", href: "/chemicals#water-treatment-plants", cat: "Plants" },
  { t: "Tube & Pipe Fittings", tags: ["SS316", "6000 psi", "NPT / BSP"], img: "/assets/img/pipe-fittings.jpg", href: "/instrumentation#pipe-fittings", cat: "Instrumentation" },
  { t: "Valves — Ball, Needle, Manifold", tags: ["Up to 10,000 psi", "2 / 3 / 5-way", "NACE"], img: "/assets/img/needle-valves-alt.jpg", href: "/instrumentation#needle-valves", cat: "Instrumentation" },
  { t: "Analyser Systems", tags: ["CEMS", "Sample conditioning", "GC"], img: "/assets/img/analyser-systems.jpg", href: "/instrumentation#analyser-systems", cat: "Systems" },
];

const standards = ["ASME", "NACE MR0175", "ASTM", "API 607", "EN 10204 3.1 / 3.2", "ISO 9001:2015", "ISPM-15", "IMDG / IATA", "NFPA"];

const Eyebrow = ({ icon: Icon, children, light = false }: { icon: React.ElementType; children: React.ReactNode; light?: boolean }) => (
  <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] ${light ? "bg-white/10 text-[#F2B93B] border border-white/15" : "bg-[#FBE9EC] text-[#C80808]"}`}>
    <Icon className="w-3.5 h-3.5" />{children}
  </span>
);
const Bar = ({ center = true }: { center?: boolean }) => (
  <span className={`block h-[4px] w-16 rounded-full bg-gradient-to-r from-[#8A0A0A] via-[#C80808] to-[#E0A21A] mt-4 ${center ? "mx-auto" : ""}`} />
);

export default function SmartThemePage() {
  return (
    <div className="w-full bg-white">
      <HeroSlider slides={slides} />

      {/* TRUST ICONS */}
      <section className="py-9 bg-white">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-5 gap-5">
          {trust.map((t, k) => (
            <Reveal key={t.l} delay={k * 70}>
              <div className="group flex flex-col items-center text-center gap-2.5">
                <span className="w-16 h-16 rounded-2xl border border-[#F0E3D2] bg-white shadow-md text-[#C80808] flex items-center justify-center group-hover:bg-[#C80808] group-hover:text-white group-hover:-translate-y-1 group-hover:shadow-xl transition-all duration-300"><t.icon className="w-7 h-7" /></span>
                <span className="text-[12.5px] font-bold text-[#17191C] leading-tight max-w-[110px]">{t.l}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STATS BAND */}
      <section className="relative py-12 bg-gradient-to-br from-[#17191C] via-[#3a0d0d] to-[#8A0A0A] overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B]" />
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="absolute -top-24 -right-16 w-[420px] h-[420px] rounded-full bg-[#E0A21A]/20 blur-[110px]" />
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, k) => (
            <Reveal key={s.l} delay={k * 90}>
              <div className="rounded-2xl bg-white/[0.08] backdrop-blur border border-white/15 p-5 sm:p-6 hover:bg-white/[0.14] hover:-translate-y-1 transition-all duration-300">
                <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C80808]/50 to-[#E0A21A]/50 text-white flex items-center justify-center mb-4"><s.icon className="w-5 h-5" /></span>
                <div className="text-4xl sm:text-5xl font-black text-white leading-none"><CountUp end={s.n} />{s.suffix}</div>
                <span className="block h-[2px] w-8 bg-[#F2B93B] my-3" />
                <div className="text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.16em] text-white/75">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ABOUT SPLIT */}
      <section className="py-14 sm:py-16 bg-white overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal variant="left" className="relative">
            <div className="relative h-[360px] sm:h-[440px] rounded-3xl overflow-hidden shadow-2xl border border-[#F0E3D2]">
              <span className="absolute top-0 inset-x-0 h-[4px] z-10 bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B]" />
              <Image src="/assets/img/service-inspection-qa.jpg" alt="Petro Engineering quality inspection" fill sizes="(min-width:1024px) 560px, 100vw" className="object-cover" />
            </div>
            <span className="absolute -top-4 -left-3 w-12 h-12 rounded-2xl bg-[#C80808] text-white flex items-center justify-center shadow-xl"><Sparkles className="w-5 h-5" /></span>
            <div className="absolute -bottom-6 right-4 sm:right-8 rounded-2xl bg-white shadow-2xl border border-[#F0E3D2] px-5 py-3.5 flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C80808]/50 to-[#E0A21A]/50 text-white flex items-center justify-center"><Award className="w-5 h-5" /></span>
              <span><span className="block text-[18px] font-black text-[#17191C] leading-none">ISO 9001:2015</span><span className="block text-[11px] font-extrabold tracking-[0.16em] text-[#4a5159] mt-1">SERVING INDIA &amp; EXPORT</span></span>
            </div>
          </Reveal>
          <Reveal variant="right">
            <Eyebrow icon={Sparkles}>About us</Eyebrow>
            <h2 className="text-[1.9rem] sm:text-[2.5rem] font-black leading-[1.08] text-[#17191C] mt-3">Welcome to <span className="text-gradient">Petro Engineering.</span></h2>
            <Bar center={false} />
            <p className="text-[16px] sm:text-[17px] leading-relaxed text-[#17191C] mt-5">We supply the chemistry, instrumentation and procurement support that keep process plants running — specified to your datasheets, documented to international standards.</p>
            <p className="text-[14.5px] leading-relaxed mt-3">As a specialised sourcing partner based in Mumbai, we are one accountable team across water-treatment chemistry, precision valves and fittings, and analyser systems.</p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mt-5">
              {["Two divisions, one contact", "EN 10204 3.1 / 3.2 certified", "Technical bids reviewed by engineers", "Export-grade packing and delivery"].map((x) => (
                <li key={x} className="flex items-center gap-2.5 text-[14px] font-semibold text-[#17191C]"><span className="w-5 h-5 rounded-full bg-[#C80808] text-white flex items-center justify-center shrink-0"><Check className="w-3 h-3" /></span>{x}</li>
              ))}
            </ul>
            <Link href="/about" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C80808] to-[#A80808] text-white text-[14px] font-bold px-6 py-3 shadow-[0_12px_28px_rgba(200,8,8,0.3)] hover:-translate-y-1 transition-all">Read More <ArrowRight className="w-4 h-4" /></Link>
          </Reveal>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="relative py-14 bg-gradient-to-br from-[#17191C] via-[#2a0c0c] to-[#8A0A0A] overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-25" />
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center mb-9">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-white/70">Our direction</span>
            <h2 className="text-[1.8rem] sm:text-[2.3rem] font-black text-white mt-2">Vision &amp; Mission</h2>
            <Bar />
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { n: "01", icon: Eye, t: "Our Vision", d: "To be the most trusted sourcing and supply partner for process industries — right equipment, fully compliant, delivered on time." },
              { n: "02", icon: Target, t: "Our Mission", d: "To deliver precisely what the specification demands: certified products, transparent pricing and one accountable contact from enquiry to site delivery." },
            ].map((v, k) => (
              <Reveal key={v.t} delay={k * 120}>
                <div className="relative h-full rounded-3xl bg-white/[0.07] backdrop-blur border border-white/15 p-7 sm:p-8 overflow-hidden hover:bg-white/[0.12] transition-colors">
                  <span className="absolute top-3 right-5 font-black text-6xl sm:text-7xl text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.25)] select-none">{v.n}</span>
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C80808]/50 to-[#E0A21A]/50 text-white flex items-center justify-center mb-5"><v.icon className="w-6 h-6" /></span>
                  <h3 className="text-[1.6rem] font-black text-white">{v.t}</h3>
                  <span className="block h-[3px] w-10 bg-[#F2B93B] rounded my-3" />
                  <p className="text-[14.5px] leading-relaxed text-white/85">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[660px] mx-auto mb-10">
            <Eyebrow icon={Lightbulb}>Our services</Eyebrow>
            <h2 className="text-[1.8rem] sm:text-[2.4rem] font-black leading-[1.1] text-[#17191C] mt-3">Everything for a compliant supply chain</h2>
            <Bar />
            <p className="text-[15px] mt-4">Six integrated services, delivered by one team — so your orders move together, not in silos.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, k) => (
              <Reveal key={s.t} delay={(k % 3) * 90}>
                <Link href={s.href} className="group relative flex flex-col h-full rounded-3xl bg-white border border-[#E7E9EE] shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <span className="absolute top-0 inset-x-0 h-[3px] z-10 bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B]" />
                  <div className="relative h-[190px] overflow-hidden">
                    <Image src={s.img} alt={s.t} fill sizes="(min-width:1024px) 400px, 100vw" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-[#17191C]/20" />
                    <span className="absolute right-4 bottom-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur text-[#C80808] shadow-md flex items-center justify-center"><s.icon className="w-5 h-5" /></span>
                  </div>
                  <div className="flex flex-col flex-1 p-6 pt-3">
                    <h3 className="text-[18px] font-extrabold text-[#17191C] leading-snug">{s.t}</h3>
                    <span className="text-[13px] font-bold text-[#C80808] mt-0.5">{s.tag}</span>
                    <p className="text-[13.5px] leading-relaxed mt-2.5 flex-1">{s.d}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-extrabold text-[#C80808] group-hover:gap-3 transition-all">Explore solutions <ArrowRight className="w-4 h-4" /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-8"><Link href="/services" className="inline-flex items-center gap-2 rounded-xl border-2 border-[#C80808] text-[#C80808] hover:bg-[#C80808] hover:text-white text-[14px] font-extrabold px-6 py-3 transition-colors">See all services <ArrowRight className="w-4 h-4" /></Link></div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="relative py-14 sm:py-16 bg-gradient-to-b from-[#FFF8F0] via-white to-[#FFF3E6] overflow-hidden">
        <div className="absolute -top-20 -left-16 w-[420px] h-[420px] rounded-full bg-[#C80808]/[0.07] blur-[100px]" />
        <div className="absolute -bottom-20 -right-16 w-[420px] h-[420px] rounded-full bg-[#E0A21A]/[0.16] blur-[100px]" />
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[660px] mx-auto mb-10">
            <Eyebrow icon={ShieldCheck}>Why choose us</Eyebrow>
            <h2 className="text-[1.8rem] sm:text-[2.4rem] font-black leading-[1.1] text-[#17191C] mt-3">Why plants across India trust Petro</h2>
            <Bar />
            <p className="text-[15px] mt-4">One partner for chemistry, instrumentation and procurement — specified, compliant and supported for the long term.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {why.map((w, k) => (
              <Reveal key={w.t} delay={(k % 3) * 90}>
                <div className="group h-full rounded-3xl bg-white/80 backdrop-blur border border-white shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1.5 hover:border-[#C80808]/30 transition-all duration-300">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C80808]/50 to-[#E0A21A]/50 text-white flex items-center justify-center mb-4 group-hover:rotate-6 group-hover:scale-110 transition-transform"><w.icon className="w-6 h-6" /></span>
                  <h3 className="text-[16.5px] font-extrabold text-[#17191C] mb-1.5">{w.t}</h3>
                  <p className="text-[13.5px] leading-relaxed">{w.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          {/* free consultation CTA */}
          <Reveal className="mt-8">
            <div className="relative rounded-3xl bg-gradient-to-r from-[#17191C] via-[#3a0d0d] to-[#8A0A0A] text-white p-6 sm:p-8 overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-[#E0A21A]/25 blur-[70px]" />
              <div className="relative max-w-[620px]">
                <h3 className="text-[1.5rem] sm:text-[1.9rem] font-black leading-tight">Get a technical review of your enquiry</h3>
                <p className="text-white/80 text-[14px] mt-1.5">Send a line list or datasheet. Our engineers reply within one business day.</p>
              </div>
              <div className="relative flex flex-wrap gap-3">
                <Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-xl bg-white text-[#C80808] font-extrabold text-[14px] px-6 py-3 hover:-translate-y-1 hover:shadow-xl transition-all"><FileCheck className="w-5 h-5" />Request a Quote</Link>
                <a href={`tel:${COMPANY_INFO.contact.phoneRaw}`} className="inline-flex items-center gap-2 rounded-xl bg-white/15 border border-white/30 text-white font-extrabold text-[14px] px-6 py-3 hover:-translate-y-1 transition-all"><Phone className="w-5 h-5 text-[#F2B93B]" />{COMPANY_INFO.contact.phone}</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative py-14 bg-gradient-to-br from-[#17191C] via-[#2a0c0c] to-[#17191C] overflow-hidden">
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute -top-20 -left-16 w-[420px] h-[420px] rounded-full bg-[#C80808]/25 blur-[110px]" />
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[660px] mx-auto mb-12">
            <Eyebrow icon={CheckCircle2} light>How we work</Eyebrow>
            <h2 className="text-[1.8rem] sm:text-[2.4rem] font-black leading-[1.1] text-white mt-3">From enquiry to site delivery, handled</h2>
            <Bar />
            <p className="text-white/75 text-[15px] mt-4">A clear, accountable process that keeps your order on time, on budget and compliant.</p>
          </Reveal>
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
            <span aria-hidden="true" className="hidden lg:block absolute top-0 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#C80808] opacity-50" />
            {steps.map((s, k) => (
              <Reveal key={s.t} delay={k * 110}>
                <div className="group relative h-full rounded-3xl bg-white/[0.07] backdrop-blur border border-white/15 hover:bg-white/[0.13] hover:border-[#E0A21A] p-6 pt-11 text-center transition-all duration-300">
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70px] h-[70px] rounded-full bg-gradient-to-br from-[#C80808]/50 to-[#E0A21A]/50 text-white flex items-center justify-center ring-4 ring-[#1d1114] shadow-xl"><s.icon className="w-7 h-7" /></span>
                  <span className="text-[11px] font-extrabold tracking-[0.2em] text-[#F2B93B]">STEP 0{k + 1}</span>
                  <h3 className="text-[16.5px] font-extrabold text-white mt-1 mb-2">{s.t}</h3>
                  <p className="text-[13px] leading-relaxed text-white/70">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE SUPPLY */}
      <section className="py-14 sm:py-16 bg-[#F8F6F3]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
            <div>
              <Eyebrow icon={FlaskConical}>What we supply</Eyebrow>
              <h2 className="text-[1.8rem] sm:text-[2.4rem] font-black leading-[1.1] text-[#17191C] mt-3">Products delivered across India</h2>
              <Bar center={false} />
            </div>
            <Link href="/chemicals" className="inline-flex items-center gap-2 rounded-xl border-2 border-[#E7E9EE] bg-white text-[#C80808] hover:border-[#C80808] text-[13.5px] font-extrabold px-5 py-2.5 transition-colors self-start sm:self-auto">All products <ArrowRight className="w-4 h-4" /></Link>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolio.map((p, k) => (
              <Reveal key={p.t} delay={(k % 3) * 90}>
                <Link href={p.href} className="group block rounded-3xl bg-white border border-[#E7E9EE] shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500">
                  <div className="relative h-[200px] overflow-hidden">
                    <Image src={p.img} alt={p.t} fill sizes="(min-width:1024px) 400px, 100vw" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <span className="absolute top-3 left-3 rounded-full bg-[#C80808] text-white text-[10.5px] font-extrabold tracking-wider px-3 py-1 shadow">{p.cat.toUpperCase()}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[17px] font-extrabold text-[#17191C] mb-2.5">{p.t}</h3>
                    <div className="flex flex-wrap gap-1.5">{p.tags.map((t) => (<span key={t} className="rounded-full bg-[#FFF8F0] border border-[#F0E3D2] px-2.5 py-0.5 text-[11.5px] font-bold text-[#17191C]">{t}</span>))}</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STANDARDS MARQUEE */}
      <section className="py-7 bg-white border-y border-[#F0E3D2] overflow-hidden">
        <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#929DA7] mb-4">Standards &amp; approvals we work to</p>
        <div className="flex w-max animate-marquee">
          {[0, 1].map((r) => (
            <div key={r} className="flex items-center gap-4 pr-4">
              {standards.map((s) => (<span key={s + r} className="whitespace-nowrap rounded-2xl border border-[#E7E9EE] bg-white shadow-sm px-6 py-3 text-[15px] font-black tracking-wide text-[#17191C]">{s}</span>))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
