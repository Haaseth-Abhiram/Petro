"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Clock, BadgeCheck, ArrowRight, X, Briefcase, CheckCircle2, Send } from "lucide-react";
import CareerForm from "@/components/forms/CareerForm";

export type Job = { role: string; title: string; d: string; img: string; exp: string; resp: string[] };

export default function CareersBoard({ jobs }: { jobs: Job[] }) {
  const [open, setOpen] = useState<Job | null>(null);
  const [apply, setApply] = useState<Job | null>(null);
  const close = () => { setOpen(null); setApply(null); };
  const active = apply || open;

  useEffect(() => {
    if (!active) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", k);
    document.documentElement.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.documentElement.style.overflow = ""; };
  }, [active]);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-5">
        {jobs.map((j) => (
          <article key={j.role} className="group rounded-3xl bg-white border border-[#E7E9EE] shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-[130px] overflow-hidden text-white">
              <Image src={j.img} alt="" fill sizes="600px" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17191C]/90 via-[#17191C]/55 to-[#8A0A0A]/40" />
              <span className="absolute left-5 top-4 inline-flex items-center gap-2 text-[10.5px] font-extrabold tracking-[0.2em]"><span className="w-1.5 h-1.5 rounded-full bg-[#F2B93B]" />WE&apos;RE HIRING</span>
              <h3 className="absolute left-5 bottom-3 text-[1.5rem] font-black leading-tight !text-white">{j.role}</h3>
            </div>
            <div className="p-5">
              <h4 className="text-[16px] font-extrabold text-[#17191C] mb-1">{j.title}</h4>
              <p className="text-[13.5px] leading-relaxed mb-3">{j.d}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {[{ i: MapPin, t: "Mumbai, India" }, { i: Clock, t: "Full-time" }, { i: BadgeCheck, t: j.exp }].map((c) => (
                  <span key={c.t} className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E9EE] px-3 py-1 text-[12px] font-semibold text-[#17191C]"><c.i className="w-3.5 h-3.5 text-[#C80808]" />{c.t}</span>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-[#E7E9EE] pt-3">
                <button type="button" onClick={() => setOpen(j)} className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#C80808] hover:gap-3 transition-all">View Details <span className="w-6 h-6 rounded-full bg-[#FBE9EC] flex items-center justify-center"><ArrowRight className="w-3.5 h-3.5" /></span></button>
                <button type="button" onClick={() => setApply(j)} className="rounded-full bg-[#C80808] hover:bg-[#8A0A0A] text-white text-[13px] font-extrabold px-5 py-2 shadow-[0_8px_20px_rgba(200,8,8,0.3)] transition-colors">Apply Now</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain flex p-3 sm:p-6 bg-[#14161A]/75 backdrop-blur-md animate-[routefade_.3s_ease-out_both]" onClick={close}>
          <div role="dialog" aria-modal="true" aria-label={active.title} style={{ maxHeight: "min(calc(92vh / var(--z)), calc(92dvh / var(--z)))" }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-[640px] m-auto flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.55)] animate-[routepop2_.45s_cubic-bezier(.2,.9,.25,1.1)_both]">
            {/* photo header */}
            <div className="relative shrink-0 h-[150px] sm:h-[170px] overflow-hidden bg-[#17191C] text-white">
              <Image src={active.img} alt="" fill sizes="640px" className="object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17191C] via-[#17191C]/60 to-[#8A0A0A]/50" />
              <div className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-[#E0A21A]/35 blur-[60px]" />
              <button type="button" aria-label="Close" onClick={close} className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur text-white flex items-center justify-center transition-colors"><X className="w-[18px] h-[18px]" /></button>
              <div className="absolute left-6 right-16 bottom-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur px-3 py-1 text-[10.5px] font-extrabold tracking-[0.18em]"><Briefcase className="w-3 h-3 text-[#F2B93B]" />{apply ? "APPLY FOR" : "OPEN POSITION"}</span>
                <h3 className="mt-2 text-[1.35rem] sm:text-[1.6rem] font-black leading-tight !text-white">{active.title}</h3>
              </div>
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B]" />
            </div>

            {/* body */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 sm:px-8 py-5">
              {apply ? (
                <CareerForm defaultRole={apply.role} />
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[{ i: MapPin, t: "Mumbai, India" }, { i: Clock, t: "Full-time" }, { i: BadgeCheck, t: active.exp }].map((c) => (
                      <span key={c.t} className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF8F0] border border-[#F0E3D2] px-3 py-1 text-[12px] font-bold text-[#17191C]"><c.i className="w-3.5 h-3.5 text-[#C80808]" />{c.t}</span>
                    ))}
                  </div>
                  <p className="text-[14.5px] leading-relaxed mb-5">{active.d}</p>
                  <h4 className="text-[11.5px] font-extrabold uppercase tracking-[0.2em] text-[#C80808] mb-3">Key responsibilities</h4>
                  <ul className="space-y-2.5">
                    {active.resp.map((r, i) => (
                      <li key={r} className="flex items-start gap-3 rounded-xl bg-[#FFF8F0] border border-[#F0E3D2] px-3.5 py-2.5 text-[13.5px] text-[#17191C]">
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C80808] to-[#E0A21A] text-white text-[11px] font-black flex items-center justify-center shrink-0">{i + 1}</span>{r}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 flex items-center gap-2 text-[12.5px] text-[#4a5159]"><CheckCircle2 className="w-4 h-4 text-[#C80808]" />Applications are reviewed by our technical team.</p>
                </>
              )}
            </div>

            {/* footer actions (details view) */}
            {!apply && (
              <div className="shrink-0 flex items-center gap-3 border-t border-[#F0E3D2] bg-white px-6 sm:px-8 py-4">
                <button type="button" onClick={close} className="rounded-xl border-2 border-[#E7E9EE] hover:border-[#17191C] text-[#17191C] text-[13.5px] font-bold px-5 py-3 transition-colors">Close</button>
                <button type="button" onClick={() => { setApply(open); setOpen(null); }} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C80808] to-[#E0A21A] text-white text-[14px] font-extrabold py-3 shadow-[0_10px_24px_rgba(200,8,8,0.35)] hover:-translate-y-0.5 transition-all"><Send className="w-4 h-4" />Apply for this role</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
