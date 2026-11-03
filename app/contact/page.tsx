import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";
import { COMPANY_INFO } from "@/data/company";

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* 1. HERO */}
      <section className="relative bg-[#17191C] text-white py-20 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 z-0"
          style={{ backgroundImage: "url('/assets/img/service-technical-consultation.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/95 via-[#17191C]/90 to-[#17191C]/75 z-0" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="max-w-[820px]">
            <span className="eyebrow eyebrow-gold">GET IN TOUCH</span>
            <h1 className="text-white text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-tight leading-[1.15] mb-4">
              We're here to source. Call us today.
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-[660px]">
              Send us a part number, an MTO or an RFQ pack. We reply within one business day.
            </p>
          </div>
        </div>
      </section>

      {/* 2. THREE CONTACT CARDS */}
      <section className="py-12 bg-white border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Phone */}
            <div className="p-7 bg-white border border-[#D8DDE2] rounded-[8px] flex flex-col justify-between hover:border-[#cbd4dd] transition-all">
              <div>
                <div className="w-12 h-12 rounded-[4px] bg-[#FF4B32]/10 text-[#FF4B32] flex items-center justify-center mb-5">
                  <Phone className="w-6 h-6" />
                </div>
                <span className="font-['Plus_Jakarta_Sans'] text-xs font-extrabold uppercase tracking-widest text-[#5F6871] mb-2 block">
                  CALL US
                </span>
                <a
                  href={`tel:${COMPANY_INFO.contact.phoneRaw}`}
                  className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#17191C] hover:text-[#FF4B32] block"
                >
                  {COMPANY_INFO.contact.phone}
                </a>
              </div>
              <p className="text-xs text-[#5F6871] mt-3">
                Monday to Saturday, 9am–6.30pm IST
              </p>
            </div>

            {/* Card 2: Email */}
            <div className="p-7 bg-white border border-[#D8DDE2] rounded-[8px] flex flex-col justify-between hover:border-[#cbd4dd] transition-all">
              <div>
                <div className="w-12 h-12 rounded-[4px] bg-[#FF4B32]/10 text-[#FF4B32] flex items-center justify-center mb-5">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="font-['Plus_Jakarta_Sans'] text-xs font-extrabold uppercase tracking-widest text-[#5F6871] mb-2 block">
                  EMAIL US
                </span>
                <a
                  href={`mailto:${COMPANY_INFO.contact.email}`}
                  className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#17191C] hover:text-[#FF4B32] block"
                >
                  {COMPANY_INFO.contact.email}
                </a>
              </div>
              <p className="text-xs text-[#5F6871] mt-3">
                Send line lists, datasheets and RFQs
              </p>
            </div>

            {/* Card 3: Location */}
            <div className="p-7 bg-white border border-[#D8DDE2] rounded-[8px] flex flex-col justify-between hover:border-[#cbd4dd] transition-all">
              <div>
                <div className="w-12 h-12 rounded-[4px] bg-[#FF4B32]/10 text-[#FF4B32] flex items-center justify-center mb-5">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="font-['Plus_Jakarta_Sans'] text-xs font-extrabold uppercase tracking-widest text-[#5F6871] mb-2 block">
                  OFFICE
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#17191C] block">
                  Mumbai, Maharashtra
                </span>
              </div>
              <p className="text-xs text-[#5F6871] mt-3">
                India — serving clients across India and on export
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FORM & MAP SECTION */}
      <section className="py-16 lg:py-20 bg-[#F5F6F7] border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="mb-6">
                <span className="eyebrow">ENQUIRY FORM</span>
                <h2 className="text-[#17191C] text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Tell us what you need
                </h2>
                <p className="text-[#5F6871] text-sm mt-1">
                  Fill in the technical details below. Our engineering desk will review and reply within one business day.
                </p>
              </div>

              <ContactForm />
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#D8DDE2] rounded-[8px] p-7 shadow-sm">
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#17191C] mb-3">
                  Direct RFQ &amp; Procurement Packs
                </h3>
                <p className="text-[#5F6871] text-sm leading-relaxed mb-4">
                  For comprehensive tender packages with multiple line items, datasheets and delivery schedules, use our dedicated Request for Quotation portal.
                </p>
                <Link
                  href="/request-a-quote"
                  className="btn btn-secondary w-full text-center"
                >
                  Open Dedicated RFQ Portal
                </Link>
              </div>

              {/* Location Card */}
              <div className="bg-[#17191C] text-white p-7 rounded-[8px]">
                <span className="eyebrow eyebrow-gold">HEADQUARTERS</span>
                <h3 className="text-white text-lg font-bold mt-1 mb-2">
                  {COMPANY_INFO.legalName}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Operating out of Mumbai's industrial supply corridor, servicing refinery, petrochemical, power and water infrastructure projects globally.
                </p>
                <div className="pt-3 border-t border-[#2A2E34] text-xs text-white/60 space-y-1">
                  <p>• ISO 9001:2015 compliant procurement governance</p>
                  <p>• EN 10204 Type 3.1 &amp; 3.2 documentation support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
