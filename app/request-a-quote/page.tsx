"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Clock, FileText, Phone, Mail } from "lucide-react";
import RFQForm from "@/components/forms/RFQForm";
import { COMPANY_INFO } from "@/data/company";

function RFQContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialProduct = searchParams.get("product") || "";
  const initialIndustry = searchParams.get("industry") || "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      <div className="lg:col-span-8">
        <RFQForm
          initialCategory={initialCategory}
          initialProduct={initialProduct}
          initialIndustry={initialIndustry}
        />
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-[8px] border border-[#D8DDE2] p-7 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 text-[#17191C] font-bold border-b border-[#D8DDE2] pb-3">
            <ShieldCheck className="w-5 h-5 text-[#FF4B32]" />
            <h3 className="font-['Plus_Jakarta_Sans'] text-sm uppercase tracking-wider">
              RFQ Evaluation Standards
            </h3>
          </div>

          <div className="space-y-4 text-xs text-[#5F6871] leading-relaxed">
            <div className="flex items-start space-x-3">
              <Clock className="w-4 h-4 text-[#FF4B32] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#17191C] block">Fast Bid Turnaround</strong>
                <span>Technical and commercial bid tabulations submitted within 24 to 48 hours.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FileText className="w-4 h-4 text-[#FF4B32] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#17191C] block">Complete MTR Assurances</strong>
                <span>Every line item supplied with EN 10204 Type 3.1 or 3.2 Material Test Reports.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-4 h-4 text-[#FF4B32] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#17191C] block">Single Accountability</strong>
                <span>Single purchase order coordination for multi-discipline piping, valves and chemistry.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#17191C] text-white p-7 rounded-[8px]">
          <span className="eyebrow eyebrow-gold">URGENT REQUIREMENT?</span>
          <h4 className="text-white text-base font-bold mt-1 mb-2">
            Speak directly with technical sales
          </h4>
          <p className="text-white/70 text-xs leading-relaxed mb-4">
            For critical plant shutdowns, emergency leaks or active tender milestones:
          </p>
          <div className="text-xs space-y-2 text-white/90">
            <a href={`tel:${COMPANY_INFO.contact.phoneRaw}`} className="flex items-center hover:text-[#FF4B32]">
              <Phone className="w-3.5 h-3.5 text-[#FF4B32] mr-2" />
              {COMPANY_INFO.contact.phone}
            </a>
            <a href={`mailto:${COMPANY_INFO.contact.email}`} className="flex items-center hover:text-[#FF4B32]">
              <Mail className="w-3.5 h-3.5 text-[#FF4B32] mr-2" />
              {COMPANY_INFO.contact.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RequestAQuotePage() {
  return (
    <div className="w-full">
      <section className="relative bg-[#17191C] text-white py-20 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 z-0"
          style={{ backgroundImage: "url('/assets/img/tube-fittings.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/95 via-[#17191C]/90 to-[#17191C]/75 z-0" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="max-w-[820px]">
            <span className="eyebrow eyebrow-gold">TECHNICAL RFQ</span>
            <h1 className="text-white text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-tight leading-[1.15] mb-4">
              Request a Technical Quotation
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-[660px]">
              Submit your project specifications, bill of materials, quantities, or datasheets. Our application engineers will prepare a detailed commercial proposal and delivery schedule.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-[#F5F6F7] border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <Suspense fallback={<div className="p-12 text-center text-[#5F6871]">Loading RFQ Form...</div>}>
            <RFQContent />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
