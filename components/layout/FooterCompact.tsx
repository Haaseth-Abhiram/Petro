import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ArrowRight, ShieldCheck, Award, FileCheck, BadgeCheck, Flame, Linkedin, Facebook, Youtube, Twitter } from "lucide-react";
import SuggestionPopup from "@/components/common/SuggestionPopup";
import PetroLogo from "@/components/common/PetroLogo";
import { COMPANY_INFO } from "@/data/company";

const company = [
  { l: "About Us", h: "/about" },
  { l: "Services", h: "/services" },
  { l: "Industries", h: "/industries" },
  { l: "Resources & FAQs", h: "/resources" },
  { l: "Careers", h: "/careers" },
  { l: "Contact Us", h: "/contact" },
];
const chem = [
  { l: "RO Chemicals", h: "/chemicals#ro-chemicals" },
  { l: "Cooling & Boiler Water", h: "/chemicals#cooling-water" },
  { l: "Wastewater / ETP", h: "/chemicals#etp-chemicals" },
  { l: "Treatment Plants", h: "/chemicals#water-treatment-plants" },
  { l: "Laboratory Equipment", h: "/chemicals#laboratory-equipment" },
];
const instr = [
  { l: "Tube & Pipe Fittings", h: "/instrumentation#tube-fittings" },
  { l: "Ball & Needle Valves", h: "/instrumentation#ball-valves" },
  { l: "Manifold & Check Valves", h: "/instrumentation#manifold-valves" },
  { l: "Tubing Coils", h: "/instrumentation#tubing-coils" },
  { l: "Analyser Systems", h: "/instrumentation#analyser-systems" },
];
const certs = [
  { n: "ISO 9001:2015", s: "Quality management", I: Award },
  { n: "EN 10204 3.1 / 3.2", s: "Material certificates", I: FileCheck },
  { n: "NACE MR0175", s: "Sour-service compliant", I: ShieldCheck },
  { n: "ASME / ASTM", s: "Standards compliant", I: BadgeCheck },
  { n: "API 607", s: "Fire-safe valves", I: Flame },
];
const legal = [
  { l: "Privacy Policy", h: "/privacy" },
  { l: "Terms of Service", h: "/terms" },
  { l: "Cookie Policy", h: "/cookies" },
  { l: "Sitemap", h: "/sitemap" },
];

const Col = ({ title, items }: { title: string; items: { l: string; h: string }[] }) => (
  <div>
    <h4 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#17191C] mb-2.5 pb-1.5 border-b-2 border-[#FF4B32] inline-block">{title}</h4>
    <ul className="space-y-1.5">
      {items.map((i) => (
        <li key={i.l}><Link href={i.h} className="text-[13px] text-[#5F6871] hover:text-[#FF4B32] hover:pl-1 transition-all">{i.l}</Link></li>
      ))}
    </ul>
  </div>
);

/** Compact footer: original-colour logo, three link columns, contact, newsletter, certifications and legal links. */
export default function FooterCompact() {
  const c = COMPANY_INFO.contact;
  return (
    <footer className="bg-gradient-to-b from-[#FFF8F0] to-[#F5F6F7] text-[#5F6871] border-t border-[#D8DDE2]">
      <div className="bg-gradient-to-r from-[#17191C] via-[#FF4B32] to-[#17191C]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white text-[15px] font-extrabold">Have a line list or datasheet? <span className="font-medium text-white/90">Our engineers reply within one business day.</span></p>
          <Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full bg-white text-[#FF4B32] text-[13px] font-extrabold px-5 py-2 hover:-translate-y-0.5 hover:shadow-lg transition-all whitespace-nowrap">Request a Quote <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-8 pb-5">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.9fr_1fr_1fr_1.1fr]">
          <div>
            <Link href="/" aria-label="Petro Engineering home" className="inline-block mb-2.5">
              <PetroLogo width={175} />
            </Link>
            <p className="text-[12.5px] text-[#5F6871] leading-relaxed max-w-[260px]">Sourcing and supply partner for oil &amp; gas, petrochemical, process utilities and analyser systems.</p>
            <div className="mt-3 flex gap-2">{[Linkedin, Facebook, Youtube, Twitter].map((I, k) => (<a key={k} href="#" aria-label="Social link" className="w-8 h-8 rounded-full bg-white border border-[#D8DDE2] text-[#FF4B32] hover:bg-[#FF4B32] hover:text-white hover:-translate-y-0.5 flex items-center justify-center transition-all"><I className="w-4 h-4" /></a>))}</div>
            <form className="mt-3 max-w-[290px]" action="/contact" aria-label="Stay updated"><label className="block text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[#17191C] mb-1.5">Stay updated</label><div className="flex items-center rounded-full bg-white border border-[#D8DDE2] shadow-[0_6px_18px_rgba(255,75,50,0.08)] focus-within:border-[#FF4B32] focus-within:shadow-[0_8px_22px_rgba(255,75,50,0.2)] p-1 transition-all"><Mail className="w-4 h-4 text-[#FF4B32] ml-3 shrink-0" /><input name="email" type="email" placeholder="your@email.com" className="min-w-0 flex-1 bg-transparent px-2.5 py-1.5 text-[13px] focus:outline-none text-[#17191C]" /><button className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF4B32] to-[#FFA028] text-white text-[12.5px] font-extrabold px-4 py-2 hover:shadow-lg transition-all">Subscribe<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /></button></div></form>
          </div>
          <Col title="Company" items={company} />
          <Col title="Chemicals" items={chem} />
          <Col title="Instrumentation" items={instr} />
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#17191C] mb-2.5 pb-1.5 border-b-2 border-[#FF4B32] inline-block">Contact</h4>
            <ul className="space-y-2 text-[13px]">
              <li><a href={`tel:${c.phoneRaw}`} className="flex gap-2 hover:text-[#FF4B32] text-[#5F6871]"><Phone className="w-4 h-4 text-[#FF4B32] mt-0.5 shrink-0" />{c.phone}</a></li>
              <li><a href={`mailto:${c.email}`} className="flex gap-2 hover:text-[#FF4B32] text-[#5F6871]"><Mail className="w-4 h-4 text-[#FF4B32] mt-0.5 shrink-0" />{c.email}</a></li>
              <li className="flex gap-2"><MapPin className="w-4 h-4 text-[#FF4B32] mt-0.5 shrink-0" />{c.address}</li>
              <li className="flex gap-2"><Clock className="w-4 h-4 text-[#FF4B32] mt-0.5 shrink-0" />Mon–Sat, 8am–6pm · Sun closed</li>
            </ul>
          </div>
        </div>

        {/* certified strip */}
        <div className="mt-6 pt-5 border-t border-[#D8DDE2]">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent to-[#FF4B32]" />
            <span className="inline-flex items-center gap-2 rounded-full bg-[#17191C] text-white text-[11px] font-extrabold uppercase tracking-[0.24em] pl-1.5 pr-4 py-1.5 shadow-md">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF4B32] to-[#FFA028] flex items-center justify-center"><ShieldCheck className="w-3.5 h-3.5 text-white" /></span>Certified &amp; Trusted
            </span>
            <span className="h-px w-16 sm:w-28 bg-gradient-to-l from-transparent to-[#FF4B32]" />
          </div>
          <ul className="flex flex-wrap items-stretch justify-center gap-2.5">
            {certs.map(({ n, s: sub, I }) => (
              <li key={n} className="group flex items-center gap-2.5 rounded-xl bg-white border border-[#D8DDE2] pl-2 pr-4 py-2 shadow-sm hover:shadow-[0_10px_24px_rgba(255,75,50,0.18)] hover:border-[#FF4B32] hover:-translate-y-1 transition-all duration-300">
                <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF4B32] to-[#FFA028] text-white flex items-center justify-center group-hover:rotate-6 group-hover:scale-110 transition-transform"><I className="w-[18px] h-[18px]" /></span>
                <span className="leading-tight"><span className="block text-[12.5px] font-extrabold text-[#17191C]">{n}</span><span className="block text-[10.5px] font-semibold text-[#5F6871]">{sub}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* legal bar */}
      <div className="bg-[#17191C]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-1.5 text-[11.5px] text-white/65">
          <span>© {new Date().getFullYear()} Petro Engineering Private Limited. All rights reserved.</span>
          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {legal.map((l) => (<Link key={l.l} href={l.h} className="hover:text-[#FFA028] transition-colors">{l.l}</Link>))}
            <SuggestionPopup className="hover:text-[#FFA028] transition-colors">Suggestions</SuggestionPopup>
          </nav>
        </div>
      </div>
    </footer>
  );
}
