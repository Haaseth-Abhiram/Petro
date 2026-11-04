import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Send,
  Search,
  Clock,
  ShieldCheck,
  Home as HomeIcon,
  ChevronRight,
} from "lucide-react";
import Reveal from "@/components/common/Reveal";
import ContactForm from "@/components/forms/ContactForm";
import { COMPANY_INFO } from "@/data/company";

export default function ContactPage() {
  const cards = [
    {
      icon: Phone,
      label: "Call us",
      value: COMPANY_INFO.contact.phone,
      href: `tel:${COMPANY_INFO.contact.phoneRaw}`,
      note: "Mon–Sat, 8:00 AM – 6:00 PM · Visits by appointment",
      c: "bg-[#FF4B32]",
    },
    {
      icon: Mail,
      label: "Email us",
      value: COMPANY_INFO.contact.email,
      href: `mailto:${COMPANY_INFO.contact.email}`,
      note: "Line lists, datasheets and RFQs",
      c: "bg-[#FFA028]",
    },
    {
      icon: MapPin,
      label: "Office",
      value: "Mumbai, Maharashtra",
      href: "",
      note: "Serving India and export",
      c: "bg-[#17191C]",
    },
  ];
  const next = [
    { icon: Send, t: "Send your enquiry", d: "A part number, an MTO or a full RFQ pack." },
    { icon: Search, t: "We review the specification", d: "Sizes, ratings, materials and standards checked." },
    { icon: Clock, t: "Reply in one business day", d: "A clear response with next steps and a proposal." },
  ];

  return (
    <div className="w-full">
      {/* HERO + FORM */}
      <section className="relative bg-[#17191C] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/assets/img/service-technical-consultation.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C] via-[#17191C]/90 to-[#23272B]/60" />
        <div className="absolute -top-28 -right-20 w-[460px] h-[460px] rounded-full bg-[#FFA028]/15 blur-[120px] animate-blob" />
        <div className="absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full bg-[#FF4B32]/15 blur-[120px] animate-blob" />
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 py-9 sm:py-10 grid lg:grid-cols-[1fr_1.05fr] gap-8 items-start">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-white/60 mb-3">
              <Link href="/" className="hover:text-white inline-flex items-center gap-1">
                <HomeIcon className="w-3.5 h-3.5" />
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#FFA028] font-semibold">Contact</span>
            </nav>
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FFA028] mb-2">
              <span className="h-[3px] w-9 rounded bg-[#FFA028]" />
              Get in touch
            </span>
            <h1 className="text-white text-[1.75rem] sm:text-[2.3rem] lg:text-[2.6rem] font-black tracking-tight leading-[1.1] mb-3">
              We&apos;re here to source. <span className="text-[#FFA028]">Call us today.</span>
            </h1>
            <p className="text-white/75 text-[14.5px] leading-relaxed max-w-[480px] mb-5">
              Send us a part number, an MTO or an RFQ pack. We reply within one business day.
            </p>

            <div className="space-y-3 max-w-[480px]">
              {cards.map((c) => {
                const inner = (
                  <>
                    <span
                      className={`w-11 h-11 rounded-xl text-white flex items-center justify-center shrink-0 ${c.c}`}
                    >
                      <c.icon className="w-5 h-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FFA028]">
                        {c.label}
                      </span>
                      <span className="block text-[15px] font-black text-white break-words">{c.value}</span>
                      <span className="block text-[11.5px] text-white/60">{c.note}</span>
                    </span>
                  </>
                );
                const cls =
                  "flex items-center gap-3.5 rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-3.5 transition-all duration-300";
                return c.href ? (
                  <a
                    key={c.label}
                    href={c.href}
                    className={`${cls} hover:bg-white/20 hover:border-[#FFA028] hover:translate-x-1.5`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={c.label} className={cls}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>

          {/* form card */}
          <div className="relative rounded-3xl bg-white text-[#17191C] shadow-[0_30px_80px_rgba(0,0,0,0.35)] p-5 sm:p-7 border-t-4 border-[#FF4B32]">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF4B32] mb-1">
              <span className="h-[3px] w-9 rounded bg-[#FF4B32]" />
              Enquiry form
            </span>
            <h2 className="text-[1.3rem] sm:text-[1.5rem] font-black leading-[1.15] text-[#17191C] mb-1">
              Tell us what you need
            </h2>
            <p className="text-[13px] text-[#929DA7] mb-4">
              Fill in the technical details below. Our engineering desk replies within one business day.
            </p>
            <ContactForm bare />
          </div>
        </div>
      </section>

      {/* SIDE INFO + NEXT STEPS */}
      <section className="py-10 bg-[#F5F6F7] border-b border-[#929DA7]/20">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 grid lg:grid-cols-[1fr_1.05fr] gap-8 items-start">
          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-[#929DA7]/20 shadow-md p-5">
              <h3 className="text-[15px] font-extrabold text-[#17191C] mb-1.5">
                Direct RFQ &amp; procurement packs
              </h3>
              <p className="text-[13px] text-[#929DA7] leading-relaxed mb-3">
                For comprehensive tender packages with multiple line items, datasheets and delivery schedules, use our dedicated Request for Quotation portal.
              </p>
              <Link
                href="/request-a-quote"
                className="inline-flex items-center gap-2 rounded-lg bg-[#FF4B32] hover:bg-[#17191C] text-white text-[13px] font-bold px-5 py-2.5 transition-colors"
              >
                Open dedicated RFQ portal <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative rounded-2xl bg-[#17191C] text-white p-5 overflow-hidden">
              <div className="absolute -top-14 -right-14 w-44 h-44 rounded-full bg-[#FFA028]/15 blur-[60px]" />
              <span className="relative text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FFA028]">
                Headquarters
              </span>
              <h3 className="relative text-white text-[16px] font-black mt-0.5 mb-1.5">
                {COMPANY_INFO.legalName}
              </h3>
              <p className="relative text-white/70 text-[13px] leading-relaxed mb-3">
                Operating out of Mumbai&apos;s industrial supply corridor, servicing refinery, petrochemical, power and water infrastructure projects globally.
              </p>
              <ul className="relative pt-3 border-t border-white/15 text-[12.5px] text-white/80 space-y-1.5">
                <li className="flex gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FFA028] shrink-0 mt-0.5" />
                  ISO 9001:2015 compliant procurement governance
                </li>
                <li className="flex gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FFA028] shrink-0 mt-0.5" />
                  EN 10204 Type 3.1 &amp; 3.2 documentation support
                </li>
              </ul>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF4B32] mb-2">
              <span className="h-[3px] w-9 rounded bg-[#FF4B32]" />
              What happens next
            </span>
            <h2 className="text-[1.3rem] sm:text-[1.6rem] font-black leading-[1.15] text-[#17191C] mb-5">
              From your message to a proposal
            </h2>
            <ol className="relative space-y-4">
              <span
                aria-hidden="true"
                className="absolute left-[27px] top-6 bottom-6 w-[3px] rounded bg-gradient-to-b from-[#FF4B32] to-[#FFA028]"
              />
              {next.map((n, k) => (
                <Reveal key={n.t} delay={k * 110}>
                  <li className="relative flex gap-4 items-center">
                    <span className="relative z-10 w-14 h-14 rounded-full bg-white border-[3px] border-[#FF4B32] text-[#FF4B32] flex items-center justify-center shadow-lg shrink-0">
                      <n.icon className="w-6 h-6" />
                    </span>
                    <span className="rounded-xl bg-white border border-[#929DA7]/20 shadow-sm px-4 py-2.5 flex-1">
                      <span className="block text-[10.5px] font-extrabold tracking-[0.2em] text-[#FF4B32]">
                        STEP 0{k + 1}
                      </span>
                      <span className="block text-[14.5px] font-extrabold text-[#17191C]">{n.t}</span>
                      <span className="block text-[12.5px] text-[#929DA7]">{n.d}</span>
                    </span>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
