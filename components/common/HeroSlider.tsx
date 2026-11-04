"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

export type Slide = {
  img: string;
  label: string;
  line1: string;
  line2: string;
  text: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  points: string[];
};

/** Auto-rotating hero with image, split headline, two CTAs and trust points per slide. */
export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((n: number) => setI((n + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  return (
    <section
      id="top"
      className="relative bg-[#17191C] text-white overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured solutions"
    >
      <div className="relative min-h-[520px] sm:min-h-[500px] lg:min-h-[520px]">
        {slides.map((s, k) => (
          <div
            key={s.label}
            aria-hidden={k !== i}
            className={`absolute inset-0 transition-opacity duration-[900ms] ${k === i ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
          >
            <Image src={s.img} alt="" fill priority={k === 0} sizes="100vw" className={`object-cover transition-transform duration-[7000ms] ease-out ${k === i ? "scale-110" : "scale-100"}`} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#17191C]/75 via-[#17191C]/60 to-[#17191C]/75" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17191C]/60 via-transparent to-transparent" />

            <div className="relative h-full max-w-[1320px] mx-auto px-5 sm:px-8 flex items-center justify-center text-center">
              <div className={`max-w-[860px] flex flex-col items-center pt-14 pb-24 sm:pt-12 sm:pb-24 transition-all duration-700 ${k === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/25 backdrop-blur px-3.5 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FFA028] mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#FF4B32]" />{s.label}
                </span>
                <h1 className="text-[1.85rem] leading-[1.1] sm:text-4xl lg:text-[2.6rem] font-black tracking-tight text-white mb-3">
                  {s.line1} <span className="text-[#FFA028]">{s.line2}</span>
                </h1>
                <p className="text-white/80 text-[14px] sm:text-base leading-relaxed mb-5 max-w-[600px]">{s.text}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 mb-5 w-full sm:w-auto">
                  <Link href={s.primary.href} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF4B32] hover:bg-[#E03820] text-white font-bold text-sm px-6 py-3 transition-colors shadow-lg shadow-[#FF4B32]/30">{s.primary.label} <ArrowRight className="w-4 h-4" /></Link>
                  <Link href={s.secondary.href} className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/60 hover:bg-white hover:text-[#17191C] text-white font-bold text-sm px-6 py-3 transition-colors">{s.secondary.label}</Link>
                </div>
                <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[12px] font-bold text-white/90">
                  {s.points.map((p) => (<li key={p} className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#FFA028]" />{p}</li>))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        {/* controls */}
        <div className="absolute z-20 bottom-12 sm:bottom-14 left-0 right-0">
          <div className="max-w-[1320px] mx-auto px-5 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {slides.map((s, k) => (
                <button key={s.label} type="button" aria-label={`Show slide ${k + 1}: ${s.label}`} aria-current={k === i} onClick={() => go(k)} className="relative h-1.5 rounded-full bg-white/30 overflow-hidden transition-all" style={{ width: k === i ? 56 : 28 }}>
                  {k === i && <span key={`${i}-${paused}`} className="absolute inset-y-0 left-0 bg-[#FF4B32]" style={{ width: "100%", animation: paused ? "none" : "slide-fill 6.5s linear" }} />}
                </button>
              ))}
              <span className="ml-3 text-xs font-bold text-white/70 tabular-nums">0{i + 1} / 0{slides.length}</span>
            </div>
            <div className="hidden sm:flex gap-2">
              <button type="button" aria-label="Previous slide" onClick={() => go(i - 1)} className="w-9 h-9 rounded-full border border-white/40 hover:bg-white hover:text-[#17191C] flex items-center justify-center transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              <button type="button" aria-label="Next slide" onClick={() => go(i + 1)} className="w-9 h-9 rounded-full border border-white/40 hover:bg-white hover:text-[#17191C] flex items-center justify-center transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
