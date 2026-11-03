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
} from "lucide-react";
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
            <span className="eyebrow eyebrow-gold">ABOUT PETRO ENGINEERING</span>
            <h1 className="text-white text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-tight leading-[1.15] mb-4">
              An industrial engineering company delivering reliable solutions
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-[660px]">
              {COMPANY_INFO.legalName} is a specialized sourcing and supply partner catering to oil &amp; gas, petrochemical, process utilities, and industrial water treatment.
            </p>
          </div>
        </div>
      </section>

      {/* 2. OVERVIEW */}
      <section className="py-20 lg:py-24 bg-white border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="eyebrow">OUR MANDATE</span>
              <h2 className="text-[#17191C] text-2xl sm:text-4xl font-extrabold tracking-tight mb-6">
                A specialised sourcing and supply partner
              </h2>
              <div className="space-y-4 text-[#5F6871] text-base leading-relaxed">
                <p>
                  Industrial facilities cannot afford unscheduled shutdowns caused by leaking tube fittings, mismatched alloy metallurgy, or fouled reverse osmosis membranes. Our team operates at the nexus of technical understanding and international supply networks.
                </p>
                <p>
                  Whether supplying severe service 6,000 PSI manifold valves for an offshore production skid or formulating targeted anti-scalants for an effluent recycling plant running at 85% recovery, our mandate is unwavering: deliver precisely what the specification requires, verified by authentic test documentation.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-5 bg-[#F5F6F7] border border-[#D8DDE2] rounded-[4px]">
                  <div className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-[#FF4B32]">
                    100%
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#5F6871] mt-1">
                    Traceability &amp; MTRs
                  </div>
                </div>
                <div className="p-5 bg-[#F5F6F7] border border-[#D8DDE2] rounded-[4px]">
                  <div className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-[#FF4B32]">
                    &lt; 24h
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#5F6871] mt-1">
                    Technical Response
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[420px] rounded-[8px] overflow-hidden border border-[#D8DDE2] shadow-md">
              <Image
                src="/assets/img/service-inspection-qa.jpg"
                alt="Petro Engineering Quality Inspection"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. EIGHT PRINCIPLES */}
      <section className="py-20 lg:py-24 bg-[#F5F6F7] border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-[760px] mx-auto text-center mb-14">
            <span className="eyebrow">OUR VALUES</span>
            <h2 className="text-[#17191C] text-2xl sm:text-4xl font-extrabold tracking-tight">
              Eight principles behind every order
            </h2>
            <p className="text-[#5F6871] text-base sm:text-lg mt-3">
              The operating standards that guide our vendor audits, technical evaluations, and delivery commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((pr, idx) => (
              <div
                key={idx}
                className="bg-white p-7 border border-[#D8DDE2] rounded-[8px] hover:border-[#cbd4dd] transition-all"
              >
                <span className="font-['Plus_Jakarta_Sans'] text-xs font-extrabold uppercase tracking-widest text-[#FF4B32] mb-2 block">
                  0{idx + 1}
                </span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#17191C] mb-2">
                  {pr.title}
                </h3>
                <p className="text-[#5F6871] text-sm leading-relaxed">
                  {pr.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VALUES BANNER */}
      <section className="py-20 bg-[#17191C] text-white text-center">
        <div className="max-w-[860px] mx-auto px-6">
          <span className="eyebrow eyebrow-gold">PETRO ENGINEERING</span>
          <h2 className="text-white text-3xl sm:text-5xl font-extrabold tracking-tight mt-2 mb-4">
            Right equipment. Fully compliant. <span className="text-[#FF4B32]">Delivered on time.</span>
          </h2>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-[620px] mx-auto mb-8">
            Experience reliable procurement coordination for high-pressure instrumentation and specialty process chemistry.
          </p>
          <Link href="/request-a-quote" className="btn btn-primary">
            Request a Quotation
          </Link>
        </div>
      </section>
    </div>
  );
}
