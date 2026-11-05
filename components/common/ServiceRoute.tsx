"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, Flag, MapPin, Search, CalendarDays, ShieldCheck, Warehouse, Lightbulb } from "lucide-react";

export type RouteService = { title: string; desc: string; slug: string; img: string };

const ICONS = [Search, CalendarDays, ShieldCheck, Warehouse, Truck, Lightbulb];

/** Supply route: six stations on a road with a truck that drives to the active one; details in one panel below. */
export default function ServiceRoute({ services }: { services: RouteService[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % services.length), 3600);
    return () => clearInterval(t);
  }, [paused, services.length]);

  const pick = (k: number) => { setActive(k); setPaused(true); };
  const s = services[active];
  const Icon = ICONS[active];

  const label = (x: RouteService, k: number, up: boolean) => (
    <button
      type="button"
      onClick={() => pick(k)}
      className={`relative block w-[190px] max-w-full mx-auto rounded-lg border px-3 py-2 text-left transition-all duration-500 ${
        active === k ? "bg-white border-[#C80808] shadow-[0_10px_26px_rgba(200,8,8,0.16)]" : "bg-white/70 border-[#E7E9EE]"
      }`}
    >
            <span className="block text-[13px] font-extrabold text-[#17191C] leading-snug">{x.title}</span>
      <span className={`absolute left-1/2 -translate-x-1/2 w-px h-4 bg-[#C80808]/40 ${up ? "-bottom-4" : "-top-4"}`} />
    </button>
  );

  const node = (x: RouteService, k: number) => (
    <button
      type="button"
      aria-label={x.title}
      onMouseEnter={() => pick(k)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => pick(k)}
      onBlur={() => setPaused(false)}
      className="relative mx-auto block"
    >
      {active === k && <span className="absolute -inset-1.5 rounded-full border-2 border-[#C80808] animate-ping opacity-60" />}
      <span className={`relative block w-[76px] h-[76px] rounded-full overflow-hidden border-4 transition-all duration-500 ${active === k ? "border-[#C80808] scale-110 shadow-xl" : "border-white shadow-md grayscale-[50%]"}`}>
        <Image src={x.img} alt="" fill sizes="90px" className="object-cover" />
        <span className="absolute inset-0 bg-[#17191C]/35" />
        <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-white">0{k + 1}</span>
      </span>
    </button>
  );

  const detail = (
    <div key={active} className="mt-6 max-w-[760px] mx-auto rounded-xl bg-white border border-[#E7E9EE] shadow-lg p-4 sm:p-5 flex gap-4 items-center animate-[routefade_.5s_ease-out_both]">
      <div className="flex-1">
        <h3 className="text-[15px] font-extrabold text-[#17191C]">{s.title}</h3>
        <p className="text-[13px] leading-relaxed text-[#4a5159]">{s.desc}</p>
      </div>
      <Link href={`/services#${s.slug}`} className="hidden sm:inline-flex items-center gap-1 text-[12.5px] font-extrabold text-[#C80808] whitespace-nowrap">Learn more <ArrowRight className="w-4 h-4" /></Link>
    </div>
  );

  return (
    <>
      {/* Desktop: horizontal route */}
      <div className="hidden lg:block" onMouseLeave={() => setPaused(false)}>
        <div className="grid grid-cols-6 items-end">
          {services.map((x, k) => <div key={x.slug} className="px-1 pb-4">{k % 2 === 0 ? label(x, k, true) : null}</div>)}
        </div>
        <div className="relative">
          <div className="absolute -inset-x-5 top-1/2 -translate-y-1/2 h-28 bg-gradient-to-r from-transparent via-[#F6E7D3]/70 to-transparent" />
          <div className="absolute left-[3%] right-[3%] top-1/2 h-3.5 -translate-y-1/2 rounded-full bg-[#17191C] shadow-[0_6px_18px_rgba(23,25,28,0.25)] overflow-hidden">
            <div className="absolute inset-x-3 top-1/2 h-[2px] -translate-y-1/2 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.55)_0_14px,transparent_14px_28px)]" />
            <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#C80808] to-[#E0A21A] transition-all duration-1000 ease-in-out" style={{ width: `${(((active + 0.5) / services.length) * 100) / 0.94 - 3.2}%` }} />
          </div>
          <span className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center"><span className="w-8 h-8 rounded-full bg-[#17191C] text-[#F2B93B] flex items-center justify-center shadow-lg"><Flag className="w-4 h-4" /></span><span className="absolute top-full mt-1 text-[9px] font-extrabold tracking-wider text-[#17191C]">ENQUIRY</span></span>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center"><span className="w-8 h-8 rounded-full bg-[#C80808] text-white flex items-center justify-center shadow-lg"><MapPin className="w-4 h-4" /></span><span className="absolute top-full mt-1 text-[9px] font-extrabold tracking-wider text-[#C80808] whitespace-nowrap">SITE</span></span>
          <span className="absolute top-1/2 -translate-x-1/2 -translate-y-[calc(50%+58px)] z-10 transition-all duration-1000 ease-in-out" style={{ left: `${((active + 0.5) / services.length) * 100}%` }}>
            <span key={active} className="flex w-10 h-10 rounded-full bg-[#C80808] text-white items-center justify-center shadow-xl ring-4 ring-white animate-[routepop_.5s_ease-out_both]"><Icon className="w-5 h-5" /></span>
            <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-[#C80808]" />
          </span>
          <div className="relative grid grid-cols-6">
            {services.map((x, k) => <div key={x.slug}>{node(x, k)}</div>)}
          </div>
        </div>
        <div className="grid grid-cols-6 items-start">
          {services.map((x, k) => <div key={x.slug} className="px-1 pt-4">{k % 2 === 1 ? label(x, k, false) : null}</div>)}
        </div>
        {detail}
      </div>

      {/* Mobile / tablet: compact stations, one detail panel */}
      <div className="lg:hidden">
        <div className="relative">
          <span className="absolute left-[27px] top-5 bottom-5 w-[3px] rounded bg-gradient-to-b from-[#C80808] to-[#E0A21A]/40" />
          {services.map((x, k) => (
            <button key={x.slug} type="button" onClick={() => pick(k)} className="relative flex w-full gap-3 items-center mb-2 last:mb-0 text-left">
              <span className={`relative shrink-0 w-14 h-14 rounded-full overflow-hidden border-4 transition-all ${active === k ? "border-[#C80808]" : "border-white shadow-md"}`}>
                <Image src={x.img} alt="" fill sizes="60px" className="object-cover" />
                <span className="absolute inset-0 bg-[#17191C]/45" />
                <span className="absolute inset-0 flex items-center justify-center text-base font-black text-white">0{k + 1}</span>
              </span>
              {active === k && <span key={active} className="absolute left-[30px] -top-1 w-6 h-6 rounded-full bg-[#C80808] text-white flex items-center justify-center ring-2 ring-white animate-[routepop_.5s_ease-out_both]"><Icon className="w-3.5 h-3.5" /></span>}
              <span className={`flex-1 rounded-lg border px-3 py-2 text-[13px] font-extrabold text-[#17191C] transition-all ${active === k ? "bg-white border-[#C80808] shadow-md" : "bg-white/70 border-[#E7E9EE]"}`}>{x.title}</span>
            </button>
          ))}
        </div>
        <div key={active} className="mt-4 rounded-xl bg-white border border-[#E7E9EE] shadow-lg p-4 animate-[routefade_.5s_ease-out_both]">
          <p className="text-[13px] leading-relaxed text-[#4a5159] mb-2">{s.desc}</p>
          <Link href={`/services#${s.slug}`} className="inline-flex items-center gap-1 text-[12.5px] font-extrabold text-[#C80808]">Learn more <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </>
  );
}
