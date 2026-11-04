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
            {[
              { v: "100%", l: "Traceability & MTRs" },
              { v: "< 24h", l: "Technical response" },
              { v: "2", l: "Divisions, one contact" },
              { v: "8", l: "Guiding principles" },
            ].map((x) => (
              <div key={x.l} className="rounded-2xl bg-white/10 backdrop-blur border border-white/25 px-4 py-3 text-center">
                <div className="text-2xl sm:text-3xl font-black text-[#FFA028] leading-none">{x.v}</div>
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-white/80 mt-1.5">{x.l}</div>
              </div>
            ))}
          </div>
        }
        marquee={["Integrity", "Quality", "Expertise", "Reliability", "Partnership", "Innovation", "Customer focus", "Accountability"]}
        actions={
          <>
            <Link href="/request-a-quote" className="btn btn-primary">
              Request a Quotation <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Contact us
            </Link>
          </>
        }
      />

      {/* MANDATE + STATS */}
      <section className="py-10 sm:py-12 bg-white overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 grid lg:grid-cols-[1.1fr_1fr] gap-8 items-center">
          <Reveal variant="left">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF4B32] mb-2">
              <span className="h-[3px] w-9 rounded bg-[#FF4B32]" />
              Our mandate
            </span>
            <h2 className="text-[1.4rem] sm:text-[1.8rem] font-black leading-[1.15] text-[#17191C] mb-3">
              A specialised sourcing and supply partner
            </h2>
            <div className="space-y-2.5 text-[14px] text-[#17191C]/80 leading-relaxed">
              <p>
                Industrial facilities cannot afford unscheduled shutdowns caused by leaking tube fittings, mismatched alloy metallurgy, or fouled reverse osmosis membranes. Our team operates at the nexus of technical understanding and international supply networks.
              </p>
              <p>
                Whether supplying severe service 6,000 PSI manifold valves for an offshore production skid or formulating targeted anti-scalants for an effluent recycling plant running at 85% recovery, our mandate is unwavering: deliver precisely what the specification demands.
              </p>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {["ISO 9001:2015 compliant", "EN 10204 3.1 / 3.2", "NACE MR0175", "API / ASME"].map((x) => (
                <li key={x} className="rounded-full bg-[#F5F6F7] border border-[#929DA7]/20 px-3 py-1 text-[12px] font-bold text-[#17191C]">
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal variant="right" className="grid grid-cols-2 gap-3">
            {[
              { t: "Engineering review", d: "Every enquiry scrutinized by experienced discipline engineers.", icon: ShieldCheck },
              { t: "Global OEM network", d: "Pre-qualified tier-1 manufacturers across 14 countries.", icon: Globe },
              { t: "Export crating", d: "ISPM-15 certified seaworthy packaging and shock-monitoring.", icon: Award },
              { t: "Full dossier", d: "Complete databook handover with every single shipment.", icon: Clock },
            ].map((b, k) => (
              <div
                key={b.t}
                className="rounded-2xl border border-[#929DA7]/20 bg-[#F5F6F7] p-4 hover:border-[#FF4B32] hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <span className="w-9 h-9 rounded-xl bg-[#17191C] text-white flex items-center justify-center mb-2.5">
                  <b.icon className="w-4 h-4 text-[#FFA028]" />
                </span>
                <h3 className="text-[14px] font-extrabold text-[#17191C] mb-1">{b.t}</h3>
                <p className="text-[12.5px] text-[#929DA7] leading-relaxed">{b.d}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* TWO DIVISIONS */}
      <section className="py-10 sm:py-12 bg-[#F5F6F7]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[600px] mx-auto mb-6">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF4B32] mb-2">
              <span className="h-[3px] w-9 rounded bg-[#FF4B32]" />
              Core capabilities
            </span>
            <h2 className="text-[1.4rem] sm:text-[1.8rem] font-black leading-[1.15] text-[#17191C] mb-1">
              Two integrated industrial divisions
            </h2>
            <p className="text-[13.5px] text-[#929DA7]">
              Eliminating the gap between process chemicals and the mechanical systems that deliver them.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                img: "/assets/img/chem-05-water-treatment-plants.jpg",
                icon: FlaskConical,
                t: "Chemical & Water Treatment",
                d: "RO, cooling, boiler and ETP chemistry, complete treatment and sewage plants, filtration media, and laboratory instruments.",
                href: "/chemicals",
              },
              {
                img: "/assets/img/tube-fittings.jpg",
                icon: Cog,
                t: "Instrumentation & Valves",
                d: "Precision tube and pipe fittings, needle, ball, manifold and check valves, seamless tubing and analyser systems.",
                href: "/instrumentation",
              },
            ].map((c, k) => (
              <Reveal key={c.t} delay={k * 120}>
                <Link href={c.href} className="group relative block h-[190px] rounded-2xl overflow-hidden text-white shadow-lg">
                  <Image src={c.img} alt={c.t} fill sizes="600px" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17191C]/95 via-[#17191C]/55 to-[#17191C]/10" />
                  <div className="absolute bottom-0 p-5">
                    <span className="w-9 h-9 rounded-lg bg-[#FF4B32] flex items-center justify-center mb-2">
                      <c.icon className="w-4 h-4" />
                    </span>
                    <h3 className="text-[17px] font-black text-white">{c.t}</h3>
                    <p className="text-[12.5px] text-white/80 max-w-[460px] mb-1.5">{c.d}</p>
                    <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[#FFA028] group-hover:gap-3 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
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
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF4B32] mb-2">
              <span className="h-[3px] w-9 rounded bg-[#FF4B32]" />
              Our values
            </span>
            <h2 className="text-[1.4rem] sm:text-[1.8rem] font-black leading-[1.15] text-[#17191C] mb-1.5">
              Eight principles behind every order
            </h2>
            <p className="text-[13.5px] text-[#929DA7]">
              The operating standards that guide our vendor audits, technical evaluations, and delivery commitments.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {principles.map((pr, idx) => {
              const Icon = pIcons[idx];
              return (
                <Reveal key={pr.title} delay={(idx % 4) * 70}>
                  <div className="group relative h-full rounded-2xl bg-white border border-[#929DA7]/20 shadow-md p-4 hover:shadow-2xl hover:border-[#FF4B32] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                    <span className="absolute -right-1 -top-3 font-black text-6xl text-[#FF4B32]/10 select-none">
                      0{idx + 1}
                    </span>
                    <span className="relative w-10 h-10 rounded-xl bg-[#FF4B32]/10 text-[#FF4B32] group-hover:bg-[#FF4B32] group-hover:text-white flex items-center justify-center mb-3 transition-colors">
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3 className="relative text-[15px] font-extrabold text-[#17191C] mb-1">{pr.title}</h3>
                    <p className="relative text-[12.5px] text-[#929DA7] leading-relaxed">{pr.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* BANNER */}
      <section className="relative py-10 bg-gradient-to-r from-[#17191C] via-[#23272B] to-[#17191C] text-white overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-25" />
        <Reveal className="relative max-w-[1240px] mx-auto px-5 sm:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <h2 className="text-white text-[1.45rem] sm:text-[2rem] font-black leading-[1.15] mb-1">
              Right equipment. Fully compliant. <span className="text-[#FFA028]">Delivered on time.</span>
            </h2>
            <p className="text-white/85 text-[13.5px] max-w-[620px]">
              Experience reliable procurement coordination for high-pressure instrumentation and specialty process chemistry.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/request-a-quote"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF4B32] hover:bg-[#FFA028] text-white font-extrabold text-[13px] px-5 py-3 hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              Request a Quotation <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${COMPANY_INFO.contact.phoneRaw}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-[13px] px-5 py-3 hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <Phone className="w-4 h-4 text-[#FFA028]" />
              {COMPANY_INFO.contact.phone}
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
