import React from "react";
import Link from "next/link";
import { Home as HomeIcon, ChevronRight } from "lucide-react";

export type LegalSection = { h: string; p: string[] };

export default function LegalPage({ crumb, title, intro, sections }: { crumb: string; title: string; intro: string; sections: LegalSection[] }) {
  return (
    <div className="w-full">
      <section className="relative bg-[#17191C] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/90 via-[#3a0d0d]/80 to-[#A81010]/50" />
        <div className="absolute -top-20 -right-16 w-[360px] h-[360px] rounded-full bg-[#E0A21A]/25 blur-[100px]" />
        <div className="relative max-w-[900px] mx-auto px-5 sm:px-8 py-9">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-white/70 mb-3"><Link href="/" className="hover:text-white inline-flex items-center gap-1"><HomeIcon className="w-3.5 h-3.5" />Home</Link><ChevronRight className="w-3.5 h-3.5" /><span className="text-[#F2B93B] font-semibold">{crumb}</span></nav>
          <h1 className="text-[2rem] sm:text-[2.5rem] font-black tracking-tight leading-tight">{title}</h1>
          <p className="text-white/75 text-[14.5px] mt-2 max-w-[640px]">{intro}</p>
        </div>
      </section>
      <section className="py-10 bg-white">
        <div className="max-w-[820px] mx-auto px-5 sm:px-8 space-y-7">
          {sections.map((s, i) => (
            <div key={s.h}>
              <h2 className="text-[1.15rem] font-extrabold text-[#17191C] mb-2"><span className="text-[#C80808] mr-2">{String(i + 1).padStart(2, "0")}</span>{s.h}</h2>
              {s.p.map((t) => (<p key={t} className="text-[14.5px] leading-relaxed mb-2">{t}</p>))}
            </div>
          ))}
          {sections.length > 0 && <p className="text-[12.5px] text-[#929DA7] pt-4 border-t border-[#F0E3D2]">This page is a general summary and should be reviewed by your legal advisor before publication.</p>}
        </div>
      </section>
    </div>
  );
}
