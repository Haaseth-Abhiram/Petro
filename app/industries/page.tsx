import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";

export default function IndustriesPage() {
  return (
    <div className="w-full">
      {/* 1. HERO */}
      <section className="relative bg-[#17191C]/90 text-white py-20 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 z-0"
          style={{ backgroundImage: "url('/assets/img/tube-fittings.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/85 via-[#17191C]/75 to-[#17191C]/55 z-0" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="max-w-[820px]">
            <span className="eyebrow eyebrow-gold">TARGET SECTOR SOLUTIONS</span>
            <h1 className="text-white text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-tight leading-[1.15] mb-4">
              Where our equipment goes to work
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-[660px]">
              Tailoring high-pressure metallurgy, chemical formulations, and documentation dossiers to the exact statutory and operating parameters of global industrial sectors.
            </p>
          </div>
        </div>
      </section>

      {/* 2. INDUSTRIES LIST */}
      <section className="py-16 lg:py-20 bg-white border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-[760px] mx-auto text-center mb-14">
            <span className="eyebrow">SECTORS WE SUPPLY</span>
            <h2 className="text-[#17191C] text-2xl sm:text-4xl font-extrabold tracking-tight">
              Six critical process environments
            </h2>
            <p className="text-[#5F6871] text-base sm:text-lg mt-3">
              Compliant hardware and specialized formulations engineered for severe high-pressure, sour gas and corrosive industrial duties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {INDUSTRIES.map((ind) => (
              <article key={ind.id} id={ind.slug} className="petro-card scroll-mt-28">
                <div className="relative h-60 w-full bg-[#EBECEE] overflow-hidden">
                  <Image
                    src={ind.image}
                    alt={ind.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17191C]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C80808] block mb-1">
                      Sector Application
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      {ind.name}
                    </h3>
                  </div>
                </div>

                <div className="p-7 flex flex-col justify-between flex-1">
                  <div>
                    <p className="text-[#5F6871] text-sm leading-relaxed mb-6">
                      {ind.detailedOverview}
                    </p>

                    <div className="mb-6">
                      <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#17191C] mb-3">
                        Technical Requirements:
                      </h4>
                      <ul className="space-y-1.5 text-xs text-[#5F6871]">
                        {ind.commonRequirements.map((req, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C80808] mr-2 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#D8DDE2] flex items-center justify-between">
                    <Link
                      href={`/request-a-quote?industry=${encodeURIComponent(ind.name)}`}
                      className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#C80808] hover:text-[#A81010] inline-flex items-center"
                    >
                      <span>Request {ind.name} Quote</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CTA BAND */}
      <section className="relative bg-[#17191C]/90 overflow-hidden py-20 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/assets/img/tube-fittings.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/85 to-[#17191C]/65" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center">
          <span className="eyebrow eyebrow-gold">SECTOR COMPLIANCE</span>
          <h2 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">
            Operating in a heavily regulated process sector?
          </h2>
          <p className="text-white/80 text-base sm:text-lg max-w-[620px] mx-auto mb-8">
            Our engineering team confirms NACE MR0175, ASME Section VIII and EN 10204 Type 3.1 &amp; 3.2 compliance before order placement.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/request-a-quote" className="btn btn-primary">
              Submit Sector RFQ
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Speak with a Specialist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
