"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

export type Group = { num: string; title: string; img: string; slug: string; items: string[]; more: string };

/** Left list + detail panel. */
export function ChemTabs({ groups }: { groups: Group[] }) {
  const [i, setI] = useState(0);
  const g = groups[i];
  return (
    <div className="grid lg:grid-cols-[320px_1fr] rounded-2xl overflow-hidden border border-[#D8DDE2] bg-white shadow-md max-w-[1100px] mx-auto">
      <div role="tablist" className="flex lg:flex-col overflow-x-auto bg-[#F5F6F7]">
        {groups.map((x, k) => (
          <button key={x.num} role="tab" aria-selected={k === i} onClick={() => setI(k)} className={`flex items-center gap-3 px-4 py-3 text-left whitespace-nowrap lg:whitespace-normal border-b border-[#D8DDE2] transition-colors ${k === i ? "bg-[#FF4B32] text-white" : "text-[#17191C] hover:bg-white"}`}>
            <span className={`text-xs font-black ${k === i ? "text-[#FFA028]" : "text-[#FF4B32]"}`}>{x.num}</span>
            <span className="text-[13px] font-extrabold">{x.title}</span>
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2">
        <div className="relative min-h-[200px]"><Image key={g.img} src={g.img} alt={g.title} fill sizes="400px" className="object-cover" /></div>
        <div className="p-6">
          <h3 className="text-xl font-black text-[#17191C] mb-3">{g.title}</h3>
          <ul className="space-y-1.5 mb-5 text-[13px]">{g.items.map((it) => (<li key={it} className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF4B32] mt-[7px] shrink-0" />{it}</li>))}</ul>
          <Link href={`/chemicals#${g.slug}`} className="inline-flex items-center gap-2 text-sm font-extrabold text-[#FF4B32] hover:text-[#E03820]">{g.more.replace(" →", "")} <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </div>
  );
}

/** One-open-at-a-time accordion with thumbnails. */
export function ChemAccordion({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="max-w-[860px] mx-auto space-y-2.5">
      {groups.map((g, k) => (
        <div key={g.num} className={`rounded-xl border bg-white overflow-hidden transition-shadow ${open === k ? "border-[#FF4B32] shadow-lg" : "border-[#D8DDE2]"}`}>
          <button onClick={() => setOpen(open === k ? -1 : k)} aria-expanded={open === k} className="w-full flex items-center gap-3 px-4 py-3 text-left">
            <span className="relative w-14 h-10 rounded-md overflow-hidden shrink-0"><Image src={g.img} alt="" fill sizes="56px" className="object-cover" /></span>
            <span className="text-xs font-black text-[#FF4B32]">{g.num}</span>
            <span className="flex-1 text-[15px] font-extrabold text-[#17191C]">{g.title}</span>
            <ChevronDown className={`w-5 h-5 text-[#5F6871] transition-transform ${open === k ? "rotate-180" : ""}`} />
          </button>
          <div className={`grid transition-all duration-500 ${open === k ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden">
              <div className="px-4 pb-4 pt-1 flex flex-wrap gap-2">
                {g.items.map((it) => (<span key={it} className="rounded-full bg-[#F5F6F7] border border-[#D8DDE2] px-3 py-1 text-[12px] font-bold text-[#17191C]">{it}</span>))}
                <Link href={`/chemicals#${g.slug}`} className="rounded-full bg-[#FF4B32] text-white px-3 py-1 text-[12px] font-bold hover:bg-[#E03820]">{g.more.replace(" →", "")} →</Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Featured photo on one side; hovering or clicking a list item swaps it in. */
export function ChemFeature({ groups, flip = false }: { groups: Group[]; flip?: boolean }) {
  const [i, setI] = useState(0);
  const g = groups[i];
  return (
    <div className={`grid lg:grid-cols-[1.15fr_1fr] gap-5 max-w-[1050px] mx-auto ${flip ? "lg:[direction:rtl]" : ""}`}>
      <Link href={`/chemicals#${g.slug}`} className="group relative min-h-[340px] rounded-2xl overflow-hidden text-white flex items-end lg:[direction:ltr]">
        <Image key={g.img} src={g.img} alt={g.title} fill sizes="560px" className="object-cover group-hover:scale-105 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17191C]/95 via-[#17191C]/35 to-transparent" />
        <div className="relative p-6">
          <span className="text-[11px] font-black text-[#FFA028] tracking-widest">GROUP {g.num}</span>
          <h3 className="text-2xl font-black text-white mb-2">{g.title}</h3>
          <div className="flex flex-wrap gap-1.5 mb-3">{g.items.map((x) => (<span key={x} className="rounded-full bg-white/15 border border-white/25 px-2.5 py-0.5 text-[11px] font-bold">{x}</span>))}</div>
          <span className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#FFA028]">{g.more.replace(" →", "")} <ArrowRight className="w-4 h-4" /></span>
        </div>
      </Link>
      <div className="space-y-2 lg:[direction:ltr]">
        {groups.map((x, k) => (
          <button key={x.num} onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)} className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${k === i ? "bg-[#FF4B32] border-[#FF4B32] text-white translate-x-1 shadow-md shadow-[#FF4B32]/25" : "bg-white border-[#D8DDE2] text-[#17191C] hover:border-[#FF4B32]"}`}>
            <span className={`text-xs font-black ${k === i ? "text-[#FFA028]" : "text-[#FF4B32]"}`}>{x.num}</span>
            <span className="relative w-12 h-8 rounded overflow-hidden shrink-0"><Image src={x.img} alt="" fill sizes="48px" className="object-cover" /></span>
            <span className="flex-1 text-[13px] font-extrabold">{x.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
