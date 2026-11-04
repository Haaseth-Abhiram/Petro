"use client";

import React from "react";
import { Droplets, FlaskConical, Cog, Gauge, Wrench, Factory } from "lucide-react";
import { RED_FLAME, GOLD_FLAME, RED_TEXT, GOLD_TEXT } from "@/components/common/PetroLogo";

const CSS = `
@keyframes ld-draw{0%{stroke-dashoffset:1;opacity:1}55%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}
@keyframes ld-fill{0%,45%{opacity:0}75%,100%{opacity:1}}
@keyframes ld-glow{0%,100%{opacity:.4}50%{opacity:.9}}
@keyframes ld-line{0%{transform:scaleX(0)}70%,100%{transform:scaleX(1)}}
@keyframes ld-pop{0%{opacity:0;transform:translateY(16px) scale(.8)}100%{opacity:1;transform:none}}
@keyframes ld-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes ld-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.ld-stroke{fill:none;stroke-width:2.2;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;animation:ld-draw 1.8s ease-in-out infinite}
.ld-fill{animation:ld-fill 1.8s ease-in-out infinite}
.ld-glow{animation:ld-glow 1.8s ease-in-out infinite}
.ld-line{transform-origin:left;animation:ld-line 1.8s cubic-bezier(.4,0,.2,1) infinite}
.ld-pop{opacity:0;animation:ld-pop .6s cubic-bezier(.2,.9,.3,1.2) both}
.ld-bob{animation:ld-bob 2.6s ease-in-out infinite}
.ld-up{opacity:0;animation:ld-up .7s ease-out both}
@media (prefers-reduced-motion: reduce){.ld-stroke{animation:none;opacity:0}.ld-fill{animation:none;opacity:1}.ld-pop,.ld-bob,.ld-glow,.ld-line,.ld-up{animation:none;opacity:1;transform:none}}
`;

const PRODUCTS = [
  { I: FlaskConical, t: "Chemicals" },
  { I: Droplets, t: "Water treatment" },
  { I: Cog, t: "Valves" },
  { I: Wrench, t: "Fittings" },
  { I: Gauge, t: "Instruments" },
  { I: Factory, t: "Plants" },
];

/** Page loader: the Petro logo is drawn as an outline, then fills with colour, with a progress line beneath. */
export default function CinematicLoader({ message = "Loading", exiting = false, className = "" }: { message?: string; exiting?: boolean; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#14161A] transition-opacity duration-500 ${exiting ? "opacity-0 pointer-events-none" : "opacity-100"} ${className}`}>
      <style>{CSS}</style>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,8,8,.16),transparent_58%)]" />
      <div className="relative flex flex-col items-center px-6">
        <div className="relative w-[270px] sm:w-[400px]">
          <div className="ld-glow absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(224,162,26,.3),rgba(200,8,8,.15)_55%,transparent_75%)] blur-xl" />
          <svg viewBox="0 0 720 275" className="relative w-full h-auto" aria-label="Petro Engineering" role="img">
            <defs>
              <linearGradient id="ldr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF3B2F" /><stop offset="1" stopColor="#B80C0C" /></linearGradient>
              <linearGradient id="ldg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F7CB5A" /><stop offset="1" stopColor="#B8780B" /></linearGradient>
            </defs>
            <g className="ld-fill">
              <path d={RED_FLAME} fill="url(#ldr)" fillRule="evenodd" />
              <path d={GOLD_FLAME} fill="url(#ldg)" fillRule="evenodd" />
              <path d={RED_TEXT} fill="url(#ldr)" fillRule="evenodd" />
              <path d={GOLD_TEXT} fill="url(#ldg)" fillRule="evenodd" />
            </g>
            {[RED_FLAME, RED_TEXT].map((d, i) => (<path key={"r" + i} d={d} pathLength={1} className="ld-stroke" stroke="#FF6A4D" />))}
            {[GOLD_FLAME, GOLD_TEXT].map((d, i) => (<path key={"g" + i} d={d} pathLength={1} className="ld-stroke" stroke="#F2B93B" />))}
          </svg>
        </div>
        <ul className="mt-9 flex flex-wrap justify-center gap-x-3 gap-y-3 max-w-[330px] sm:max-w-[600px]">
          {PRODUCTS.map(({ I, t }, i) => (
            <li key={t} className="ld-pop flex flex-col items-center w-[84px] sm:w-[88px]" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
              <span className="ld-bob flex w-11 h-11 sm:w-12 sm:h-12 items-center justify-center rounded-full border border-[#E0A21A]/50 bg-white/[0.06] text-[#F2B93B] shadow-[0_0_18px_rgba(224,162,26,.2)]" style={{ animationDelay: `${i * 0.25}s` }}><I className="w-5 h-5" /></span>
              <span className="mt-2 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/65 text-center leading-tight">{t}</span>
            </li>
          ))}
        </ul>
        <div className="mt-7 h-[3px] w-[200px] sm:w-[280px] rounded-full bg-white/10 overflow-hidden"><div className="ld-line h-full w-full rounded-full bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B]" /></div>
        <div className="ld-up mt-4 text-[11px] font-bold uppercase tracking-[0.36em] text-white/60" style={{ animationDelay: ".2s" }}>{message}</div>
      </div>
    </div>
  );
}
